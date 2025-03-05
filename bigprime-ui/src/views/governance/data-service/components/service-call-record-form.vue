<template>
  <div class="ds-form">
    <tiny-form ref="dataServiceApiLogFormRef" :model="dataServiceApiLogFormData" :rules="dataServiceApiLogFormRules"
               label-width="100px" disabled overflow-title>
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.errorMessage')">
            <tiny-input v-model="dataServiceApiLogFormData.errorMessage"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.apiId')" :show-message="false" prop="apiId" >
            <tiny-input v-model="dataServiceApiLogFormData.apiId"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.ip')" :show-message="false" prop="ip" >
            <tiny-input v-model="dataServiceApiLogFormData.ip"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.reqParameter')" :show-message="false" prop="reqParameter" >
            <tiny-input v-model="dataServiceApiLogFormData.reqParameter"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.type')" :show-message="false" prop="type" >
            <tiny-input v-model="dataServiceApiLogFormData.type"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.path')" :show-message="false" prop="path" >
            <tiny-input v-model="dataServiceApiLogFormData.path"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.name')" :show-message="false" prop="name" >
            <tiny-input v-model="dataServiceApiLogFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.errorCode')">
            <tiny-input v-model="dataServiceApiLogFormData.errorCode"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.returnCount')">
            <tiny-input v-model="dataServiceApiLogFormData.returnCount"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('service.api.log.field.status')">
            <tiny-input v-model="dataServiceApiLogFormData.status"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeDataServiceApiLogForm(false)"> {{ $t('common.operations.cancel')
          }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveDataServiceApiLogData">
          {{ $t('common.operations.save') }}
        </tiny-button>
      </tiny-row>
    </tiny-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { type DataServiceApiLogParam, DataServiceApiLogService } from '@/services/service/service-log'


const { t } = useI18n()
const dataServiceApiLogFormRef = ref()
const dataServiceApiLogFormData = defineModel<DataServiceApiLogParam>('dataServiceApiLogFormData', { default: {} })

const dataServiceApiLogFormRules = computed(() => {
  let ruleList = {
    apiId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    ip: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    reqParameter: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    type: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    path: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const saveDataServiceApiLogData = () => {
  dataServiceApiLogFormRef.value
    .validate()
    .then(async () => {
      await DataServiceApiLogService.save(dataServiceApiLogFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataServiceApiLogForm(true)
    })
}

const closeDataServiceApiLogForm = (isUp: boolean) => {
  emitter.emit('closeDataServiceApiLogForm', isUp)
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
