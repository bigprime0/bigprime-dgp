<template>
  <tiny-grid
    ref="basicGridRef"
    :data="data.tableParameters"
    show-header-overflow="tooltip" show-overflow="tooltip"
    :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
  >
    <template #toolbar>
      <div class="grid-toolbar">
        <DsmSourceSelect ref="dataSourceSelectRef" :dataBaseId="data.dataBaseId" @change="dataSourceChange"
                         :disabled="disabled === true || isCrypto" />
        <tiny-button v-if="disabled === false && !isCrypto" @click="toolbarButtonClickEvent('add')">
          {{ $t('common.operations.add') }}
        </tiny-button>
        <tiny-button v-if="disabled === false  && !isCrypto" @click="toolbarButtonClickEvent('delete')">
          {{ $t('common.operations.delete') }}
        </tiny-button>
        <tiny-button v-if="showData === true" @click="toolbarButtonClickEvent('look')">{{ $t('common.operations.look')
          }}
        </tiny-button>
      </div>
    </template>
    <tiny-grid-column v-if="disabled === false && !isCrypto" type="selection" width="40"></tiny-grid-column>

    <tiny-grid-column field="tableName" :title="$t('datasource.table.name')" :editor="{}">
      <template #edit="data">
        <tiny-select
          :disabled="disabled === true || isCrypto"
          v-model="data.row.tableName"
          filterable
          remote
          @change="tableChange(data.row)"
          :remote-config="{ autoSearch: true, clearData: true, showIcon: true }"
          reserve-keyword
        >
          <tiny-option v-for="item in tables" :key="item.name"
                       :label="!isEmpty(item.comment) ? item.name+'('+item.comment+')' : item.name"
                       :value="item.name"></tiny-option>
        </tiny-select>
      </template>
    </tiny-grid-column>

    <tiny-grid-column field="columns" :title="$t('datasource.column.name')" :editor="{}">
      <template #edit="data">
        <tiny-select
          :disabled="disabled === true || isCrypto"
          v-model="data.row.columns"
          multiple
          filterable
          remote
          :remote-config="{ autoSearch: true, clearData: true, showIcon: true }"
          reserve-keyword
          :remote-method="getColumns(data.row)"
        >
          <tiny-option v-for="item in columns" :key="item.column"
                       :label="!isEmpty(item.comment) ? item.column+'('+item.comment+')' : item.column"
                       :value="item.column"></tiny-option>
        </tiny-select>
      </template>
    </tiny-grid-column>

    <tiny-grid-column v-if="isCrypto" field="cryptoColumns" :title="$t('datasource.column.crypto.name')" :editor="{}">
      <template #edit="data">
        <tiny-select
          :disabled="disabled === true"
          v-model="data.row.cryptoColumns"
          multiple
          filterable
          remote
          :remote-config="{ autoSearch: true, clearData: true, showIcon: true }"
          reserve-keyword
          :remote-method="getColumns(data.row)"
        >
          <tiny-option v-for="item in columns" :key="item.column"
                       :label="!isEmpty(item.comment) ? item.column+'('+item.comment+')' : item.column"
                       :value="item.column"></tiny-option>
        </tiny-select>
      </template>
    </tiny-grid-column>

  </tiny-grid>
  <div>
    <tiny-drawer :title="$t('common.operations.look')"
                 :visible="sourceDrawer"
                 @update:visible="sourceDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="80%"
                 height="100%"
                 @close="sourceDrawer = false">
      <div>
        <suspense>
          <DsmQuery :data-base-id="dataBaseId" :tree-parameters="treeParameters"
                    :crypto-id="cryptoId" :show-breadcrumb=false></DsmQuery>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import DsmSourceSelect from '@/views/data-source/components/dsm-source-select.vue'
import { find, isEmpty } from 'lodash-es'
import type { DbActuatorParam } from '@/views/components/actuator/actuator-types'
import { SourceService } from '@/services/spi/source'
import DsmQuery from '@/views/data-source/components/dsm-query.vue'


const props = defineProps({
  dbActuatorParamJson: {
    type: String,
    required: true
  },
  showData: {
    type: Boolean,
    required: false
  },
  disabled: {
    type: Boolean,
    required: false
  },
  isCrypto: {
    type: Boolean,
    required: false
  }
})

const data = ref<DbActuatorParam>({} as DbActuatorParam)
const dbParameterData = ref<DbActuatorParam>({} as DbActuatorParam)


const tables = ref()
const columns = ref()
const tableColumns = ref<any[]>([])
const basicGridRef = ref()
const dataSourceSelectRef = ref()

const treeParameters = ref<any[]>([])

const sourceDrawer = ref(false)
const dataBaseId = ref()
const cryptoId = ref()

const dataJson = computed(() => {
  if (data.value.dataBaseId > 0) {
    return JSON.stringify({
      dataBaseId: data.value.dataBaseId,
      cryptoId: cryptoId.value,
      tableParameters: basicGridRef.value.getTableData().tableData
    })
  }
  return ''
})

const tableChange = (row: any) => {
  row.columns = []
  row.cryptoColumns = []
}

const getColumns = async (row: any) => {
  let id = data.value.dataBaseId + '-' + row.tableName
  const info = find(tableColumns.value, { id: id })

  if (isEmpty(info)) {
    const tableDetails = await SourceService.getTable(data.value.dataBaseId, row.tableName)
    columns.value = tableDetails?.columns
    tableColumns.value.push({
      id: id,
      value: tableDetails?.columns
    })
  } else {
    columns.value = info.value
  }
}

const toolbarButtonClickEvent = (code: string) => {
  switch (code) {
    case 'look':
      if (dataSourceSelectRef.value.dataBaseId > 0) {
        dataBaseId.value = dataSourceSelectRef.value.dataBaseId

        let tableData: any[] = []
        basicGridRef.value.getTableData().tableData.forEach((o: any) => {
          tableData.push({
            type: 'TABLE',
            name: o.tableName,
            databaseId: dataBaseId.value,
            limitColumns: o.columns,
            cryptoColumns: o.cryptoColumns
          })
        })
        if (!isEmpty(tableData)) {
          treeParameters.value = [{
            type: 'DATABASE',
            name: dataSourceSelectRef.value.dbSource.name,
            children: tableData
          }]
        } else {
          treeParameters.value = []
        }

        sourceDrawer.value = true
      }
      break
    case 'add':
      basicGridRef.value.insert({})
      break
    case 'delete': {
      const data = basicGridRef.value.getSelectRecords()
      if (data.length > 0) {
        basicGridRef.value.removeSelecteds()
      }
      break
    }
  }
}


const dataSourceChange = () => {
  data.value.dataBaseId = dataSourceSelectRef.value.dataBaseId
  if (dbParameterData.value.dataBaseId === data.value.dataBaseId) {
    data.value.tableParameters = dbParameterData.value.tableParameters
  } else {
    data.value.tableParameters = []
  }
}


watchEffect(() => {
  if (!isEmpty(props.dbActuatorParamJson)) {
    data.value = JSON.parse(props.dbActuatorParamJson)
    cryptoId.value = data.value.cryptoId
    dbParameterData.value = JSON.parse(props.dbActuatorParamJson)
  } else {
    data.value = {} as DbActuatorParam
    cryptoId.value = 0
    data.value.tableParameters = []
    dbParameterData.value = {} as DbActuatorParam
  }
})

watchEffect(async () => {
  if (data.value.dataBaseId > 0) {
    tables.value = await SourceService.getTables(data.value.dataBaseId, false)
  } else {
    tables.value = []
  }
})


defineExpose({
  dataJson
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
</style>
