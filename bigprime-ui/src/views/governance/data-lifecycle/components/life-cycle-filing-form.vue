<template>
  <div class="ds-form">
    <tiny-form ref="dataLifeCycleFormRef" :model="dataLifeCycleFormData" :rules="dataLifeCycleFormRules"
               label-width="100px" overflow-title :disabled="dataLifeCycleFormData.status > 0">
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('lifecycle.filing.field.tableName')" :show-message="false" prop="tableName" >
            <tiny-select v-model="dataLifeCycleFormData.tableSelect" filterable @change="tableChange">
              <tiny-option-group v-for="group in tableTree" :key="group.id" :label="group.label">
                <tiny-option
                  v-for="item in group.value"
                  :key="item.id"
                  :label="item.tableName"
                  :value="item.id"
                ></tiny-option>
              </tiny-option-group>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="dataLifeCycleFormData.type === 1 ? $t('lifecycle.filing.field.nearline.name') :
                                  dataLifeCycleFormData.type === 2 ? $t('lifecycle.filing.field.offline.name') : $t('lifecycle.filing.field.destruction.name')"
                          :show-message="false" prop="name" >
            <tiny-input v-model="dataLifeCycleFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('lifecycle.filing.field.sourceId')">
            <tiny-select v-model="dataLifeCycleFormData.sourceId" disabled>
              <tiny-option v-for="item in sourceTree" :key="item.key" :label="item.label"
                           :value="item.key">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('lifecycle.filing.field.warehouseLocation')">
            <tiny-input v-model="dataLifeCycleFormData.warehouseLocation" disabled></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <!--        <tiny-col :span="6">
                  <tiny-form-item :label="$t('lifecycle.filing.field.storagePath')">
                    <tiny-input v-model="dataLifeCycleFormData.storagePath" disabled></tiny-input>
                  </tiny-form-item>
                </tiny-col>-->
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('lifecycle.filing.field.size')">
            <tiny-input v-model="dataLifeCycleFormData.size" disabled></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('lifecycle.filing.field.rows')">
            <tiny-input v-model="dataLifeCycleFormData.rows" disabled></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="dataLifeCycleFormData.type === 1 ? $t('lifecycle.filing.field.nearline.condition') :
                                  dataLifeCycleFormData.type === 2 ? $t('lifecycle.filing.field.offline.condition') : $t('lifecycle.filing.field.destruction.condition')">
            <tiny-input type="textarea" v-model="dataLifeCycleFormData.condition" :rows=3 show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>


      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeDataLifeCycleForm(false)"> {{ $t('common.operations.cancel') }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveDataLifeCycleData"> {{ $t('common.operations.save') }}
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
import { DataLifeCycleService } from '@/services/lifecycle/life-cycle-filing'
import { find, isEmpty } from 'lodash-es'


const { t } = useI18n()
const dataLifeCycleFormRef = ref()
const dataLifeCycleFormData = defineModel('dataLifeCycleFormData', { default: {} as any })
const sourceTree = defineModel('sourceTree', { default: [] as any })
const tableTree = defineModel('tableTree', { default: [] as any })
const tableValues = defineModel('tableValues', { default: [] as any })
const dataLifeCycleFormRules = computed(() => {
  if (dataLifeCycleFormData.value.status === 0) {
    return {
      name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
      tableName: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
    }
  }
  return {}
})

const saveDataLifeCycleData = () => {
  dataLifeCycleFormRef.value
    .validate()
    .then(async () => {
      await DataLifeCycleService.save(dataLifeCycleFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataLifeCycleForm(true)
    })
}

const closeDataLifeCycleForm = (isUp: boolean) => {
  emitter.emit('closeDataLifeCycleForm', isUp)
}

const tableChange = (id: any) => {
  let data = find(tableValues.value, { id: id })
  if (data) {
    if (isEmpty(dataLifeCycleFormData.value.name)) {
      dataLifeCycleFormData.value.name = data.tableName
    }
    dataLifeCycleFormData.value.tableName = data.tableName
    dataLifeCycleFormData.value.sourceId = data.sourceId
    dataLifeCycleFormData.value.rows = data.rows
    dataLifeCycleFormData.value.warehouseLocation = data.warehouseLocation
    dataLifeCycleFormData.value.size = data.size
  }
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
