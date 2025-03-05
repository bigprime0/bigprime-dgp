<template>
  <div class="ds-form">
    <tiny-form ref="formRef" overflow-title :model="formData" :rules="formRules" label-width="100px" :disabled="formData.parameterType !== 1">
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('参数Key')" :show-message="false" prop="parameterKey">
            <tiny-input v-model="formData.parameterKey"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('参数值')" :show-message="false" prop="parameterValue">
            <tiny-input v-model="formData.parameterValue"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>


      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('参数描述')">
            <tiny-input v-model="formData.remarks" type="textarea" maxlength="500"></tiny-input>
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
import { FlinkGlobalVariableService } from '@/services/development/global-variable'

const { t } = useI18n()
const formRef = ref()
const formData = defineModel<any>('formData', { default: {} })

const formRules = computed(() => {
  let ruleList = {
    parameterKey: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    parameterValue: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})


const handleSave = () => {
  formRef.value
    .validate()
    .then(async () => {
      await FlinkGlobalVariableService.save(formData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      handleCancel(true)
    })
}

const handleCancel = (isUp: boolean) => {
  emitter.emit('GlobalVariableClose', isUp)
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
