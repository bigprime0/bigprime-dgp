<template>
  <div class="container-list">
    <tiny-tabs tab-style="card" v-model="activeItem">
      <tiny-tab-item :key="item.name" v-for="item in tabs" :title="item.title" :name="item.name">
        <template #default>
          <div v-if="item.name == 'baseinfo'">
            <tiny-form
              ref="dynamicFormRef"
              :model="metadataFormData"
              :rules="metadataFormRef"
              validate-type="text"
              label-width="140px"
            >
              <template v-for="(item, index) in dataElements" :key="item.id">
                <div v-if="item.eleDataType != 'List'">
                  <tiny-col :span="6" v-if="index % 2 == 0">
                    <tiny-form-item :label="item.eleName">
                      <tiny-input v-model="metadataFormData['_' + item.id]"></tiny-input>
                    </tiny-form-item>
                  </tiny-col>
                  <tiny-col :span="6" v-if="index % 2 == 1">
                    <tiny-form-item :label="item.eleName">
                      <tiny-input v-model="metadataFormData['_' + item.id]"></tiny-input>
                    </tiny-form-item>
                  </tiny-col>
                </div>
              </template>

              <tiny-row>
                <tiny-col span="12">
                  <tiny-form-item>
                    <tiny-button @click="handleSave" type="primary" :reset-time="3000">
                      {{ $t('common.operations.save') }}
                    </tiny-button>
                    <tiny-button @click="handleCancel" :reset-time="3000">
                      {{ $t('common.operations.cancel') }}
                    </tiny-button>
                  </tiny-form-item>
                </tiny-col>
              </tiny-row>
            </tiny-form>
          </div>
          <div v-else>
            <div v-for="elem in dataElements" :key="elem.id">
              <tiny-grid
                v-if="elem.eleCode == item.name"
                :data="elem.eleRealValue"
                :auto-resize="true"
              >
                <tiny-grid-column
                  v-for="col in elem.eleCols"
                  :key="col.field"
                  :field="col.field"
                  :title="col.title"
                ></tiny-grid-column>
              </tiny-grid>
            </div>
          </div>
        </template>
      </tiny-tab-item>
    </tiny-tabs>
  </div>
</template>
<script setup lang="ts">
import { type dataElementModel, MetadataService } from '@/services/metadata/metadata'
import { ref } from 'vue'
import emitter from '@/utils/evnetbus'
import { forIn } from 'lodash-es'
import { Modal } from '@opentiny/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const metadataFormRef = ref()
const metadataFormData = ref({})
const activeItem = ref('baseinfo')
const tabs = ref()
const dataElements = ref<dataElementModel[]>()
const metadataId = ref('')

const queryDataElements = async (node: any) => {
  let id = node.treeLevel == 'Source' ? node.id : node.data ? node.data.id : node.id
  dataElements.value = await MetadataService.getDataElements(id)
  metadataFormData.value = {}
  tabs.value = []
  activeItem.value = 'baseinfo'
  tabs.value.push({ name: 'baseinfo', title: '基本信息' })
  dataElements.value.forEach((item: any) => {
    if (item.eleDataType == 'List') {
      if (item.eleValue != '' && item.eleValue != 'undefined') {
        item.eleRealValue = JSON.parse(item.eleValue)
        item.eleCols = []
        tabs.value.push({ title: item.eleName, name: item.eleCode })
        forIn(item.eleRealValue[0], function (value, key) {
          item.eleCols.push({ field: key, title: key })
        })
      }
    }
  })
  if (dataElements.value && dataElements.value.length > 0) {
    metadataId.value = dataElements.value[0].metadataId
    dataElements.value.forEach((item) => {
      metadataFormData.value['_' + item.id] = item.eleValue
    })
  }
}

const handleSave = () => {
  MetadataService.updateDataElements({
    metadataId: metadataId.value,
    data: metadataFormData.value
  }).then((resp) => {
    if (resp > 0) {
      Modal.message({ message: t('common.operations.execute.success'), status: 'success' })
    }
  })
}
const handleCancel = () => {
  emitter.emit('drawerCancel')
}
emitter.on('queryDataElements', queryDataElements)
</script>

<style scoped lang="less">
.form-button {
  text-emphasis:;
}
</style>
