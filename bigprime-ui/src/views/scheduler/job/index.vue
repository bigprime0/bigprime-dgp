<template>
  <div class="container-list">
    <Breadcrumb v-if="schedulerGroupValue === ''" :items="['menu.scheduler', 'menu.scheduler.job']" />
    <div class="contain">
      <tiny-grid :data="schedulerJobList" :fit="true" size="medium" auto-resize border :stripe="true"
                 show-header-overflow="tooltip" show-overflow="tooltip"
                 highlight-hover-row max-height="85%">
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search @search="search" @clear="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>

            <tiny-select v-if="schedulerGroupValue === ''" v-model="searchGroupValue"
                         :placeholder="$t('scheduler.job.field.group')" clearable
                         @change="search">
              <tiny-option v-for="item in schedulerGroupEnums" :key="item.value" :label="$t(item.describe)"
                           :value="item.value">
              </tiny-option>
            </tiny-select>

            <tiny-button v-if="schedulerGroupValue === ''" type="primary" @click="openSchedulerJobForm(null, 'add')">
              {{ $t('common.operations.add') }}
            </tiny-button>
          </div>
        </template>

        <tiny-grid-column field="id" :title="$t('common.id')" width="50"></tiny-grid-column>
        <tiny-grid-column field="name" :title="$t('scheduler.job.field.name')"></tiny-grid-column>
        <tiny-grid-column :title="$t('scheduler.job.field.group')">
          <template v-slot="data">
            <span>{{ $t(findDescribe(schedulerGroupEnums, data.row.group)) }}</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column :title="$t('scheduler.job.field.actuator')">
          <template v-slot="data">
            <span>{{ $t(findDescribe(schedulerActuatorEnums, data.row.actuator)) }}</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="cron" :title="$t('scheduler.job.field.cron')"></tiny-grid-column>
        <tiny-grid-column :title="$t('scheduler.job.field.concurrent')">
          <template v-slot="data">
            <tiny-switch v-model="data.row.concurrent" :disabled="true"></tiny-switch>
          </template>
        </tiny-grid-column>
        <tiny-grid-column :title="$t('scheduler.job.field.status')">
          <template v-slot="data">
            <tiny-switch v-model="data.row.status" :disabled="true"></tiny-switch>
          </template>
        </tiny-grid-column>

        <tiny-grid-column :title="$t('common.operations')" width="200" align="center">
          <template v-slot="data">
            <a v-if="schedulerGroupValue !== '' || data.row.group === 'CUSTOM'"
               @click="deleteSchedulerJobData(data.row.id)">
              {{ t('common.operations.delete') }}
            </a>
            <a v-if="schedulerGroupValue !== '' || data.row.group === 'CUSTOM'"
               @click="openSchedulerJobForm(data.row, 'update')">
              {{ t('common.operations.update') }}
            </a>
            <a v-if="schedulerGroupValue !== '' || data.row.group === 'CUSTOM'"
               @click="executeOnceTask(data.row)">
              {{ t('common.operations.execute.once') }}
            </a>

            <a v-if="schedulerGroupValue === '' && data.row.group !== 'CUSTOM'"
               @click="openSchedulerJobForm(data.row, 'look')">
              {{ t('common.operations.look') }}
            </a>

            <a @click="openSchedulerTrigger(data.row)">
              {{ t('scheduler.trigger.field.execution.log') }}
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
    </div>
  </div>

  <div>
    <tiny-drawer :title="schedulerJobFormTitle"
                 :visible="schedulerJobFormDrawer"
                 @update:visible="schedulerJobFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeSchedulerJobForm(false)">
      <div>
        <suspense>
          <SchedulerJobForm :schedulerJobFormData="schedulerJobFormData"
                            :from-disabled="fromDisabled"
                            :schedulerGroupEnums="schedulerGroupEnums"
                            :schedulerActuatorEnums="schedulerActuatorEnums">
          </SchedulerJobForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
  <div>
    <tiny-drawer :title="$t('scheduler.trigger.field.execution.log')"
                 :visible="schedulerTriggerDrawer"
                 @update:visible="schedulerTriggerDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="schedulerTriggerDrawer = false">
      <div>
        <suspense>
          <SchedulerTrigger :jobId="jobId" lazy />
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
import { Modal, Notify } from '@opentiny/vue'
import { findDescribe, formPage, type SelectModel } from '@/utils/tool'
import SchedulerJobForm from '@/views/scheduler/job/components/scheduler-job-form.vue'
import { SchedulerJobService } from '@/services/scheduler/scheduler-job'
import { CurrencyService } from '@/services/currency/currency'
import SchedulerTrigger from '@/views/scheduler/trigger/index.vue'


const { t } = useI18n()
const searchValue = ref('')
const schedulerJobList = ref()
const schedulerJobFormDrawer = ref(false)
const schedulerJobFormTitle = ref('')
const schedulerJobFormData = ref()
const schedulerJobFormDataCopy = ref()
const schedulerGroupValue = defineModel('schedulerGroupValue', { default: '' })
const searchGroupValue = ref()
const fromDisabled = ref()
const schedulerGroupEnums = ref<SelectModel[]>()
const schedulerActuatorEnums = ref<SelectModel[]>()

onMounted(async () => {
  schedulerGroupEnums.value = await CurrencyService.getEnum('SchedulerGroupEnum')
  schedulerActuatorEnums.value = await CurrencyService.getEnum('SchedulerActuatorEnum')
  await search()
})

const pageChange = (page: number) => {
  formPage.value.page = page
  search()
}

const limitChange = (limit: number) => {
  formPage.value.limit = limit
  search()
}

const search = async () => {
  if (schedulerGroupValue.value !== '') {
    searchGroupValue.value = schedulerGroupValue.value
  }
  const result = await SchedulerJobService.getPage({
    search: searchValue.value,
    group: searchGroupValue.value,
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  schedulerJobList.value = result.list
  formPage.value.total = result.total
}

const openSchedulerJobForm = (row: any, typeValue: any) => {
  fromDisabled.value = false
  if (typeValue == 'add') {
    schedulerJobFormTitle.value = t('common.text.add.data')
    schedulerJobFormData.value = { id: 0, group: 'CUSTOM', concurrent: 0, status: 1 }
  } else {
    if (typeValue == 'look') {
      fromDisabled.value = true
    }
    schedulerJobFormTitle.value = t('common.text.update.data')
    schedulerJobFormData.value = row
    schedulerJobFormDataCopy.value = cloneDeep(row)
  }
  schedulerJobFormDrawer.value = true
}

const deleteSchedulerJobData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await SchedulerJobService.deleteById(id)
      Notify({
        type: 'success',
        message: t('common.prompt.delete.success'),
        position: 'top-right',
        duration: 1000
      })
      await search()
    }
  })
}

const executeOnceTask = (row: any) => {
  if (!row.status) {
    Notify({
      type: 'fail',
      message: t('common.operations.execute.once.status'),
      position: 'top-right',
      duration: 2000
    })
    return
  }
  Modal.confirm(t('common.operations.execute.once.prompt')).then(async (res: string) => {
    if (res === 'confirm') {
      await SchedulerJobService.executeOnceTask(row.id)
      Notify({
        type: 'success',
        message: t('common.operations.execute.success'),
        position: 'top-right',
        duration: 1000
      })
    }
  })
}

const closeSchedulerJobForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    //还原数据
    assign(schedulerJobFormData.value, schedulerJobFormDataCopy.value)
  }
  schedulerJobFormDrawer.value = false
}

emitter.on('closeSchedulerJobForm', (isUp) => {
  closeSchedulerJobForm(isUp)
})

const schedulerTriggerDrawer = ref(false)
const jobId = ref(0)
const openSchedulerTrigger = (row: any) => {
  jobId.value = row.id
  schedulerTriggerDrawer.value = true
}

</script>

<style scoped lang="less">
.container-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
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
  width: calc(50vh + 100px);
  margin: 12px 0;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }
}
</style>
