<template>
  <div class="ds-form">
    <tiny-form ref="dataSecurityLevelFormRef" :model="dataSecurityLevelFormData" :rules="dataSecurityLevelFormRules"
               label-width="100px" overflow-title>
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('security.level.field.sensitiveLevel')" prop="sensitiveLevel"
                          :show-message="false">
            <tiny-input v-model="dataSecurityLevelFormData.sensitiveLevel"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('security.level.field.sensitiveName')" prop="sensitiveName" :show-message="false">
            <tiny-input v-model="dataSecurityLevelFormData.sensitiveName"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeDataSecurityLevelForm(false)"> {{ $t('common.operations.cancel')
          }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveDataSecurityLevelData">
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
import { DataSecurityLevelService } from '@/services/governance/security-level'


const { t } = useI18n()
const dataSecurityLevelFormRef = ref()
const dataSecurityLevelFormData = defineModel('dataSecurityLevelFormData', { default: {} as any })

const dataSecurityLevelFormRules = computed(() => {
  let ruleList = {
    sensitiveLevel: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    sensitiveName: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const saveDataSecurityLevelData = () => {
  dataSecurityLevelFormRef.value
    .validate()
    .then(async () => {
      await DataSecurityLevelService.save(dataSecurityLevelFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataSecurityLevelForm(true)
    })
}

const closeDataSecurityLevelForm = (isUp: boolean) => {
  emitter.emit('closeDataSecurityLevelForm', isUp)
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
