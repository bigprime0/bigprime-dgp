<template>
  <tiny-grid :data="dataLifeCycleList" :fit="true" size="medium" auto-resize border :stripe="true"
             show-header-overflow="tooltip" show-overflow="tooltip"
             highlight-hover-row max-height="85%">
    <template #toolbar>
      <div class="grid-toolbar">
        <tiny-search @search="search" @clear="search" v-model="searchValue"
                     :placeholder="$t('common.search.placeholder')"
                     is-enter-search clearable></tiny-search>
        <div>
          <tiny-button type="primary" @click="openDataLifeCycleForm(null, 'add')">{{
              $t('common.operations.add') }}
          </tiny-button>
        </div>
      </div>
    </template>

    <tiny-grid-column field="id" :title="$t('common.id')" width="50"></tiny-grid-column>
    <tiny-grid-column field="name"
                      :title="type === 1 ? $t('lifecycle.filing.field.nearline.name') :
                              type === 2 ? $t('lifecycle.filing.field.offline.name') : $t('lifecycle.filing.field.destruction.name')"></tiny-grid-column>
    <tiny-grid-column field="tableName"
                      :title="$t('lifecycle.filing.field.tableName')"></tiny-grid-column>
    <tiny-grid-column :title="$t('lifecycle.filing.field.sourceId')">
      <template v-slot="data">
        {{ findValue(sourceTree, data.row.sourceId, 'key', 'label') }}
      </template>
    </tiny-grid-column>
    <tiny-grid-column field="warehouseLocation" width="80"
                      :title="$t('lifecycle.filing.field.warehouseLocation')"></tiny-grid-column>
    <!--    <tiny-grid-column field="storagePath"
                          :title="$t('lifecycle.filing.field.storagePath')"></tiny-grid-column>-->
    <tiny-grid-column field="condition"
                      :title="type === 1 ? $t('lifecycle.filing.field.nearline.condition') :
                              type === 2 ? $t('lifecycle.filing.field.offline.condition') : $t('lifecycle.filing.field.destruction.condition')"></tiny-grid-column>
    <tiny-grid-column field="size" width="90"
                      :title="$t('lifecycle.filing.field.size')"></tiny-grid-column>
    <tiny-grid-column field="rows" width="90"
                      :title="$t('lifecycle.filing.field.rows')"></tiny-grid-column>
    <tiny-grid-column field="status" width="90"
                      :title="$t('common.operations.status')">
      <template v-slot="data">
        <span v-if="data.row.status === 0">{{ $t('common.operations.status.new') }}</span>
        <span v-if="data.row.status === 1">{{ $t('common.operations.status.underReview') }}</span>
        <span v-if="data.row.status === 2">{{ $t('common.operations.status.published') }}</span>
        <span v-else></span>
      </template>
    </tiny-grid-column>

    <tiny-grid-column :title="$t('common.operations')" width="150" align="center">
      <template v-slot="data">
        <a v-if="data.row.status === 0" @click="deleteDataLifeCycleData(data.row.id)">
          {{ t('common.operations.delete') }}
        </a>
        <a v-if="data.row.status === 0"
           @click="handleStatus(data.row,2,t('common.operations.status.publish.prompt'))">
          {{ t('common.operations.status.publish') }}
        </a>
        <a v-if="data.row.status === 2"
           @click="handleStatus(data.row,0,t('common.operations.status.unpublish.prompt'))">
          {{ t('common.operations.status.unpublish') }}
        </a>
        <a @click="openDataLifeCycleForm(data.row, 'update')">
          {{ data.row.status === 0 ? t('common.operations.update') : t('common.operations.look')}}
        </a>
      </template>
    </tiny-grid-column>
  </tiny-grid>
  <tiny-pager
    :current-page="formPage.page"
    :page-size="formPage.limit"
    :total="formPage.total"
    :page-sizes="formPage.pageSizes"
    @current-change="pageChange"
    @size-change="limitChange"
    :align="formPage.align"
    :layout="formPage.layout"
  ></tiny-pager>
  <div>
    <tiny-drawer :title="dataLifeCycleFormTitle"
                 :visible="dataLifeCycleFormDrawer"
                 @update:visible="dataLifeCycleFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataLifeCycleForm(false)">
      <div>
        <suspense>
          <DataForm :data-life-cycle-form-data="dataLifeCycleFormData" :source-tree="sourceTree" :table-tree="tableTree"
                    :table-values="tableValues"></DataForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { assign, cloneDeep } from 'lodash-es'
import { Modal } from '@opentiny/vue'
import { findValue, formPage } from '@/utils/tool'
import DataForm from '@/views/governance/data-lifecycle/components/life-cycle-filing-form.vue'
import { DataLifeCycleService } from '@/services/lifecycle/life-cycle-filing'
import { DataHouseLayerService } from '@/services/warehouse/data-house-layer'

const type = defineModel('type', { default: 0 })

const { t } = useI18n()
const searchValue = ref('')
const dataLifeCycleList = ref()

const dataLifeCycleFormDrawer = ref(false)
const dataLifeCycleFormTitle = ref('')
const dataLifeCycleFormData = ref()
const dataLifeCycleFormDataCopy = ref()

const sourceTree = ref()
const tableTree = ref()
const tableValues = ref()

const search = async () => {
  const result = await DataLifeCycleService.getPage({
    model: {
      name: searchValue.value,
      type: type.value
    },
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  dataLifeCycleList.value = result.list
  formPage.value.total = result.total
}

const pageChange = (page: number) => {
  formPage.value.page = page
  search()
}

const limitChange = (limit: number) => {
  formPage.value.limit = limit
  search()
}

const openDataLifeCycleForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    dataLifeCycleFormTitle.value = t('common.text.add.data')
    dataLifeCycleFormData.value = { id: 0, type: type.value, status: 0 }
  } else {
    dataLifeCycleFormTitle.value = t('common.text.update.data')
    dataLifeCycleFormData.value = row
    dataLifeCycleFormData.value.tableSelect = dataLifeCycleFormData.value.tableName
    dataLifeCycleFormDataCopy.value = cloneDeep(row)
  }
  dataLifeCycleFormDrawer.value = true
}

const deleteDataLifeCycleData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await DataLifeCycleService.deleteById(id)
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      await search()
    }
  })
}

const closeDataLifeCycleForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(dataLifeCycleFormData.value, dataLifeCycleFormDataCopy.value)
  }
  dataLifeCycleFormDrawer.value = false
}

emitter.on('closeDataLifeCycleForm', (isUp) => {
  closeDataLifeCycleForm(isUp)
})

const computeSize = (dataLength: any, indexLength: any) => {
  let count = 0
  if (dataLength) {
    count += dataLength
  }
  if (indexLength) {
    count += indexLength
  }
  if (count > 0) {
    return (count / 1024 / 1024).toFixed(2)
  }
  return count
}

const initData = async () => {
  let houseData: any = await DataHouseLayerService.getHouseTree()
  let source: any = []
  let table: any = []
  let tableVs: any = []
  houseData.forEach((o: any) => {
    if (o.children) {
      o.children.forEach((c: any) => {
        let s: any = {
          key: c.databaseId,
          label: c.name
        }
        source.push(s)

        let value: any = []
        let d: any = {
          key: c.id,
          label: c.name + '(' + o.name + ')',
          value: value
        }
        if (c.children) {
          c.children.forEach((t: any) => {
            let v: any = {
              id: c.id + '$' + t.name,
              tableName: t.name,
              rows: t.rows,
              sourceId: c.databaseId,
              warehouseLocation: o.name,
              size: computeSize(t.dataLength, t.indexLength)
            }
            value.push(v)
            tableVs.push(v)
          })
        }
        table.push(d)
      })
    }
  })
  sourceTree.value = source
  tableTree.value = table
  tableValues.value = tableVs
}

const handleStatus = (row: any, newStatus: number, message: string) => {
  Modal.confirm(message).then(async (res: string) => {
    if (res === 'confirm') {
      row.status = newStatus
      await DataLifeCycleService.save(row)
      await search()
    }
  })
}

onMounted(() => {
  initData()
  search()
})
</script>

<style scoped lang="less">
.grid-toolbar {
  display: flex;
  justify-content: left;
  width: calc(25vh + 100px);
  margin: 12px 0;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }
}
</style>
