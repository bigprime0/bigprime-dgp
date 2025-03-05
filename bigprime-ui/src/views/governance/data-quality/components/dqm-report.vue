<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dqm', 'menu.dg.dg-dqm.dg-dqm-report']" />
    <div class="contain">
      <div class="grid-toolbar">
        <tiny-date-picker v-model="executeDate"
                          size="mini"
                          align="right"
                          :clearable="false"
                          :editable="false"
                          @change="search">
        </tiny-date-picker>
      </div>
      <div class="div-cls">
        <div class="div-statistic">
          <tiny-statistic
            :value="statistic?.totalNumberOfExecutions"
            :value-style="{'color': '#eb1212', 'font-size': '25px'}"
            :title="{ position: 'bottom' }"
          >
            <template #title>
          <span style="font-size: 20px;color: #3ac295">{{ $t('governance.quality.report.totalNumberOfExecutions')
            }}</span>
            </template>
            <template #suffix>
              <span style="font-size: 15px">{{ $t('governance.quality.report.order') }}</span>
            </template>
          </tiny-statistic>
        </div>
        <div class="div-statistic">
          <tiny-statistic
            :value="statistic?.numberOfSuccessfulExecutions"
            :value-style="{ 'color': '#eb1212', 'font-size':'25px' }"
            :title="{ position: 'bottom' }"
          >
            <template #title>
          <span style="font-size: 20px;color: #3ac295">{{ $t('governance.quality.report.numberOfSuccessfulExecutions')
            }}</span>
            </template>
            <template #suffix>
              <span style="font-size: 15px">{{ $t('governance.quality.report.order') }}</span>
            </template>
          </tiny-statistic>
        </div>
        <div class="div-statistic">
          <tiny-statistic
            :value="statistic?.numberOfFailedExecutions"
            :value-style="{ 'color': '#eb1212', 'font-size':'25px' }"
            :title="{ position: 'bottom' }"
          >
            <template #title>
          <span style="font-size: 20px;color: #3ac295">{{ $t('governance.quality.report.numberOfFailedExecutions')
            }}</span>
            </template>
            <template #suffix>
              <span style="font-size: 15px">{{ $t('governance.quality.report.order') }}</span>
            </template>
          </tiny-statistic>
        </div>
        <div class="div-statistic">
          <tiny-statistic
            :value="statistic?.totalNumberOfBusinessFailures"
            :value-style="{ 'color': '#eb1212', 'font-size':'25px' }"
            :title="{ position: 'bottom' }"
          >
            <template #title>
          <span style="font-size: 20px;color: #3ac295">{{ $t('governance.quality.report.totalNumberOfBusinessFailures')
            }}</span>
            </template>
            <template #suffix>
              <span style="font-size: 15px">{{ $t('assets.asset.statistic.number') }}</span>
            </template>
          </tiny-statistic>
        </div>
      </div>
      <div>
        <ChartLine :data="chartData" />
      </div>
      <tiny-collapse class="demo-collapse-wrap" v-model="activeNames" accordion :before-close="beforeClose">
        <tiny-collapse-item name="uniqueness">
          <template #icon>
            <tiny-icon-delta-right></tiny-icon-delta-right>
          </template>
          <template #title>
            <div>
              <tiny-radio v-model="radioValue" @change="radioChange" label="uniqueness">
                {{ $t('governance.quality.uniqueness.detection') }}
              </tiny-radio>
              <tiny-radio v-model="radioValue" @change="radioChange" label="integrity">
                {{ $t('governance.quality.integrity.testing') }}
              </tiny-radio>
              <tiny-radio v-model="radioValue" @change="radioChange" label="standard">
                {{ $t('governance.quality.standard.testing') }}
              </tiny-radio>
              <tiny-radio v-model="radioValue" @change="radioChange" label="custom">
                {{ $t('governance.quality.custom.detection') }}
              </tiny-radio>
            </div>
          </template>
          <template #title-right>
            <div class="badge-toolbar">
              <tiny-badge :value="numberOfSuccessfulExecutions" :max="99"
                          :title="$t('governance.quality.report.numberOfSuccessfulExecutions')" type="success" />
              <tiny-badge :value="numberOfFailedExecutions" :max="99"
                          :title="$t('governance.quality.report.numberOfFailedExecutions')" type="danger" />
              <tiny-badge :value="totalNumberOfBusinessFailures" :max="99"
                          :title="$t('governance.quality.report.totalNumberOfBusinessFailures')" type="warning" />
            </div>
          </template>
          <template #default>
            <tiny-grid :data="dataQualityGrid" :fit="true" size="medium" auto-resize border :stripe="true"
                       highlight-hover-row show-header-overflow="tooltip" show-overflow="tooltip">
              <tiny-grid-column field="name" :title="$t('governance.quality.config.field.name')"></tiny-grid-column>
              <tiny-grid-column field="numberOfSuccessfulExecutions"
                                :title="$t('governance.quality.report.numberOfSuccessfulExecutions')">
                <template v-slot="data">
                  <a @click="openSchedulerTrigger(data.row, 3)">
                    {{ data.row.numberOfSuccessfulExecutions }}
                  </a>
                </template>
              </tiny-grid-column>
              <tiny-grid-column field="numberOfFailedExecutions"
                                :title="$t('governance.quality.report.numberOfFailedExecutions')">
                <template v-slot="data">
                  <a @click="openSchedulerTrigger(data.row, 2)">
                    {{ data.row.numberOfFailedExecutions }}
                  </a>
                </template>
              </tiny-grid-column>
              <tiny-grid-column field="totalNumberOfBusinessFailures"
                                :title="$t('governance.quality.report.totalNumberOfBusinessFailures')">
                <template v-slot="data">
                  <a @click="openSchedulerTrigger(data.row, 3)">
                    {{ data.row.totalNumberOfBusinessFailures }}
                  </a>
                </template>
              </tiny-grid-column>
            </tiny-grid>
          </template>

        </tiny-collapse-item>
      </tiny-collapse>
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
              <SchedulerTrigger :job-id="jobId" :show-toolbar="false" :execute-status="executeStatus"
                                :execute-date-info="executeDate" />
            </suspense>
          </div>
        </tiny-drawer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { addTimeToDate } from '@/utils/date'
import { DataQualityConfigService } from '@/services/governance/quality-config'
import { isEmpty } from 'lodash-es'
import ChartLine from '@/views/components/chart/chart-line.vue'
import SchedulerTrigger from '@/views/scheduler/trigger/index.vue'

const { t } = useI18n()
const nowDate = new Date()
const executeDate = ref(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0))
const statistic = ref<any>()
const chartData = ref<any[]>()

const dataQualityGrid = ref()
const numberOfSuccessfulExecutions = ref(0)
const numberOfFailedExecutions = ref(0)
const totalNumberOfBusinessFailures = ref(0)
const activeNames = ref(['uniqueness'])
const radioValue = ref('uniqueness')


const setGridValue = (data: any[]) => {
  let numberOfSuccessful = 0
  let numberOfFailed = 0
  let totalNumber = 0
  data.forEach((value: any) => {
    numberOfSuccessful += value.numberOfSuccessfulExecutions
    numberOfFailed += value.numberOfFailedExecutions
    totalNumber += value.totalNumberOfBusinessFailures
  })
  numberOfSuccessfulExecutions.value = numberOfSuccessful
  numberOfFailedExecutions.value = numberOfFailed
  totalNumberOfBusinessFailures.value = totalNumber
  dataQualityGrid.value = data
}
const radioChange = (value: any) => {
  if (value === 'uniqueness' && !isEmpty(statistic.value.maps.uniqueness)) {
    setGridValue(statistic.value.maps.uniqueness)
  } else if (value === 'integrity' && !isEmpty(statistic.value.maps.integrity)) {
    setGridValue(statistic.value.maps.integrity)
  } else if (value === 'standard' && !isEmpty(statistic.value.maps.standard)) {
    setGridValue(statistic.value.maps.standard)
  } else if (value === 'custom' && !isEmpty(statistic.value.maps.custom)) {
    setGridValue(statistic.value.maps.custom)
  } else {
    setGridValue([])
  }
}

const getChartDataValue = (key: any, data: any[]) => {
  let obj = {} as any
  obj['key'] = key
  let numberOfSuccessfulExecutions = 0
  let numberOfFailedExecutions = 0
  let totalNumberOfBusinessFailures = 0
  data.forEach((value: any) => {
    numberOfSuccessfulExecutions += value.numberOfSuccessfulExecutions
    numberOfFailedExecutions += value.numberOfFailedExecutions
    totalNumberOfBusinessFailures += value.totalNumberOfBusinessFailures
  })
  obj[t('governance.quality.report.numberOfSuccessfulExecutions')] = numberOfSuccessfulExecutions
  obj[t('governance.quality.report.numberOfFailedExecutions')] = numberOfFailedExecutions
  obj[t('governance.quality.report.totalNumberOfBusinessFailures')] = totalNumberOfBusinessFailures
  return obj
}

const setChartData = () => {
  let data = [] as any[]
  data.push(getChartDataValue(t('governance.quality.uniqueness.detection'),
    isEmpty(statistic.value.maps.uniqueness) ? [] : statistic.value.maps.uniqueness))

  data.push(getChartDataValue(t('governance.quality.integrity.testing'),
    isEmpty(statistic.value.maps.integrity) ? [] : statistic.value.maps.integrity))

  data.push(getChartDataValue(t('governance.quality.standard.testing'),
    isEmpty(statistic.value.maps.standard) ? [] : statistic.value.maps.standard))

  data.push(getChartDataValue(t('governance.quality.custom.detection'),
    isEmpty(statistic.value.maps.custom) ? [] : statistic.value.maps.custom))
  chartData.value = data
}
const search = () => {
  let endTime = addTimeToDate(executeDate.value, 23, 59, 59)
  DataQualityConfigService.getStatistic({
    begTime: executeDate.value,
    endTime: endTime
  }).then(result => {
    statistic.value = result
    setChartData()
    radioChange(radioValue.value)
  })
}

const beforeClose = () => {
  return false
}

const schedulerTriggerDrawer = ref(false)
const jobId = ref(0)
const executeStatus = ref()
const openSchedulerTrigger = (row: any, status: any) => {
  jobId.value = row.jobId
  executeStatus.value = status
  schedulerTriggerDrawer.value = true
}

onMounted(() => {
  search()
})
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
}

.div-cls {
  display: flex;
  width: 100%;

  :deep(.tiny-statistic) {
    --ti-statistic-font-size: var(--ti-common-font-size-base);
    --ti-statistic-suffix-font-size: var(--ti-common-font-size-base);
    --ti-statistic-title-font-size: var(--ti-common-font-size-6);
    --ti-statistic-description-margin-left: var(--ti-common-space-4x);
    --ti-statistic-font-color: var(--ti-common-color-info-text);
    --ti-statistic-title-font-weight: var(--ti-common-font-weight-4);
    --ti-statistic-title-margin-top: var(--ti-common-space-5x);
    --ti-statistic-description-margin-top: 0px;
    --ti-statistic-description-margin-bottom: 0px;
    --ti-statistic-title-margin-bottom: var(--ti-common-space-5x);
    --ti-statistic-title-line-height: var(ti-common-line-height-4);
    --ti-statistic-font-weight: var(--ti-common-font-weight-5);
    --ti-statistic-prefix-margin-right: var(--ti-common-space-6);
    --ti-statistic-prefix-font-weight: var(--ti-common-font-weight-5);
    --ti-statistic-suffix-margin-left: var(--ti-common-space-6);
    --ti-statistic-suffix-font-weight: var(--ti-common-font-weight-5);
    --ti-statistic-description-font-size: var(--ti-common-font-size-6);
    width: 100%;
  }
}

.div-statistic {
  width: 25%;
  text-align: center;

  :deep(.tiny-statistic__slots) {
    font-weight: var(--ti-statistic-font-weight);
    font-size: var(--ti-statistic-title-font-size);
    color: var(--ti-statistic-font-color);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
    margin-left: 43%;
  }
}

.grid-toolbar {
  margin: 12px 0;
  display: flex;
  float: right;
}

.badge-toolbar {
  display: flex;

  :deep(.tiny-badge__wrapper) {
    --ti-badge-size: var(--ti-common-size-5x, 20px);
    --ti-badge-font-size: var(--ti-common-font-size-base, 12px);
    --ti-badge-font-weight: var(--ti-common-font-weight-7, bold);
    --ti-badge-border-radius: 12px;
    --ti-badge-text-color: var(--ti-common-color-light, #fff);
    --ti-badge-bg-color: var(--ti-base-color-error-3, #f66f6a);
    --ti-badge-link-hover-text-color: var(--ti-common-color-light, #fff);
    --ti-badge-active-text-color: var(--ti-base-color-brand-6, #5e7ce0);
    --ti-badge-active-bg-color: var(--ti-common-color-light, #fff);
    --ti-badge-primary-bg-color: var(--ti-base-color-brand-6, #5e7ce0);
    --ti-badge-success-bg-color: var(--ti-common-color-success-normal, #50d4ab);
    --ti-badge-warning-bg-color: var(--ti-common-color-warning-normal, #fa9841);
    --ti-badge-danger-bg-color: var(--ti-base-color-error-3, #f66f6a);
    --ti-badge-info-bg-color: var(--ti-common-color-info-normal, #252b3a);
    margin-left: 8px;
  }
}
</style>

