<template>
  <JobDefineForm :needFilter="needFilter" :subcategories="subcategories" :stepConfigs="stepConfigs"
                 :JobDefineFormData="sourceFormData"></JobDefineForm>
  <div class="step-button">
    <tiny-button type="primary" :icon="IconDone" @click="handleSave">
      {{ t('common.operations.save') }}
    </tiny-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  type integrationConfigDetail,
  IntegrationConfigService,
  type integrationJob
} from '@/services/integration/integration-config'
import JobDefineForm from '@/views/integration/job/job-define-form.vue'
import { forIn, indexOf, isEmpty, find } from 'lodash-es'
import { iconDone } from '@opentiny/vue-icon'
import { nanoid } from 'nanoid'
import { Modal } from '@opentiny/vue'
import emitter from '@/utils/evnetbus'

const table = defineModel('table', { default: '' })
const sourceFormData = ref({} as any)
const IconDone = iconDone()
const { t } = useI18n()
const needFilter = ref(false)
const subcategories = ref<string[]>([])
const selectConfigs = ref<integrationConfigDetail[]>([])
const stepConfigs = ref<integrationConfigDetail[]>([])

const sinkFormData = ref<any>({} as any)
const job = ref<integrationJob>({
  id: 0,
  engine: 'addax',
  jobName: '',
  formDatas: '',
  content: ''
})

const _setStepConfig = async () => {
  const result: integrationConfigDetail[] = await IntegrationConfigService.getDetailList()
  selectConfigs.value = result.filter(item => item.product === 'addax')
  stepConfigs.value = selectConfigs.value.filter(item => item.category == 'reader' || item.subCategory == 'reader')
  subcategories.value = []
  stepConfigs.value.forEach(item => {
    if (!isEmpty(item.subCategory)) {
      if (indexOf(subcategories.value, item.subCategory) == -1) {
        subcategories.value.push(item.subCategory)
      }
    }
  })
  needFilter.value = subcategories.value.length > 0
}

const _buildJob = async () => {
  //构造任务
  let JobContext = {} as any
  JobContext.job = {}
  JobContext.job.content = {}

  //构建Source
  if (sourceFormData.value.plugin_name) {
    let sourcePart = _buildPart(sourceFormData, 'reader')
    JobContext.job.content.reader = sourcePart
  }

  if (table.value) {
    let writer = await IntegrationConfigService.getMasterDataWriter({ table: table.value })
    sinkFormData.value = writer
    sinkFormData.value.plugin_name = 'rdbmswriter'
    let sinkPart = _buildPart(sinkFormData, 'writer')
    JobContext.job.content.writer = sinkPart
  }
  return JSON.stringify(JobContext, null, 2)
}

const _buildPart = (formData: any, category: string) => {
  let result = {} as any
  result.parameter = {}
  if (formData.value.plugin_name) {
    if (!result.name) {
      result.name = formData.value.plugin_name
    }
    let partConfigs = selectConfigs.value.filter(t => t.category == category && t.subCategory == formData.value.plugin_name)
    forIn(formData.value, (value, key) => {
      let find = partConfigs.find(s => s.configCode == key && s.configCode != 'name')
      if (find) {
        if (find.isVisible && find.isProperty && find.isEnable && value != null && value != '') {
          if (find.compType == 'array') {
            if (value.indexOf(',') != -1) {
              value = value.split(',')
            } else if (value.indexOf('|') != -1) {
              value = value.split('|')
            } else {
              let valarr: any = []
              valarr.push(value)
              value = valarr
            }
          }
          if (find.compType == 'json') {
            value = JSON.parse(value)
          }
          if (find.configGroup) {
            if (!result.parameter[find.configGroup]) {
              result.parameter[find.configGroup] = {}
            }
            result.parameter[find.configGroup][find.configKey] = value
          } else {
            result.parameter[find.configKey] = value
          }
        }
      }
    })
  }
  return result
}

const handleSave = async () => {
  job.value.jobName = nanoid(8)
  job.value.content = await _buildJob()
  let form_datas: any = {}
  form_datas.source = sourceFormData.value
  form_datas.sink = sinkFormData.value
  job.value.formDatas = JSON.stringify(form_datas)
  if (isEmpty(job.value.url)) {
    let urlData = find(selectConfigs.value, { category: 'setting', configCode: 'addax_home' })
    if (urlData) {
      job.value.url = urlData.defaultValue
    }
  }
  const result: any = await IntegrationConfigService.saveAndSubmitJob(job.value)
  if (result.status == 'success') {
    Modal.message({
      message: job.value.id > 0 ? t('common.prompt.update.success') : t('common.prompt.save.success'),
      status: 'success'
    })
    emitter.emit('jobMasterDrawerClose')
  } else {
    Modal.message({
      message: job.value.id > 0 ? t('common.prompt.update.fail') : t('common.prompt.save.fail'),
      status: 'error'
    })
  }
}

onMounted(() => {
  _setStepConfig()
})
</script>

<style scoped lang="less">
.step-button {
  margin: 0;
  text-align: center;
  padding-top: 20px;
}
</style>
