<template>
  <div class="ds-form">
    <tiny-form overflow-title ref="dataQualityConfigSysFormRef" :model="dataQualityConfigSysFormData"
               :rules="dataQualityConfigSysFormRules"
               label-width="100px">
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('governance.quality.config.field.name')" :show-message="false" prop="name">
            <tiny-input v-model="dataQualityConfigSysFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('scheduler.job.field.cron')">
            <tiny-input v-model="dataQualityConfigSysFormData.schedulerJobParam.cron">
              <template #append>
                <tiny-button :reset-time="500" type="primary" @click="openCron">
                  {{ $t('common.operations.generate') }}
                </tiny-button>
              </template>
            </tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="3">
          <tiny-form-item :label="$t('scheduler.job.field.concurrent')">
            <tiny-switch v-model="dataQualityConfigSysFormData.schedulerJobParam.concurrent" :true-value=1
                         :false-value=0></tiny-switch>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="3">
          <tiny-form-item :label="$t('scheduler.job.field.status')">
            <tiny-switch v-model="dataQualityConfigSysFormData.schedulerJobParam.status" :true-value=1
                         :false-value=0></tiny-switch>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item>
            <ActuatorDb ref="actuatorDbRef"
                        :db-actuator-param-json="dataQualityConfigSysFormData.schedulerJobParam.actuatorData" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row v-if="dataQualityConfigSysFormData.ruleType === 'standard'">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('governance.standard')">
            <tiny-select v-model="standardValue"
                         :searchable="true" clearable>
              <tiny-option v-for="item in standardList" :key="item.id" :label="item.name"
                           :value="item.id"></tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeDataQualityConfigSysForm(false)">
          {{ $t('common.operations.cancel')
          }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary"
                     v-loading.lock.fullscreen="saveLoading"
                     tiny-loading__background="rgba(0, 0, 0, 0.2)"
                     tiny-loading__size="large"
                     @click="saveDataQualityConfigData">
          {{ $t('common.operations.save') }}
        </tiny-button>
      </tiny-row>
    </tiny-form>
  </div>

  <div>
    <tiny-drawer title="cron"
                 :visible="cronDrawer"
                 @update:visible="cronDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="cronDrawer = false">
      <div>
        <Cron :cronExpression="cronExpression" />
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watchEffect } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { type DataQualityConfigParam, DataQualityConfigService } from '@/services/governance/quality-config'
import ActuatorDb from '@/views/components/actuator/components/actuator-db.vue'
import { isEmpty } from 'lodash-es'
import { StandardService } from '@/services/governance/standard'
const Cron = defineAsyncComponent(() => import('@/components/cron/index.vue'))

const { t } = useI18n()
const dataQualityConfigSysFormRef = ref()
const dataQualityConfigSysFormData = defineModel<DataQualityConfigParam>('dataQualityConfigSysFormData', {
  default: {
    schedulerJobParam: {}
  } as DataQualityConfigParam
})

const cronDrawer = ref(false)
const cronExpression = ref()
const actuatorDbRef = ref()

const standardValue = ref()
const standardList = ref()

const dataQualityConfigSysFormRules = computed(() => {
  let ruleList = {
    name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    cron: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const openCron = () => {
  cronExpression.value = dataQualityConfigSysFormData.value.schedulerJobParam.cron
  cronDrawer.value = true
}
emitter.on('closeCron', (cronValue: any) => {
  dataQualityConfigSysFormData.value.schedulerJobParam.cron = cronValue
  cronDrawer.value = false
})

const saveLoading = ref(false)
const saveDataQualityConfigData = () => {
  dataQualityConfigSysFormRef.value
    .validate()
    .then(async () => {
      dataQualityConfigSysFormData.value.schedulerJobParam.name = dataQualityConfigSysFormData.value.name
      dataQualityConfigSysFormData.value.schedulerJobParam.schedulerId = 1
      dataQualityConfigSysFormData.value.schedulerJobParam.actuator = 'DB'
      dataQualityConfigSysFormData.value.schedulerJobParam.actuatorData = actuatorDbRef.value.dataJson
      if (dataQualityConfigSysFormData.value.ruleType === 'uniqueness') {
        //唯一性检测
        dataQualityConfigSysFormData.value.schedulerJobParam.executeClass = 'com.bigprime.quartz.task.quality.UniquenessDetectionTask'
        dataQualityConfigSysFormData.value.schedulerJobParam.dataJson = ''
      } else if (dataQualityConfigSysFormData.value.ruleType === 'integrity') {
        //完整性检测
        dataQualityConfigSysFormData.value.schedulerJobParam.executeClass = 'com.bigprime.quartz.task.quality.IntegrityTestingTask'
        dataQualityConfigSysFormData.value.schedulerJobParam.dataJson = ''
      } else if (dataQualityConfigSysFormData.value.ruleType === 'standard') {
        //标准性检测
        dataQualityConfigSysFormData.value.schedulerJobParam.executeClass = 'com.bigprime.quartz.task.quality.StandardTestingTask'
        dataQualityConfigSysFormData.value.schedulerJobParam.dataJson = standardValue.value
      }
      saveLoading.value = true
      const result = await DataQualityConfigService.save(dataQualityConfigSysFormData.value).catch(error => {
        saveLoading.value = false
      })
      saveLoading.value = false
      if(result){
        Modal.message({
          message: t('common.prompt.save.success'),
          status: 'success'
        })
        closeDataQualityConfigSysForm(true)
      }
    })
}

const closeDataQualityConfigSysForm = (isUp: boolean) => {
  emitter.emit('closeDataQualityConfigSysForm', isUp)
}

watchEffect(async () => {
  if (dataQualityConfigSysFormData.value.ruleType === 'standard') {
    if(isEmpty(standardList.value)){
      const result = await StandardService.getList({})
      let data = [] as any
      result.forEach(o => {
        if (o.status === 2) {
          data.push({
            id: o.id.toString(),
            name: o.cnName
          })
        }
      })
      standardList.value = data
    }
    standardValue.value = dataQualityConfigSysFormData.value.schedulerJobParam.dataJson
  }
})
</script>

<style scoped lang="less">
.span-font {
  font-size: 12px;
  color: #000000;
}

.ds-form {
  padding: 10px;

  :deep(.container-form) {
    margin-top: 0;
    padding: 20px 15px 15px 15px;
    border-radius: 0;
    box-shadow: 0 0 2px 2px #eee;
    height: 100vh - 80px;
    height: calc(100vh - 130px);
  }
}
</style>
