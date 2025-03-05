<template>
  <tiny-grid :data="dataLifeCycleLogList" :fit="true" size="medium" auto-resize border :stripe="true"
             show-header-overflow="tooltip" show-overflow="tooltip"
             highlight-hover-row max-height="85%">
    <template #toolbar>
      <div class="grid-toolbar">
        <tiny-search @search="search" @change="search" @clear="search" v-model="searchValue"
                     :placeholder="$t('common.search.placeholder')"
                     is-enter-search clearable></tiny-search>

        <tiny-select v-model="changeType" :placeholder="$t('common.operations.log.type')" clearable
                     @change="search">
          <tiny-option :key=1 :label="$t('common.operations.update') " :value=1></tiny-option>
          <tiny-option :key=2 :label="$t('common.operations.delete')" :value=2></tiny-option>
          <tiny-option :key=3 :label="$t('common.operations.status.publish')" :value=3></tiny-option>
          <tiny-option :key=4 :label="$t('common.operations.status.unpublish')" :value=4></tiny-option>
          <tiny-option v-if="logType === 2" :key=5 :label="$t('common.operations.execute.status.begExecute')"
                       :value=5></tiny-option>
          <tiny-option v-if="logType === 2" :key=6 :label="$t('common.operations.execute.status.RevocationOfExecution')"
                       :value=6></tiny-option>
          <tiny-option v-if="logType === 2" :key=7 :label="$t('common.operations.execute.status.executionCompleted')"
                       :value=7></tiny-option>
          <tiny-option v-if="logType === 2" :key=8 :label="$t('common.operations.execute.status.RevocationCompleted')"
                       :value=8></tiny-option>
        </tiny-select>
        <tiny-date-picker
          v-model="executeDate"
          type="daterange"
          :start-placeholder="$t('common.text.begin.date')"
          :end-placeholder="$t('common.text.end.date')"
          :range-separator="$t('common.text.to')"
          @change="search"
        ></tiny-date-picker>
      </div>
    </template>

    <tiny-grid-column field="id" :title="$t('common.id')" width="50"></tiny-grid-column>

    <tiny-grid-column v-if="logType === 1" field="parentName"
                      :title="type === 1 ? $t('lifecycle.filing.field.nearline.name') :
                              type === 2 ? $t('lifecycle.filing.field.offline.name') : $t('lifecycle.filing.field.destruction.name')"></tiny-grid-column>
    <tiny-grid-column v-if="logType === 2" field="parentName"
                      :title="type === 1 ? $t('lifecycle.task.field.nearline.name') :
                              type === 2 ? $t('lifecycle.task.field.offline.name') : $t('lifecycle.task.field.destruction.name')"></tiny-grid-column>

    <tiny-grid-column field="changeType"
                      :title="$t('common.operations.log.type')">
      <template v-slot="data">
        <span v-if="data.row.changeType === 1">{{ $t('common.operations.update') }}</span>
        <span v-if="data.row.changeType === 2">{{ $t('common.operations.delete') }}</span>
        <span v-if="data.row.changeType === 3">{{ $t('common.operations.status.publish') }}</span>
        <span v-if="data.row.changeType === 4">{{ $t('common.operations.status.unpublish') }}</span>
        <span v-if="data.row.changeType === 5">{{ $t('common.operations.execute.status.begExecute') }}</span>
        <span v-if="data.row.changeType === 6">{{ $t('common.operations.execute.status.RevocationOfExecution') }}</span>
        <span v-if="data.row.changeType === 7">{{ $t('common.operations.execute.status.executionCompleted') }}</span>
        <span v-if="data.row.changeType === 8">{{ $t('common.operations.execute.status.RevocationCompleted') }}</span>
        <span v-else></span>
      </template>
    </tiny-grid-column>

    <tiny-grid-column field="updateName" :title="$t('common.field.updaterName')"></tiny-grid-column>
    <tiny-grid-column field="updateTime" :title="$t('common.field.updateTime')"></tiny-grid-column>

    <tiny-grid-column :title="$t('common.operations')" width="100" align="center">
      <template v-slot="data">
        <a @click="openDataLifeCycleLogForm(data.row)">
          {{ t('common.operations.look') }}
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
    <tiny-drawer :title="$t('common.operations.look')"
                 :visible="dataLifeCycleLogFormDrawer"
                 @update:visible="dataLifeCycleLogFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="80%"
                 @close="dataLifeCycleLogFormDrawer = false">
      <div>
        <suspense>
          <LifeCycleLogForm :source="source" :begin-data="beginData" :end-data="endData"
                            :color-changes="colorChanges" :logType="logType" :life-cycle-tree="lifeCycleTree"></LifeCycleLogForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formPage } from '@/utils/tool'
import { DataLifeCycleLogService } from '@/services/lifecycle/life-cycle-log'
import { find, isEmpty, isEqual, keys, omitBy } from 'lodash-es'
import { addTimeToDate } from '@/utils/date'
import LifeCycleLogForm from '@/views/governance/data-lifecycle/components/life-cycle-log-form.vue'
import { SourceService } from '@/services/spi/source'
import { DataLifeCycleService } from '@/services/lifecycle/life-cycle-filing'

const type = defineModel('type', { default: 0 })
const logType = defineModel('logType', { default: 0 })
const { t } = useI18n()
const dataLifeCycleLogList = ref()
const changeType = ref()
const searchValue = ref()
const executeDate = ref()

const dataLifeCycleLogFormDrawer = ref()
const colorChanges = ref()
const beginData = ref()
const endData = ref()
const source = ref()
const lifeCycleTree = ref()

const search = async () => {
  let query: any = {
    model: {
      logType: logType.value,
      type: type.value
    },
    page: formPage.value.page,
    limit: formPage.value.limit
  }
  if (searchValue.value) {
    query.model.parentName = searchValue.value
  }
  if (changeType.value) {
    query.model.changeType = changeType.value
  }
  if (!isEmpty(executeDate.value)) {
    query.model.begTime = executeDate.value[0]
    query.model.endTime = addTimeToDate(executeDate.value[1], 23, 59, 59)
  }
  const result = await DataLifeCycleLogService.getPage(query)
  dataLifeCycleLogList.value = result.list
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

const openDataLifeCycleLogForm = (row: any) => {
  let bData:any = JSON.parse(row.beginData)
  let eData:any = JSON.parse(row.endData)
  if(logType.value === 2){
    let dFind = find(lifeCycleTree.value,{id:bData.lifeCycleId});
    if(dFind){
      bData.lifeCycleName = dFind.name
      bData.tableName = dFind.tableName
      bData.sourceId = dFind.sourceId
      bData.condition = dFind.condition
      if(eData.lifeCycleId === dFind.lifeCycleId){
        eData.lifeCycleName = dFind.name
        eData.tableName = dFind.tableName
        eData.sourceId = dFind.sourceId
        eData.condition = dFind.condition
      }
    }
    if(eData.lifeCycleId !== dFind.lifeCycleId){
      let eFind = find(lifeCycleTree.value,{id:eData.lifeCycleId});
      if(eFind){
        eData.lifeCycleName = eFind.name
        eData.tableName = eFind.tableName
        eData.sourceId = eFind.sourceId
        eData.condition = eFind.condition
      }
    }
  }
  const differences = omitBy(bData, (value, key) => isEqual(value, eData[key]))
  colorChanges.value = keys(differences)
  beginData.value = bData
  endData.value = eData
  dataLifeCycleLogFormDrawer.value = true
}

const initData = async () => {
  source.value = await SourceService.getList({
    search: '',
    config: false
  })

  lifeCycleTree.value = await DataLifeCycleService.getList({
    model: {
      type: type.value,
      status: 2
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
  width: calc(80vh + 100px);
  margin: 12px 0;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }
}
</style>
