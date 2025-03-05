<template>
  <div class="ds-form">
    <tiny-form ref="formRef" :model="formData" :rules="formRules" label-width="100px"
               overflow-title
               :disabled="formData.status === 2 || disabled">
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row v-if="!isEmpty(formData.standardTypeName)">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('governance.standard.type')">
            <sapn class="span-font">{{ formData.standardTypeName }}</sapn>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'code')}"
                          :label="$t('governance.standard.field.code')" :show-message="false" prop="code">
            <tiny-input v-model="formData.code"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'status')}"
                          :label="$t('common.operations.status')">
            <tiny-radio v-model="formData.status" :label=0 :disabled="true">
              {{ $t('common.operations.status.new') }}
            </tiny-radio>
            <tiny-radio v-model="formData.status" :label=1 :disabled="true" v-if="false">
              {{ $t('common.operations.status.underReview') }}
            </tiny-radio>
            <tiny-radio v-model="formData.status" :label=2 :disabled="true">
              {{ $t('common.operations.status.published') }}
            </tiny-radio>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'cnName')}"
                          :label="$t('governance.standard.field.cnName')" :show-message="false" prop="cnName">
            <tiny-input v-model="formData.cnName"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'enName')}"
                          :label="$t('governance.standard.field.enName')">
            <tiny-input v-model="formData.enName" :class="{'span-change':includes(colorChanges,'enName')}"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'description')}"
                          :label="$t('governance.standard.field.description')">
            <tiny-input type="textarea" v-model="formData.description" :maxlength="300" show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>


      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('governance.standard.field.config.divider') }}
      </tiny-divider>


      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'fieldType')}"
                          :label="$t('governance.standard.field.fieldType')">
            <tiny-select v-model="formData.fieldType" clearable>
              <tiny-option v-for="item in fields" :key="item.value" :label="$t(item.describe)" :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'isNone')}"
                          :label="$t('governance.standard.field.isNone')">
            <tiny-switch v-model="formData.isNone" :true-value=1 :false-value=0></tiny-switch>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'fieldLength')}"
                          :label="$t('governance.standard.field.fieldLength')">
            <tiny-numeric type="number" v-model="formData.fieldLength" mouse-wheel="true" min="0"
                          precision="0"></tiny-numeric>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'fieldPrecision')}"
                          :label="$t('governance.standard.field.fieldPrecision')">
            <tiny-numeric type="number" v-model="formData.fieldPrecision" mouse-wheel="true" min="0"
                          precision="0"></tiny-numeric>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('governance.standard.field.code.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'codeType')}"
                          :label="$t('governance.standard.field.codeType')">
            <tiny-select v-model="formData.codeType" clearable>
              <tiny-option v-for="item in codes" :key="item.value" :label="$t(item.describe)" :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6" v-if="formData.codeType === 'bool'">
          <tiny-form-item :label="$t('governance.standard.field.codeType.trueOrFalse')">
            <tiny-input v-model="formData.codeTypeModel.boolModel.trueOrFalse"></tiny-input>
          </tiny-form-item>
        </tiny-col>

      </tiny-row>

      <tiny-row v-if="formData.codeType === 'range'">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('governance.standard.field.codeType.minValue')">
            <tiny-numeric type="number" v-model="formData.codeTypeModel.rangeModel.minValue" mouse-wheel="true" min="0"
                          precision="0"></tiny-numeric>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('governance.standard.field.codeType.maxValue')">
            <tiny-numeric type="number" v-model="formData.codeTypeModel.rangeModel.maxValue" mouse-wheel="true" min="0"
                          precision="0"></tiny-numeric>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row v-if="formData.codeType == 'list'">
        <tiny-col :span="12">
          <tiny-form-item label="">
            <tiny-grid
              ref="basicGridRef"
              :data="formData.codeTypeModel.listModel"
              @toolbar-button-click="toolbarButtonClickEvent"
              :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
            >
              <template #toolbar>
                <tiny-grid-toolbar :buttons="toolbarButtons"></tiny-grid-toolbar>
              </template>
              <tiny-grid-column type="index" width="60"></tiny-grid-column>
              <tiny-grid-column type="selection" width="50"></tiny-grid-column>
              <tiny-grid-column field="label" :title="$t('governance.standard.field.codeType.label')"
                                :editor="{ component: 'input' }"></tiny-grid-column>
              <tiny-grid-column field="value" :title="$t('governance.standard.field.codeType.value')"
                                :editor="{ component: 'input' }"></tiny-grid-column>
            </tiny-grid>
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
import { computed, ref } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { type Standard, type StandardSelect, StandardService } from '@/services/governance/standard'
import { includes, isEmpty } from 'lodash-es'


const { t } = useI18n()

const formRef = ref()
const formData = defineModel<Standard>('formData', { default: {} })
const fields = defineModel<StandardSelect[]>('fields', { default: [] })
const codes = defineModel<StandardSelect[]>('codes', { default: [] })
const disabled = defineModel('disabled', { default: false })

const formRules = computed(() => {
  let ruleList = {
    code: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    cnName: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const handleSave = () => {
  formRef.value
    .validate()
    .then(async () => {
      convertCodeType()
      await StandardService.save(formData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      handleCancel(true)
    })
}

const convertCodeType = () => {
  switch (formData.value.codeType) {
    case 'range':
      formData.value.codeJson = JSON.stringify(formData.value.codeTypeModel.rangeModel)
      break
    case 'list':
      formData.value.codeJson = JSON.stringify(basicGridRef.value.getTableData().tableData)
      break
    case 'bool':
      formData.value.codeJson = JSON.stringify(formData.value.codeTypeModel.boolModel)
      break
  }
}

const handleCancel = (isUp: boolean) => {
  emitter.emit('drawerListCancel', isUp)
}


const basicGridRef = ref()
const toolbarButtons = ref([
  {
    code: 'insert',
    name: t('common.operations.add')
  },
  {
    code: 'delete',
    name: t('common.operations.delete')
  }
])
const toolbarButtonClickEvent = ({ code, $grid }: any) => {
  switch (code) {
    case 'insert':
      basicGridRef.value.insert({})
      break
    case 'delete': {
      const data = $grid.getSelectRecords()
      if (data.length > 0) {
        $grid.removeSelecteds()
      }
      break
    }
  }
}

const colorChanges = defineModel('colorChanges', { default: [] })
</script>

<style scoped lang="less">
.span-change {
  :deep(.tiny-form-item__label) {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: var(--ti-form-item-label-font-size);
    color: #e08331;
    height: var(--ti-form-item-label-line-height);
    line-height: var(--ti-form-item-label-line-height);
    padding-right: 8px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.span-font {
  font-size: 12px;
  color: #000000;
}

.span-des {
  font-size: 13px;
  color: #2f5bea;
}

.container-split {
  height: calc(100vh - 110px);
  border: 1px solid #d9d9d9;
}

.ds-choose {
  :deep(.tiny-collapse) {
    padding: 0 10px;
    border-top: 0;
    border-bottom: 0;
  }
}

.ds-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: normal;

  :deep(.tiny-card) {
    width: 100px;
  }

  :deep(.tiny-card.tiny-card--default) {
    margin: 3px;
    cursor: pointer;
  }

  :deep(.tiny-card.tiny-card--success) {
    border: 2px solid #3ac295;
  }

  :deep(img) {
    height: 50px;
  }

  :deep(.tiny-card .tiny-card__body .tiny-card--logo.tiny-card--mini-padding) {
    padding: 0px;
  }
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
