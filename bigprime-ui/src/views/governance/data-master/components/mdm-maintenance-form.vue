<template>
  <div>
    <tiny-grid
      ref="columnRef"
      :data="dataList"
      :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
      min-height="60%"
      max-height="85%"
    >
      <template #toolbar>
        <div v-if="tableValue.id > 0" class="grid-toolbar">
          <tiny-search style="width: 500px" :search-types="searchTypes"
                       :type-value="selectColumnName"
                       v-model="columnValue"
                       @select="getData"
                       @search="getData"
                       @change="getData"
                       @clear="getData"
                       is-enter-search clearable>
          </tiny-search>
          <tiny-button @click="ColumnToolbarEvent('add')">{{ $t('common.operations.add') }}
          </tiny-button>
          <tiny-button @click="ColumnToolbarEvent('delete')">{{ $t('common.operations.delete') }}
          </tiny-button>
          <tiny-button :reset-time="500" @click="handleSave()">
            {{ $t('common.operations.save') }}
          </tiny-button>
        </div>
      </template>

      <tiny-grid-column v-if="tableValue.id <= 0"></tiny-grid-column>
      <tiny-grid-column v-if="tableValue.id > 0" type="selection" width="40"></tiny-grid-column>

      <tiny-grid-column v-if="tableValue.id > 0" v-for="item in columnData" :key="item.columnName" show-header-overflow="title"
                        :field="item.columnName"
                        :title="isEmpty(item.columnComment) ? item.columnName : item.columnComment"
                        :editor="{}">
        <template #edit="data">
          <tiny-date-picker v-if="item.columnType === 'DATE'"
                            :disabled="item.autoIncrement"
                            size="mini"
                            v-model="data.row[item.columnName]"
                            :title="data.row[item.columnName]"></tiny-date-picker>

          <tiny-date-picker v-else-if="item.columnType === 'DATETIME'"
                            :disabled="item.autoIncrement"
                            size="mini"
                            type="datetime"
                            v-model="data.row[item.columnName]"
                            :title="data.row[item.columnName]"></tiny-date-picker>

          <tiny-numeric v-else-if="item.columnType === 'BIGINT' || item.columnType === 'INT'"
                        :disabled="item.autoIncrement"
                        size="mini"
                        type="number"
                        mouse-wheel="true"
                        v-model="data.row[item.columnName]"
                        :title="data.row[item.columnName]"></tiny-numeric>

          <tiny-numeric v-else-if="item.columnType === 'DECIMAL'"
                        :disabled="item.autoIncrement"
                        size="mini"
                        :precision="data.row[item.scale]"
                        v-model="data.row[item.columnName]"
                        :title="data.row[item.columnName]"></tiny-numeric>

          <tiny-switch v-else-if="item.columnType === 'TINYINT'"
                       :disabled="item.autoIncrement"
                       size="mini"
                       true-value='1' false-value='0'
                       v-model="data.row[item.columnName]"
                       :title="data.row[item.columnName]"></tiny-switch>

          <tiny-input v-else
                      :disabled="item.autoIncrement"
                      size="mini"
                      v-model="data.row[item.columnName]"
                      :title="data.row[item.columnName]"></tiny-input>
        </template>

        <template #default="data">
          <span v-if="item.columnType === 'DATE'">{{ formatDate(data.row[item.columnName]) }}</span>
          <spanr
            v-else-if="item.columnType === 'DATETIME'">{{ formatDateTime(data.row[item.columnName]) }}</spanr>
          <tiny-switch v-else-if="item.columnType === 'TINYINT'"
                       :disabled="item.autoIncrement"
                       size="mini"
                       true-value='1' false-value='0'
                       v-model="data.row[item.columnName]"
                       :title="data.row[item.columnName]"></tiny-switch>
          <span v-else>{{ data.row[item.columnName] }}</span>
        </template>
      </tiny-grid-column>

    </tiny-grid>
    <tiny-pager v-if="tableValue.id > 0"
      :current-page="pages.page"
      :page-size="pages.limit"
      :total="pages.total"
      :page-sizes="pages.pageSizes"
      @current-change="pageChange"
      @size-change="pageLimitChange"
      :align="pages.align"
      :layout="pages.layout"
    ></tiny-pager>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { DataSourceDDLService, DataSourceDMLService } from '@/services/warehouse/data-source'
import { Modal } from '@opentiny/vue'
import { useI18n } from 'vue-i18n'
import { isEmpty, orderBy } from 'lodash-es'
import { formatDate, formatDateTime } from '@/utils/date'
import { DataMasterConfigService } from '@/services/governance/master-config'

const { t } = useI18n()
const columnRef = ref()
const tableValue = defineModel('tableValue', { default: {} as any })
const columnData = ref<any[]>([])
const columnNames = ref<any[]>()
const selectColumnName = ref()
const columnValue = ref()
const columns = ref()
const dataList = ref()
const pages = ref({
  total: 0,
  page: 1,
  limit: 5,
  pageSizes: [5, 10, 20],
  align: 'right',
  layout: 'total, prev, pager, next, jumper, sizes'
})
const searchTypes = ref([
  {
    text: '',
    value: ''
  }
])


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

const handleSave = async () => {
  let columnData = columnRef.value.getRecordset()

  let data = {
    tableName: tableValue.value.label,
    columns: columns.value,
    insertData: JSON.stringify(columnData.insertRecords),
    updateData: JSON.stringify(columnData.updateRecords),
    deleteData: JSON.stringify(columnData.removeRecords)
  }

  await DataMasterConfigService.saveMaintainData(data)
  Modal.message({
    message: t('common.prompt.save.success'),
    status: 'success'
  })
  getData()
}

const getData = () => {
  if(isEmpty(tableValue.value.label)){
    dataList.value = []
    pages.value.total = 0
    return
  }
  let parameters = [] as any[]
  if (!isEmpty(selectColumnName.value) && !isEmpty(columnValue.value)) {
    parameters = [{
      columnName: selectColumnName.value,
      columnValue: isEmpty(columnValue.value) ? '' : columnValue.value
    }]
  }

  DataSourceDMLService.getTableDataByPage({
    id: tableValue.value.databaseId,
    page: pages.value.page,
    limit: pages.value.limit,
    params: parameters,
    tableName: tableValue.value.label,
    columnNames: columnNames.value
  }).then(result => {
    if (result.total === 0) {
      dataList.value = []
      pages.value.total = 0
    } else {
      dataList.value = result.list
      pages.value.total = result.total
    }
  })
}

const pageChange = (page: number) => {
  pages.value.page = page
  getData()
}
const pageLimitChange = (limit: number) => {
  pages.value.limit = limit
  getData()
}

const hideCol = () => {
  let refresh = false
  const col = columnRef.value?.getTableColumn()?.fullColumn.filter((a: any) => a.property === 'keep_uuid')[0]
  if (col?.visible) {
    columnRef.value.hideColumn(col)
    refresh = true
  }
  if (refresh) {
    columnRef.value.refreshColumn()
  }
}

watchEffect(async () => {
  hideCol()
  if (tableValue.value.label !== '') {
    const data = await DataSourceDDLService.getSourceTableDetails(tableValue.value.databaseId, tableValue.value.label)
    columnData.value = orderBy(data.columns, ['columnName'], ['asc'])

    let defaultValue = ''
    let searchTypeList = [] as any
    let columnNameList = [] as any
    let columnList = [] as any
    for (let i = 0; i < columnData.value.length; i++) {
      let column = columnData.value[i]
      columnNameList.push(column.columnName)

      if (column.columnName !== 'keep_uuid') {
        if (isEmpty(defaultValue)) {
          defaultValue = column.columnName
        }
        searchTypeList.push({
          text: isEmpty(column.columnComment) ? column.columnName : column.columnComment,
          value: column.columnName
        })
        if (!column.autoIncrement) {
          columnList.push({
            column: column.columnName,
            columnType: column.columnType
          })
        }
      }
    }
    columnNames.value = columnNameList
    searchTypes.value = searchTypeList
    selectColumnName.value = defaultValue
    columns.value = columnList

    getData()
  } else {
    columnData.value = []
    columnNames.value = []
    searchTypes.value = [{
      text: '',
      value: ''
    }]
    selectColumnName.value = ''
    columns.value = []
    dataList.value = []
    pages.value.total = 0
  }
})

</script>

<style scoped lang="less">
.grid-toolbar {
  display: flex;
  justify-content: left;
  width: calc(60vh + 100px);
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
