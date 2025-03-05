<template>
  <tiny-grid :data="dataLifeCycleTaskList" :fit="true" size="medium" auto-resize border :stripe="true"
             show-header-overflow="tooltip" show-overflow="tooltip"
             highlight-hover-row max-height="85%">
    <template #toolbar>
      <div class="grid-toolbar">
        <tiny-search @search="search" @clear="search" v-model="searchValue"
                     :placeholder="$t('common.search.placeholder')"
                     is-enter-search clearable></tiny-search>
        <div>
          <tiny-button type="primary" @click="openDataLifeCycleTaskForm(null, 'add')">{{
              $t('common.operations.add') }}
          </tiny-button>
        </div>
      </div>
    </template>

    <tiny-grid-column field="id" :title="$t('common.id')" width="50"></tiny-grid-column>
    <tiny-grid-column field="name"
                      :title="type === 1 ? $t('lifecycle.task.field.nearline.name') :
                              type === 2 ? $t('lifecycle.task.field.offline.name') : $t('lifecycle.task.field.destruction.name')"></tiny-grid-column>
    <tiny-grid-column field="lifeCycleName" :title="type === 1 ? $t('lifecycle.filing.field.nearline.name') :
                              type === 2 ? $t('lifecycle.filing.field.offline.name') : $t('lifecycle.filing.field.destruction.name')">
    </tiny-grid-column>
    <tiny-grid-column field="sourceId" :title="$t('lifecycle.filing.field.sourceId')">
      <template v-slot="data">
        {{ findValue(sourceTree, data.row.sourceId, 'id', 'name') }}
      </template>
    </tiny-grid-column>
    <tiny-grid-column field="tableName" :title="$t('lifecycle.filing.field.tableName')"></tiny-grid-column>
    <tiny-grid-column field="condition" :title="type === 1 ? $t('lifecycle.filing.field.nearline.condition') :
                              type === 2 ? $t('lifecycle.filing.field.offline.condition') : $t('lifecycle.filing.field.destruction.condition')">
    </tiny-grid-column>
    <tiny-grid-column field="remark" :title="$t('common.summary')"></tiny-grid-column>
    <tiny-grid-column field="taskType" width="90"
                      :title="$t('lifecycle.task.field.taskType')">
      <template v-slot="data">
        <span v-if="data.row.taskType === 1">{{ $t('lifecycle.task.field.taskType.disposable') }}</span>
        <span v-if="data.row.taskType === 2">{{ $t('lifecycle.task.field.taskType.periodicity') }}</span>
      </template>
    </tiny-grid-column>

    <tiny-grid-column field="status" width="90"
                      :title="$t('common.operations.status')">
      <template v-slot="data">
        <span v-if="data.row.status === 0">{{ $t('common.operations.status.new') }}</span>
        <span v-if="data.row.status === 1">{{ $t('common.operations.status.underReview') }}</span>
        <span v-if="data.row.status === 2">{{ $t('common.operations.status.published') }}</span>
        <span v-else></span>
      </template>
    </tiny-grid-column>

    <tiny-grid-column field="taskStatus" width="90"
                      :title="$t('common.operations.execute.status')">
      <template v-slot="data">
        <span v-if="data.row.taskStatus === 0">{{ $t('common.operations.execute.status.notStarted') }}</span>
        <span v-if="data.row.taskStatus === 1">{{ $t('common.operations.execute.status.inProgress') }}</span>
        <span v-if="data.row.taskStatus === 2">{{ $t('common.operations.execute.status.completed') }}</span>
        <span v-else></span>
      </template>
    </tiny-grid-column>


    <tiny-grid-column :title="$t('common.operations')" width="190" align="center">
      <template v-slot="data">
        <a v-if="data.row.status === 0" @click="deleteDataLifeCycleTaskData(data.row.id)">
          {{ t('common.operations.delete') }}
        </a>

        <a v-if="data.row.status === 0"
           @click="handleStatus(data.row,'status',2,t('common.operations.status.publish.prompt'))">
          {{ t('common.operations.status.publish') }}
        </a>
        <a v-if="data.row.status === 2 && data.row.taskStatus === 0"
           @click="handleStatus(data.row,'status',0,t('common.operations.status.unpublish.prompt'))">
          {{ t('common.operations.status.unpublish') }}
        </a>

        <a v-if="data.row.status === 2 && data.row.taskStatus === 0"
           @click="handleStatus(data.row,'taskStatus', 1,t('common.operations.execute.status.begExecute.prompt'))">
          {{ t('common.operations.execute.status.begExecute') }}
        </a>

        <a v-if="data.row.taskStatus === 1"
           @click="handleStatus(data.row,'taskStatus', 0,t('common.operations.execute.status.RevocationOfExecution.prompt'))">
          {{ t('common.operations.execute.status.RevocationOfExecution') }}
        </a>

        <a v-if="data.row.taskStatus === 1"
           @click="handleStatus(data.row,'taskStatus', 2,t('common.operations.execute.status.executionCompleted.prompt'))">
          {{ t('common.operations.execute.status.executionCompleted') }}
        </a>

        <a v-if="data.row.taskStatus === 2"
           @click="handleStatus(data.row,'taskStatus', 1,t('common.operations.execute.status.RevocationCompleted.prompt'))">
          {{ t('common.operations.execute.status.RevocationCompleted') }}
        </a>

        <a @click="openDataLifeCycleTaskForm(data.row, 'update')">
          {{ data.row.status === 0 ? t('common.operations.update') : t('common.operations.look') }}
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
    <tiny-drawer :title="dataLifeCycleTaskFormTitle"
                 :visible="dataLifeCycleTaskFormDrawer"
                 @update:visible="dataLifeCycleTaskFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataLifeCycleTaskForm(false)">
      <div>
        <suspense>
          <DataForm :data-life-cycle-task-form-data="dataLifeCycleTaskFormData" :source-tree="sourceTree"
                    :life-cycle-tree="lifeCycleTree"></DataForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { assign, cloneDeep, find } from 'lodash-es'
import { Modal } from '@opentiny/vue'
import { findValue, formPage } from '@/utils/tool'
import DataForm from '@/views/governance/data-lifecycle/components/life-cycle-task-form.vue'
import { DataLifeCycleTaskService } from '@/services/lifecycle/life-cycle-task'
import { SourceService } from '@/services/spi/source'
import { DataLifeCycleService } from '@/services/lifecycle/life-cycle-filing'

const type = defineModel('type', { default: 0 })
const { t } = useI18n()
const searchValue = ref('')
const dataLifeCycleTaskList = ref()

const dataLifeCycleTaskFormDrawer = ref(false)
const dataLifeCycleTaskFormTitle = ref('')
const dataLifeCycleTaskFormData = ref()
const dataLifeCycleTaskFormDataCopy = ref()

const sourceTree = ref()
const lifeCycleTree = ref()

const search = async () => {
  const result = await DataLifeCycleTaskService.getPage({
    model: {
      type: type.value,
      name: searchValue.value
    },
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  result.list.forEach((o:any) => {
     let data = find(lifeCycleTree.value,{id:o.lifeCycleId});
     if(data){
       o.lifeCycleName = data.name
       o.tableName = data.tableName
       o.sourceId = data.sourceId
       o.condition = data.condition
     }
  })
  dataLifeCycleTaskList.value = result.list
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

const openDataLifeCycleTaskForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    dataLifeCycleTaskFormTitle.value = t('common.text.add.data')
    dataLifeCycleTaskFormData.value = { id: 0, type: type.value, status: 0, taskStatus: 0 }
  } else {
    dataLifeCycleTaskFormTitle.value = t('common.text.update.data')
    dataLifeCycleTaskFormData.value = row
    dataLifeCycleTaskFormDataCopy.value = cloneDeep(row)
  }
  dataLifeCycleTaskFormDrawer.value = true
}

const deleteDataLifeCycleTaskData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await DataLifeCycleTaskService.deleteById(id)
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      await search()
    }
  })
}

const closeDataLifeCycleTaskForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(dataLifeCycleTaskFormData.value, dataLifeCycleTaskFormDataCopy.value)
  }
  dataLifeCycleTaskFormDrawer.value = false
}

emitter.on('closeDataLifeCycleTaskForm', (isUp) => {
  closeDataLifeCycleTaskForm(isUp)
})

const initData = async () => {
  sourceTree.value = await SourceService.getList({
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

const handleStatus = (row: any, field: any, newStatus: number, message: string) => {
  Modal.confirm(message).then(async (res: string) => {
    if (res === 'confirm') {
      row[field] = newStatus
      await DataLifeCycleTaskService.save(row)
      await search()
    }
  })
}

onMounted(async () => {
  await initData()
  await search()
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
