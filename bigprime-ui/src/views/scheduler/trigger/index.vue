<template>
  <tiny-grid :data="schedulerJobTriggersList" :fit="true" size="medium" auto-resize border :stripe="true"
             show-header-overflow="tooltip" show-overflow="tooltip"
             highlight-hover-row max-height="77%">
    <template #toolbar>
      <div v-if="showToolbar" class="grid-toolbar">
        <tiny-search v-model="searchValue"
                     :placeholder="$t('common.search.placeholder')"
                     is-enter-search clearable></tiny-search>
        <tiny-date-picker
          v-model="executeDate"
          type="daterange"
          :start-placeholder="$t('common.text.begin.date')"
          :end-placeholder="$t('common.text.end.date')"
          :range-separator="$t('common.text.to')"
        />
        <tiny-select v-model="executeStatus" :placeholder="$t('scheduler.trigger.field.executeStatus')" clearable>
          <tiny-option v-for="item in executeStatusList" :key="item.value" :label="$t(item.describe)"
                       :value="item.value">
          </tiny-option>
        </tiny-select>
      </div>
    </template>

    <tiny-grid-column field="jobModel.name" :title="$t('scheduler.job.field.name')"></tiny-grid-column>
    <tiny-grid-column :title="$t('scheduler.job.field.group')">
      <template v-slot="data">
        <span>{{ $t(findDescribe(schedulerGroupEnums, data.row.jobModel?.group)) }}</span>
      </template>
    </tiny-grid-column>
    <tiny-grid-column field="executeDate" :title="$t('scheduler.trigger.field.executeDate')"></tiny-grid-column>
    <tiny-grid-column field="begTime" :title="$t('scheduler.trigger.field.begTime')"></tiny-grid-column>
    <tiny-grid-column field="endTime" :title="$t('scheduler.trigger.field.endTime')"></tiny-grid-column>

    <tiny-grid-column field="executeStatus" :title="$t('scheduler.trigger.field.executeStatus')">
      <template v-slot="data">
        <span>{{ $t(findDescribe(executeStatusList, data.row.executeStatus)) }}</span>
      </template>
    </tiny-grid-column>

    <tiny-grid-column field="errorMsg" :title="$t('scheduler.trigger.field.errorMsg')">
      <template v-slot="data">
        <tiny-popover v-if="!isEmpty(data.row.errorMsg)" placement="left" width="500">
          <json-viewer :expanded="false" :expand-depth="2" :value="data.row.errorMsg" />
          <template #reference>
            <a>{{ t('common.operations.look') }}</a>
          </template>
        </tiny-popover>
      </template>
    </tiny-grid-column>

    <tiny-grid-column field="resultJson" :title="$t('scheduler.trigger.field.resultJson')">
      <template v-slot="data">
        <tiny-popover v-if="!isEmpty(data.row.resultJson)"
                      placement="left"
                      width="500"
                      trigger="click">
          <json-viewer
            :preview-mode="false"
            :expanded="false"
            :expand-depth="3"
            :copyable="true"
            :value="JSON.parse(data.row.resultJson)" />
          <template #reference>
            <a>{{ t('common.operations.look') }}</a>
          </template>
        </tiny-popover>
      </template>
    </tiny-grid-column>

  </tiny-grid>
  <tiny-pager
    :current-page="triggerFormPage.page"
    :page-size="triggerFormPage.limit"
    :total="triggerFormPage.total"
    :page-sizes="triggerFormPage.pageSizes"
    @current-change="pageChange"
    @size-change="limitChange"
    :align="triggerFormPage.align"
    :layout="triggerFormPage.layout"
  ></tiny-pager>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { findDescribe, type SelectModel } from '@/utils/tool'
import { SchedulerJobTriggersService } from '@/services/scheduler/scheduler-trigger'
import { useI18n } from 'vue-i18n'
import { isDate, isEmpty, isInteger } from 'lodash-es'
import { addTimeToDate, formatDateTime } from '@/utils/date'
import { CurrencyService } from '@/services/currency/currency'

const { t } = useI18n()
const searchValue = ref('')
const jobId = defineModel('jobId', { default: -1 })
const group = defineModel('group', { default: '' })
const executeStatus = defineModel('executeStatus')
const executeDateInfo = defineModel<Date>('executeDateInfo')
const executeDate = ref()
const showToolbar = defineModel('showToolbar', { default: true })
const executeStatusList = [{
  value: 1,
  describe: t('scheduler.trigger.field.executeStatus.inProgress')
}, {
  value: 2,
  describe: t('scheduler.trigger.field.executeStatus.error')
}, {
  value: 3,
  describe: t('scheduler.trigger.field.executeStatus.success')
}]
const schedulerJobTriggersList = ref({
  jobModel:{
    id:0,
    name:'',
    group:''
  }
})

const triggerFormPage = ref({
  total: 0,
  page: 1,
  limit: 10,
  pageSizes: [10, 15, 20, 50, 100],
  align: 'right',// 可选值：['left', 'center', 'right']
  layout: 'total, prev, pager, next, jumper, sizes'
})


const search = async () => {
  let begTime: any
  let endTime: any
  if (!isEmpty(executeDate.value)) {
    begTime = executeDate.value[0]
    endTime = addTimeToDate(executeDate.value[1], 23, 59, 59)
  }
  if (isDate(executeDateInfo.value)) {
    begTime = executeDateInfo.value
    endTime = addTimeToDate(begTime, 23, 59, 59)
  }
  if (begTime && endTime) {
    begTime = formatDateTime(begTime)
    endTime = formatDateTime(endTime)
  }

  const result = await SchedulerJobTriggersService.getPage({
    model: {
      begTime: begTime,
      endTime: endTime,
      jobId: jobId.value,
      executeStatus: isInteger(executeStatus.value) ? executeStatus.value : 0,
      jobModel: {
        name: searchValue.value,
        group: group.value
      }
    },
    page: triggerFormPage.value.page,
    limit: triggerFormPage.value.limit
  })
  schedulerJobTriggersList.value = result.list
  triggerFormPage.value.total = result.total
}

const pageChange = (page: number) => {
  triggerFormPage.value.page = page
  search()
}

const limitChange = (limit: number) => {
  triggerFormPage.value.limit = limit
  search()
}

watchEffect(async () => {
  if (jobId.value || executeStatus.value || executeDateInfo.value || searchValue.value || group.value) {
    await search()
  }
})

const schedulerGroupEnums = ref<SelectModel[]>()
onMounted(async () => {
  schedulerGroupEnums.value = await CurrencyService.getEnum('SchedulerGroupEnum')
})
</script>

<style scoped lang="less">
.lookJson {
  margin-bottom: 20px;
}

.grid-toolbar {
  display: flex;
  justify-content: left;
  width: calc(65vh + 100px);
  margin: 12px 0;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }

  :deep(.tiny-date-editor--daterange.tiny-input, .tiny-date-editor--daterange.tiny-input__inner, .tiny-date-editor--timerange.tiny-input, .tiny-date-editor--timerange.tiny-input__inner) {
    width: 260px;
  }
}
</style>
