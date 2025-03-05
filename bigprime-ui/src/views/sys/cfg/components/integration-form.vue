<template>
  <div class="container-form">
    <tiny-form ref="drawFormRef"
               :model="drawFormData"
               :rules="drawFormRules"
               validate-type="text"
               overflow-title
               label-width="100px">

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('common.id')" :show-message="false" prop="id">
            <tiny-input v-model="drawFormData.id" disabled="disabled"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.product')" :show-message="false" prop="product">
            <tiny-select v-model="drawFormData.product" @change="productChange">
              <tiny-option v-for="item in productTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.category')" :show-message="false" prop="category">
            <tiny-select v-model="drawFormData.category" :show-alloption="false">
              <tiny-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.subCategory')" :show-message="false" prop="subCategory">
            <tiny-input v-model="drawFormData.subCategory"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('sys.cfg.integration.qdb')" :show-message="false" prop="dbType">
            <tiny-select v-model="drawFormData.dbType" :show-alloption="false" clearable>
              <tiny-option v-for="item in DatabaseOptions" :key="item.value" :label="item.label" :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.applicableVersion')" :show-message="false" prop="applicableVersion">
            <tiny-input v-model="drawFormData.applicableVersion"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="4">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.title')" :show-message="false" prop="title">
            <tiny-input v-model="drawFormData.title"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.label')" :show-message="false" prop="label">
            <tiny-input v-model="drawFormData.label"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.key')" :show-message="false" prop="realLabel">
            <tiny-input v-model="drawFormData.realLabel"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.descr')" :show-message="false" prop="descr">
            <tiny-input type="textarea" v-model="drawFormData.descr" :maxlength="300" show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.ValueType')" :show-message="false" prop="ValueType">
            <tiny-select v-model="drawFormData.valueType" @change="ValueTypeChange">
              <tiny-option v-for="item in valueTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.defaultValue')" :show-message="false" prop="defaultValue">
            <tiny-input v-model="drawFormData.defaultValue"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="3">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.compType')" :show-message="false" prop="compType">
            <tiny-select v-model="drawFormData.compType">
              <tiny-option v-for="item in compTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="3">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.sort')" :show-message="false" prop="sort">
            <tiny-input v-model="drawFormData.seq"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="3">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.isRequired')" :show-message="false" prop="isRequired">
            <tiny-switch v-model="drawFormData.isRequired" :true-value=1 :false-value=0></tiny-switch>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="3">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.isAdvanced')" :show-message="false" prop="isAdvanced">
            <tiny-switch v-model="drawFormData.isAdvanced" :true-value=1 :false-value=0></tiny-switch>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('sys.cfg.integration.gridCol.compConfig')" :show-message="false" prop="compConfig">
            <tiny-input type="textarea" v-model="drawFormData.compConfig" :maxlength="400" :rows="4" show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-divider content-position="left" content-color="#7693f5"></tiny-divider>
      <tiny-form-item style="text-align: center">
        <tiny-button plain type="primary" @click="handleCancel"> {{ $t('common.operations.cancel') }}</tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="handleSave"> {{ $t('common.operations.save') }}</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>

<script setup lang="ts">

import { CompTypeEnum, type IntegrationConfigType } from '@/views/sys/cfg/types/integrationType'
import { computed, ref } from 'vue'
import { Modal } from '@opentiny/vue'
import { SysCfgService } from '@/services/sys/sys-config'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'

const { t } = useI18n()
const drawFormData = defineModel<IntegrationConfigType>('drawFormData', { default: {} })
const drawFormRef = ref()

//表单验证
const drawFormRules = computed(() => {
  return {
    product: [{ required: true, message: '必填', trigger: 'blur' }],
    // dbType: [{ required: true, message: '必填', trigger: 'blur' }],
    category: [{ required: true, message: '必填', trigger: 'blur' }],
    label: [{ required: true, message: '必填', trigger: 'blur' }]
  }
})

const props = defineProps({
  DatabaseOptions: {
    type: [Array, Object]
  }
})

const categoryOptions = ref([
  { label: 'global', value: 'global', group: 'seatunnel' },
  { label: 'env', value: 'env', group: 'seatunnel' },
  { label: 'source', value: 'source', group: 'seatunnel' },
  { label: 'transform', value: 'transform', group: 'seatunnel' },
  { label: 'sink', value: 'sink', group: 'seatunnel' }
])
const categoryList = ref([
  { label: 'global', value: 'global', group: 'seatunnel' },
  { label: 'env', value: 'env', group: 'seatunnel' },
  { label: 'source', value: 'source', group: 'seatunnel' },
  { label: 'transform', value: 'transform', group: 'seatunnel' },
  { label: 'sink', value: 'sink', group: 'seatunnel' },
  { label: 'global', value: 'global', group: 'datax' },
  { label: 'reader', value: 'reader', group: 'datax' },
  { label: 'writer', value: 'writer', group: 'datax' }
])

const productChange = () => {
  switch (drawFormData.value.product) {
    case 'seatunnel':
      categoryOptions.value = categoryList.value.filter(item => item.group === 'seatunnel')
      drawFormData.value.category = ''
      break
    case 'datax':
      categoryOptions.value = categoryList.value.filter(item => item.group === 'datax')
      drawFormData.value.category = ''
      break
  }
}

const valueTypeOptions = ref([
  { label: '数组', value: 'array' },
  { label: '文本', value: 'text' },
  { label: '数值', value: 'number' },
  { label: '日期', value: 'date' },
  { label: '布尔', value: 'boolean' },
  { label: '集合', value: 'list' }
])

const productTypeOptions = ref([
  { label: 'seatunnel', value: 'seatunnel' },
  { label: 'datax', value: 'datax' }
])

const compTypeOptions = ref([
  { label: '文本框', value: 'textInput' },
  { label: '文本域', value: 'textarea' },
  { label: '数值框', value: 'numberInput' },
  { label: '日期框', value: 'dateInput' },
  { label: '开关', value: 'switch' },
  { label: '下拉选择', value: 'select' },
  { label: '下拉多选', value: 'mselect' },
  { label: '表格', value: 'grid' }
])

const ValueTypeChange = () => {
  switch (drawFormData.value.valueType) {
    case 'text':
      compTypeOptions.value = [{ label: '文本框', value: 'textInput' }]
      drawFormData.value.compType = CompTypeEnum.textInput
      break
    case 'array' :
      compTypeOptions.value = [{ label: '文本框', value: 'textInput' }]
      drawFormData.value.compType = CompTypeEnum.textInput
      break
    case 'textarea' :
      compTypeOptions.value = [{ label: '文本域', value: 'textarea' }]
      drawFormData.value.compType = CompTypeEnum.textarea
      break
    case 'number' :
      compTypeOptions.value = [{ label: '数值框', value: 'numberInput' }]
      drawFormData.value.compType = CompTypeEnum.numberInput
      break
    case 'date' :
      compTypeOptions.value = [{ label: '日期框', value: 'dateInput' }]
      drawFormData.value.compType = CompTypeEnum.dateInput
      break
    case 'boolean' :
      compTypeOptions.value = [{ label: '开关', value: 'switch' }]
      drawFormData.value.compType = CompTypeEnum.switch
      break
    case 'list' :
      compTypeOptions.value = [
        { label: '下拉选择', value: 'select' },
        { label: '下拉多选', value: 'mselect' },
        { label: '表格', value: 'grid' }
      ]
      drawFormData.value.compType = CompTypeEnum.select
      break
  }
}

const handleCancel = () => {
  emitter.emit('drawerCancel')
}

const handleSave = () => {
  drawFormRef.value
    .validate()
    .then(async () => {
      const result = drawFormData.value.id > 0 ? await SysCfgService.updateIntegration(drawFormData.value) : await SysCfgService.saveIntegration(drawFormData.value)
      if (result) {
        Modal.message({
          message: drawFormData.value.id > 0 ? t('common.prompt.update.success') : t('common.prompt.save.success'),
          status: 'success'
        })
        emitter.emit('handleQuery')
        handleCancel()
      } else {
        Modal.message({
          message: drawFormData.value.id > 0 ? t('common.prompt.update.fail') : t('common.prompt.save.fail'),
          status: 'error'
        })
      }
    })
}

</script>

<style scoped lang="less">
.container-form {
  border: 1px solid #d9d9d9;
  padding: 10px;
}
</style>
