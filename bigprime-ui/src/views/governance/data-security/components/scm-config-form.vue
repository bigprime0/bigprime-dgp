<template>
  <div class="ds-form">
    <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
    </tiny-divider>
    <tiny-form ref="supportFormRef" overflow-title :model="support" :rules="supportFormRules"
               :disabled="dataSecurityConfigFormData.status > 0"
               label-width="150px">
      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item
            :label="dataSecurityConfigFormData.securityType === 'Crypto' ? $t('security.config.field.crypto.method') : $t('security.config.field.desensitize.method')"
            :show-message="false" prop="supportType">
            <tiny-select v-model="support.supportType"
                         :disabled="dataSecurityConfigFormData.id > 0"
                         @change="supportTypeChange" clearable>
              <tiny-option v-for="item in securitySupports"
                           :key="item.supportType"
                           :label="useI18n().locale.value === 'zhCN' ? item.supportName : item.supportType"
                           :value="item.supportType">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>

    <tiny-form ref="dataSecurityConfigFormRef" :model="dataSecurityConfigFormData" :rules="dataSecurityConfigFormRules"
               :disabled="dataSecurityConfigFormData.status > 0"
               label-width="150px" overflow-title>
      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item
            :label="dataSecurityConfigFormData.securityType === 'Crypto' ? $t('security.config.field.crypto.name') : $t('security.config.field.desensitize.name')"
            :show-message="false" prop="name">
            <tiny-input v-model="dataSecurityConfigFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.level.field.sensitiveLevel')" :show-message="false" prop="levelId">
            <tiny-select v-model="dataSecurityConfigFormData.levelId" clearable>
              <tiny-option v-for="item in levelData" :key="item.id" :label="item.sensitiveName"
                           :value="item.id"></tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item
            :label="dataSecurityConfigFormData.securityType === 'Crypto' ? $t('security.config.field.crypto.describe') : $t('security.config.field.desensitize.describe')"
            :show-message="false" prop="describe">
            <tiny-input v-model="dataSecurityConfigFormData.describe" type="textarea" :maxlength="255"
                        show-header-overflow="tooltip" show-overflow="tooltip"
                        show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.config.field.remark')">
            <tiny-input v-model="dataSecurityConfigFormData.remark" type="textarea" :maxlength="255"
                        show-header-overflow="tooltip" show-overflow="tooltip"
                        show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>

    <tiny-divider v-if="!isEmpty(supportModels)" content-position="left" content-color="#7693f5">
      {{ $t('security.configuration') }}
    </tiny-divider>

    <tiny-grid v-show="!isEmpty(supportModels)" style="margin-top: 10px;max-height: 300px;overflow: auto;"
               :disabled="dataSecurityConfigFormData.status > 0"
               ref="supportModelsRef"
               :data="supportModels"
               :fit="true" size="medium" auto-resize border :stripe="true"
               :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
               :edit-rules="supportModelsRules"
               highlight-hover-row>
      <tiny-grid-column :title="$t('security.support.parameter')">
        <template v-slot="data">
          {{ useI18n().locale.value === 'zhCN' ? data.row.fieldDescription : data.row.fieldName }}
        </template>
      </tiny-grid-column>

      <tiny-grid-column field="fieldValue" :editor="{}" :title="$t('security.support.value')">
        <template #edit="data">
          <tiny-input v-if="data.row.fieldType === 'INT'" v-model="data.row.fieldValue" type="number"></tiny-input>
          <tiny-input v-else v-model="data.row.fieldValue"></tiny-input>
        </template>
        <template v-slot="data">
          <tiny-input v-if="data.row.fieldType === 'INT'" v-model="data.row.fieldValue" type="number"></tiny-input>
          <tiny-input v-else v-model="data.row.fieldValue"></tiny-input>
        </template>
      </tiny-grid-column>
    </tiny-grid>

    <br />
    <tiny-row v-if="dataSecurityConfigFormData.status === 0" style="text-align: center">
      <tiny-button plain type="primary" @click="closeDataSecurityConfigForm(false)"> {{ $t('common.operations.cancel')
        }}
      </tiny-button>
      <tiny-button :reset-time="500" type="primary" @click="saveDataSecurityConfigData">
        {{ $t('common.operations.save') }}
      </tiny-button>
    </tiny-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { SecurityService } from '@/services/spi/security'
import { find, isEmpty } from 'lodash-es'
import { validForm } from '@/utils/tool'


const { t } = useI18n()
const dataSecurityConfigFormRef = ref()
const dataSecurityConfigFormData = defineModel('dataSecurityConfigFormData', { default: {} as any })
const levelData = defineModel('levelData', { default: [] as any })
const securitySupports = defineModel('securitySupports', { default: [] as any })
const supportFormRef = ref()
const support = defineModel('support', { default: {} as any })
const supportModelsRef = ref()
const supportModels = defineModel('supportModels', { default: [] as any })

const dataSecurityConfigFormRules = computed(() => {
  let ruleList = {
    name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    levelId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    describe: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const supportFormRules = computed(() => {
  let ruleList = {
    supportType: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const supportModelsRules = {
  fileValue: [{ required: true, message: t('common.prompt.required') }]
}

const supportTypeChange = (supportType: any) => {
  if(!isEmpty(supportType)){
    let data = find(securitySupports.value, { supportType: supportType })
    dataSecurityConfigFormData.value.name = data.supportName
    dataSecurityConfigFormData.value.describe = data.description
    support.value.supportName = data.supportName
    support.value.description = data.description
    supportModels.value = data.supportFieldModels
  }else{
    dataSecurityConfigFormData.value.name = ''
    dataSecurityConfigFormData.value.describe = ''
    support.value.supportName = ''
    support.value.description = ''
    supportModels.value = []
  }
}

const saveDataSecurityConfigData = () => {
  Promise.all([validForm(supportFormRef), validForm(dataSecurityConfigFormRef), validForm(supportModelsRef)]).then(async (res) => {
    const [valid1, valid2, valid3] = res
    if (valid1 && valid2 && valid3) {
      support.value.supportFieldModels = supportModelsRef.value.getTableData().tableData
      dataSecurityConfigFormData.value.support = support.value
      await SecurityService.save(dataSecurityConfigFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataSecurityConfigForm(true)
    }
  })
}

const closeDataSecurityConfigForm = (isUp: boolean) => {
  emitter.emit('closeDataSecurityConfigForm', isUp)
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
