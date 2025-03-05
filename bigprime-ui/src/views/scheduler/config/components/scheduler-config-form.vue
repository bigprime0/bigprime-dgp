<template>
  <div class="ds-form">
    <tiny-form ref="formRef" overflow-title :model="formData" :rules="formRules" label-width="100px">
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('scheduler.config.field.name')" :show-message="false" prop="name">
            <tiny-select :disabled="formData.id === 1" v-model="formData.name">
              <tiny-option v-for="item in schedulerEnums" :key="item.value" :label="item.value"
                           :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('scheduler.config.field.type')" :show-message="false" prop="type">
            <tiny-radio v-model="formData.type" :label=1>{{ $t('scheduler.config.field.type.http') }}</tiny-radio>
            <tiny-radio v-model="formData.type" :label=2>{{ $t('scheduler.config.field.type.server') }}</tiny-radio>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="8">
          <tiny-form-item :label="$t('scheduler.config.field.url')" :show-message="false" prop="url">
            <tiny-input v-model="formData.url"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="8">
          <tiny-form-item :label="$t('scheduler.config.field.token')">
            <tiny-input v-model="formData.token">
              <template #append>
                <tiny-button :reset-time="500" type="primary"  @click="createUuid()"> {{ $t('common.operations.generate') }}
                </tiny-button>
              </template>
            </tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="handleCancel(false)"> {{ $t('common.operations.cancel') }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="handleSave"> {{ $t('common.operations.save') }}
        </tiny-button>
      </tiny-row>
    </tiny-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { type SchedulerParam, SchedulerService } from '@/services/scheduler/scheduler-config'
import { v4 as uuidv4 } from 'uuid'
import type { SelectModel } from '@/utils/tool'
import { isEmpty } from 'lodash-es'
import { CurrencyService } from '@/services/currency/currency'

const { t } = useI18n()
const formRef = ref()
const formData = defineModel<SchedulerParam>('formData', { default: {} })

const formRules = computed(() => {
  let ruleList = {
    name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    type: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    url: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const schedulerEnums = ref<SelectModel[]>()
onMounted(async () => {
  if(isEmpty(schedulerEnums.value)){
    schedulerEnums.value = await CurrencyService.getEnum("SchedulerEnum")
  }
})

const createUuid = () => {
  formData.value.token = uuidv4()
}

const handleSave = () => {
  formRef.value
    .validate()
    .then(async () => {
      await SchedulerService.save(formData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      handleCancel(true)
    })
}

const handleCancel = (isUp: boolean) => {
  emitter.emit('drawerCancel', isUp)
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
