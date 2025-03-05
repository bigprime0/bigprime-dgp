<template>
  <div class="ds-form">
    <tiny-form ref="dataSecurityStandardsFormRef" :model="dataSecurityStandardsFormData"
               :disabled="dataSecurityStandardsFormData.status > 0"
               :rules="dataSecurityStandardsFormRules" label-width="150px" overflow-title>
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.standards.field.code')" prop="code" :show-message="false">
            <tiny-input v-model="dataSecurityStandardsFormData.code"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.standards.field.name')" prop="name" :show-message="false">
            <tiny-input v-model="dataSecurityStandardsFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.standards.field.file')">
            <Attachment ref="attachmentRef"
                        :attachment-uuid="dataSecurityStandardsFormData.file"
                        :is-delete="dataSecurityStandardsFormData.status === 0"/>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>


      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.standards.field.approvalDate')">
            <tiny-date-picker size="mini" v-model="dataSecurityStandardsFormData.approvalDate"></tiny-date-picker>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.standards.field.implementationDate')">
            <tiny-date-picker size="mini" v-model="dataSecurityStandardsFormData.implementationDate"></tiny-date-picker>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.standards.field.filingsCode')">
            <tiny-input v-model="dataSecurityStandardsFormData.filingsCode"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.standards.field.filingDate')">
            <tiny-date-picker size="mini" v-model="dataSecurityStandardsFormData.filingDate"></tiny-date-picker>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.standards.field.remark')">
            <tiny-input v-model="dataSecurityStandardsFormData.remark" type="textarea" :maxlength="255"
                        show-header-overflow="tooltip" show-overflow="tooltip"
                        show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeDataSecurityStandardsForm(false)">
          {{ $t('common.operations.cancel') }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveDataSecurityStandardsData">
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
import { DataSecurityStandardsService } from '@/services/governance/security-standards'
import Attachment from '@/views/components/attachment/attachment.vue'

const { t } = useI18n()
const dataSecurityStandardsFormRef = ref()
const dataSecurityStandardsFormData = defineModel('dataSecurityStandardsFormData', { default: {} as any })

const dataSecurityStandardsFormRules = computed(() => {
  let ruleList = {
    code: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const attachmentRef = ref()

const saveDataSecurityStandardsData = () => {
  dataSecurityStandardsFormRef.value
    .validate()
    .then(async () => {
      dataSecurityStandardsFormData.value.file = attachmentRef.value.attachmentUuid
      await DataSecurityStandardsService.save(dataSecurityStandardsFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataSecurityStandardsForm(true)
    })
}

const closeDataSecurityStandardsForm = (isUp: boolean) => {
  emitter.emit('closeDataSecurityStandardsForm', isUp)
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
