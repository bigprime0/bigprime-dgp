<template>
  <div :class="showBreadcrumb ? 'container-list' : ''">
    <Breadcrumb v-if="showBreadcrumb" class="svg-dir"
                :items="[isEmpty(flinkTaskData.pidName) ? t('development.task.field.job') : flinkTaskData.pidName]"
                :IconLeft="IconFolderOpened" />
    <div class="grid-toolbar">
      <tiny-search @search="search" @clear="search" v-model="searchValue"
                   :placeholder="$t('common.search.placeholder')"
                   is-enter-search clearable></tiny-search>
      <tiny-date-picker
        v-model="executeDate"
        type="daterange"
        :start-placeholder="$t('common.text.begin.date')"
        :end-placeholder="$t('common.text.end.date')"
        :range-separator="$t('common.text.to')"
      />
    </div>
    <tiny-grid style="max-height: calc(100vh - 480px);overflow: auto;" :data="tableData"
               size="small"
               border
               :stripe="true"
               highlight-hover-row
               resizable
               show-header-overflow="tooltip" show-overflow="tooltip">
      <tiny-grid-column field="taskModel.name" :title="$t('development.task.field.job')"></tiny-grid-column>
      <tiny-grid-column field="jobId" title="Flink Job Id"></tiny-grid-column>
      <tiny-grid-column :title="$t('development.task.field.execute.type')">
        <template v-slot="data">
          <span v-if="data.row.executeType === 1">{{ $t('development.task.field.perform.manually') }}</span>
          <span v-if="data.row.executeType === 2">{{ $t('development.task.field.schedule.execution') }}</span>
          <span v-if="data.row.executeType === 3">{{ $t('development.task.field.plan.execution') }}</span>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="beginDate" :title="$t('common.text.begin.time')"></tiny-grid-column>
      <tiny-grid-column field="endDate" :title="$t('common.text.end.time')"></tiny-grid-column>

      <tiny-grid-column :title="$t('service.api.log.field.status')">
        <template v-slot="data">
          <span v-if="data.row.status === 1" style="color: #24DD7F;">{{ $t('common.text.success') }}</span>
          <span v-if="data.row.status === 2" style="color: red">{{ $t('common.text.fail') }}</span>
        </template>
      </tiny-grid-column>

      <tiny-grid-column :title="$t('common.text.result')">
        <template v-slot="data">
          <tiny-popover placement="left" width="600">
            <json-viewer style="height: 400px;overflow-y: auto;"
                         :preview-mode="false"
                         :expanded="false"
                         :copyable="true"
                         :value="isEmpty(data.row.logContent) ? data.row.errMessage : data.row.logContent" />
            <template #reference>
              <tiny-link :underline="false" style="color: #1ac456;font-size: 12px;">{{ t('common.operations.look') }}
              </tiny-link>
            </template>
          </tiny-popover>
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
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { formPage } from '@/utils/tool'
import { iconFolderOpened } from '@opentiny/vue-icon'
import { FlinkTaskTriggersService } from '@/services/development/task-triggers'
import { isEmpty } from 'lodash-es'
import { addTimeToDate, formatDateTime } from '@/utils/date'

const IconFolderOpened = iconFolderOpened()

const { t } = useI18n()
const tableData = ref()
const searchValue = ref('')
const executeDate = ref()

const showBreadcrumb = defineModel('showBreadcrumb', { default: true })
const status = defineModel('status', { default: -1 })
const flinkTaskData = defineModel('flinkTaskData', {
  default: {
    id: 0,
    pid: 0,
    configId: 0,
    schedulerJobId: 0,
    name: '',
    type: 0,
    pidName: '',
    executeSql: '',
    configMap: {},
    status: 0,
    executeStatus: 0,
    executeDate: '',
    summary: ''
  } as any
})

const search = async () => {
  if (flinkTaskData.value.type > 0) {
    let begTime: any
    let endTime: any
    if (!isEmpty(executeDate.value)) {
      begTime = executeDate.value[0]
      endTime = addTimeToDate(executeDate.value[1], 23, 59, 59)
    }
    if (begTime && endTime) {
      begTime = formatDateTime(begTime)
      endTime = formatDateTime(endTime)
    }

    const result = await FlinkTaskTriggersService.getPage({
      page: formPage.value.page,
      limit: formPage.value.limit,
      beginDate: begTime,
      endDate: endTime,
      model: {
        taskId: flinkTaskData.value.id,
        jobId: searchValue.value,
        status: status.value
      }
    })
    tableData.value = result.list
    formPage.value.total = result.total
  } else {
    tableData.value = []
    formPage.value.total = 0
  }
}

watchEffect(async () => {
  if (flinkTaskData.value.id >= 0) {
    await search()
  }
})

const pageChange = (page: number) => {
  formPage.value.page = page
  search()
}

const limitChange = (limit: number) => {
  formPage.value.limit = limit
  search()
}
</script>

<style scoped lang="less">
.span-font {
  color: #3ac295;
}

.container-list {
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.tiny-breadcrumb .tiny-breadcrumb__item:last-child .tiny-breadcrumb__inner) {
    font-weight: 500;
    color: #2c3e50;
    text-decoration: none;
  }

  :deep(.container-breadcrumb) {
    font-size: 12px;
    margin: 0 10px 10px 0;
  }
}

.contain {
  flex: 1 1 auto;
  margin: 8px 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px 8px rgba(169, 174, 184, 0.05);
  padding: 10px;
  height: 99%;
}

.grid-toolbar {
  display: flex;
  justify-content: left;
  width: calc(60vh + 100px);
  margin-bottom: 10px;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }
}

.svg-dir {
  fill: #ffcc41;
}

.svg-file {
  fill: #1ac456;
}
</style>
