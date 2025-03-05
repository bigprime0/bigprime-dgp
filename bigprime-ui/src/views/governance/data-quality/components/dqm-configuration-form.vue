<template>
  <SchedulerJobForm ref="schedulerJobFormRef"
                    :scheduler-job-form-data="dataQualityConfigFormData.schedulerJobParam"
                    :scheduler-actuator-enums="schedulerActuatorEnums"
                    :show-button="false" />

  <tiny-row style="text-align: center">
    <tiny-button plain type="primary" @click="closeDataQualityConfigForm(false)"> {{ $t('common.operations.cancel')
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { type DataQualityConfigParam, DataQualityConfigService } from '@/services/governance/quality-config'
import SchedulerJobForm from '@/views/scheduler/job/components/scheduler-job-form.vue'
import type { SelectModel } from '@/utils/tool'

const schedulerActuatorEnums = defineModel('schedulerActuatorEnums', { default: [] as SelectModel[] })
const schedulerJobFormRef = ref()

const { t } = useI18n()
const dataQualityConfigFormData = defineModel<DataQualityConfigParam>('dataQualityConfigFormData', { default: {} })

const saveLoading = ref(false)
const saveDataQualityConfigData = () => {
  schedulerJobFormRef.value.schedulerJobFormRef.validate().then(async () => {
    dataQualityConfigFormData.value.name = dataQualityConfigFormData.value.schedulerJobParam.name
    schedulerJobFormRef.value.setActuatorData()
    saveLoading.value = true
    const result = await DataQualityConfigService.save(dataQualityConfigFormData.value).catch(error => {
      saveLoading.value = false
    })
    saveLoading.value = false
    if (result) {
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataQualityConfigForm(true)
    }
  })
}

const closeDataQualityConfigForm = (isUp: boolean) => {
  emitter.emit('closeDataQualityConfigForm', isUp)
}
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
