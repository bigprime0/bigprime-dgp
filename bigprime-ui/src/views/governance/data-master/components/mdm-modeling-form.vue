<template>
  <div style="text-align: right;padding-right: 10px">
    <tiny-button v-if="tableValue.id > 0 && tableValue.status === 2" :reset-time="500" type="success"
                 @click="handleStatus(0,t('common.operations.status.unpublish.prompt'))">
      {{ $t('common.operations.status.unpublish') }}
    </tiny-button>
  </div>

  <tiny-form v-if="structValue.tableStruct.length > 0" class="form-class" label-width="100px"
             overflow-title
             :disabled="tableValue.status === 2">
    <tiny-row style="text-align: right;padding-right: 10px">
      <tiny-button v-if="tableValue.status === 0" :reset-time="500" type="primary" @click="handleSave()">
        {{ $t('common.operations.save') }}
      </tiny-button>
      <tiny-button v-if="tableValue.id > 0 && tableValue.status === 0" :reset-time="500" type="success"
                   @click="handleStatus(2,t('common.operations.status.publish.prompt'))">
        {{ $t('common.operations.status.publish') }}
      </tiny-button>
      <tiny-button v-if="tableValue.id > 0 && tableValue.status === 0" :reset-time="500" type="danger"
                   @click="handleDelete()"> {{ $t('common.operations.delete') }}
      </tiny-button>
    </tiny-row>

    <div v-for="tableStruct in structValue.tableStruct" :key="tableStruct.key">
      <tiny-row v-if="tableStruct.isShow">
        <tiny-col :span="8">
          <tiny-form-item :label="tableStruct.label">
            <MdmControl :item="tableStruct" :data="tableData" :update="update" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </div>


    <tiny-row>
      <tiny-col :span="12">
        <tiny-tabs v-model="activeName">
          <tiny-tab-item :title="$t('warehouse.house.layer.tabs.column')" lazy name="column">
            <tiny-grid
              ref="columnRef"
              :data="columnData"
              :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
              max-height="88%"
            >
              <template #toolbar>
                <div class="grid-toolbar">
                  <tiny-button @click="ColumnToolbarEvent('add')">{{ $t('common.operations.add') }}
                  </tiny-button>
                  <tiny-button @click="ColumnToolbarEvent('delete')">{{ $t('common.operations.delete') }}
                  </tiny-button>
                </div>
              </template>
              <tiny-grid-column type="selection" width="40"></tiny-grid-column>

              <tiny-grid-column v-for="item in structValue.columnsStruct" :key="item.key"
                                show-header-overflow="title"
                                :width="item.fieldControl === 'BOOLEAN' ? '60px':'auto'"
                                :field="item.key"
                                :title="item.label"
                                :editor="{}">
                <template #edit="data">
                  <MdmControl :item="item" :data="data.row" :update="update" />
                </template>

                <template v-slot="data">
                  <MdmControl :item="item" :data="data.row" :update="update" :size="'mini'" />
                </template>
              </tiny-grid-column>

            </tiny-grid>
          </tiny-tab-item>

          <tiny-tab-item :title="$t('warehouse.house.layer.tabs.index')" lazy name="index">
            <tiny-grid
              ref="indexRef"
              :data="indexData"
              :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
              max-height="88%"
            >
              <template #toolbar>
                <div class="grid-toolbar">
                  <tiny-button @click="IndexToolbarEvent('add')">{{ $t('common.operations.add') }}
                  </tiny-button>
                  <tiny-button @click="IndexToolbarEvent('delete')">{{ $t('common.operations.delete') }}
                  </tiny-button>
                </div>
              </template>

              <tiny-grid-column type="selection" width="40"></tiny-grid-column>

              <tiny-grid-column v-for="item in structValue.indexesStruct" :key="item.key"
                                show-header-overflow="title"
                                :width="item.fieldControl === 'BOOLEAN' ? '60px':'auto'"
                                :field="item.key"
                                :title="item.label"
                                :editor="{}">
                <template #edit="data">
                  <MdmControl :item="item" :data="data.row" :update="update" />
                </template>

                <template v-slot="data">
                  <MdmControl :item="item" :data="data.row" :update="update" :size="'mini'" />
                </template>
              </tiny-grid-column>
            </tiny-grid>
          </tiny-tab-item>
        </tiny-tabs>
      </tiny-col>
    </tiny-row>
  </tiny-form>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { DataSourceDDLService } from '@/services/warehouse/data-source'
import MdmControl from '@/views/governance/data-master/components/mdm-control.vue'
import { Modal } from '@opentiny/vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { type DataMasterConfigParam, DataMasterConfigService } from '@/services/governance/master-config'
import { remove } from 'lodash-es'

const { t } = useI18n()
const activeName = ref('column')
const columnRef = ref()
const indexRef = ref()
const structValue = defineModel('structValue', { default: {} as any })
const tableValue = defineModel('tableValue', { default: {} as any })
const columnData = ref<any>()
const indexData = ref<any>()
const tableData = ref<any>()
const update = ref(true)


const hideCol = (colGrid: any, dataList: any[]) => {
  let refresh = false
  for (let i = 0; i < dataList.length; i++) {
    let data = dataList[i]
    if (!data.isShow) {
      const col = colGrid?.getTableColumn()?.fullColumn.filter((a: any) => a.property === data.key)[0]
      if (col?.visible) {
        colGrid.hideColumn(col)
        refresh = true
      }
    }
  }
  if (refresh) {
    colGrid.refreshColumn()
  }
}

const ColumnToolbarEvent = (code: string) => {
  switch (code) {
    case 'add':
      columnRef.value.insert({
        lengthOrPrecision: 0,
        scale: 0,
        nullable: true,
        operate: 'I'
      })
      break
    case 'delete': {
      const data = columnRef.value.getSelectRecords()
      if (data.length > 0) {
        columnRef.value.removeSelecteds()
      }
      break
    }
  }
}

const IndexToolbarEvent = (code: string) => {
  switch (code) {
    case 'add':
      indexRef.value.insert({ operate: 'I' })
      break
    case 'delete': {
      const data = indexRef.value.getSelectRecords()
      if (data.length > 0) {
        indexRef.value.removeSelecteds()
      }
      break
    }
  }
}

const setOperateData = (allData: any[], operate: any, dataList: any[]) => {
  for (let i = 0; i < dataList.length; i++) {
    let data = dataList[i]
    data.operate = operate
    allData.push(data)
  }
}

const getData = (isDelete: boolean, status: any) => {
  if (update.value) {
    tableData.value.operate = 'U'
  } else {
    tableData.value.operate = 'I'
  }
  if (isDelete) {
    tableData.value.operate = 'D'
  }

  let columnAllData = [] as any[]
  let columnData = columnRef.value.getRecordset()
  setOperateData(columnAllData, 'I', columnData.insertRecords)
  setOperateData(columnAllData, 'D', columnData.removeRecords)
  setOperateData(columnAllData, 'U', columnData.updateRecords)


  let indexAllData = [] as any[]
  if (indexRef.value) {
    let indexData = indexRef.value.getRecordset()
    setOperateData(indexAllData, 'I', indexData.insertRecords)
    setOperateData(indexAllData, 'D', indexData.removeRecords)
    setOperateData(indexAllData, 'U', indexData.updateRecords)
  }

  if (tableValue.value.id === 0) {
    columnAllData.push({
      columnName: 'keep_uuid',
      columnType: 'VARCHAR',
      lengthOrPrecision: 100,
      scale: 0,
      nullable: true,
      defaultValue: '',
      primaryKey: false,
      autoIncrement: false,
      columnComment: '保留字段(勿动)',
      operate: 'I'
    })
    indexAllData.push({
      indexName: 'keep_index',
      indexColumns: 'keep_uuid',
      indexType: 'INDEX',
      indexComment: '保留索引(勿动)',
      operate: 'I'
    })
  }
  let data = {
    id: tableValue.value.id,
    status: status,
    publishDate: tableValue.value.publishDate,
    tableName: tableData.value.tableName,
    tableData: JSON.stringify(tableData.value),
    columnData: JSON.stringify(columnAllData),
    indexData: JSON.stringify(indexAllData)
  } as DataMasterConfigParam
  return data
}

const getDetails = async () => {
  const data = await DataSourceDDLService.getSourceTableDetails(tableValue.value.databaseId, tableValue.value.label)
  update.value = true
  tableData.value = data
  columnData.value = data.columns
  indexData.value = data.indexes
  if (columnData.value) {
    remove(columnData.value, { columnName: 'keep_uuid' })
  }
  if (indexData.value) {
    remove(indexData.value, { indexName: 'keep_index' })
  }
}

const setTableValue = (model: DataMasterConfigParam) => {
  tableValue.value.id = model.id
  tableValue.value.label = model.tableName
  tableValue.value.status = model.status
  getDetails()
  emitter.emit('masterConfigSave')
}

const handleSave = async () => {
  const data = getData(false, 0)
  const model = await DataMasterConfigService.save(data)
  Modal.message({
    message: t('common.prompt.save.success'),
    status: 'success'
  })
  setTableValue(model)
}

const handleStatus = (newStatus: number, message: string) => {
  Modal.confirm(message).then(async (res: string) => {
    if (res === 'confirm') {
      const model = await DataMasterConfigService.save(getData(false, newStatus))
      setTableValue(model)
    }
  })
}

const handleDelete = () => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await DataMasterConfigService.deleteByData(getData(true, 0))
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      tableValue.value.status = 0
      tableValue.value.id = 0
      tableValue.value.label = ''
      emitter.emit('masterConfigSave')
    }
  })
}

watchEffect(async () => {
  if (tableValue.value.label !== '') {
    await getDetails()
  } else {
    update.value = false
    tableData.value = {}
    columnData.value = []
    indexData.value = []
  }
})

watchEffect(async () => {
  if (structValue.value.columnsStruct) {
    hideCol(columnRef.value, structValue.value.columnsStruct)
  }
  if (structValue.value.indexesStruct) {
    hideCol(indexRef.value, structValue.value.indexesStruct)
  }
})

</script>

<style scoped lang="less">
.grid-toolbar {
  display: flex;
  justify-content: left;
  width: calc(35vh + 100px);
  margin: 12px 0;

  div {
    margin-right: 10px;
  }
}

.form-class {
  :deep(.tiny-form-item__label) {
    text-align: left;
    vertical-align: middle;
    float: left;
    font-size: 12px;
    color: var(--ti-form-item-label-text-color);
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
</style>
