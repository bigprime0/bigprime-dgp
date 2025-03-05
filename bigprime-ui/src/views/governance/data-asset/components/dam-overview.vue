<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dam', 'menu.dg.dg-dam.dg-dam-overview']" />
    <div class="contain">
      <div class="grid-toolbar">
        <tiny-date-picker type="year"
                          size="mini"
                          align="right"
                          v-model="dateSearch"
                          @change="dateSearchChange"
                          :clearable="true"
                          :editable="false"
                          :placeholder="$t('assets.asset.statistic.year')"
                          style="margin-left: 20px; float: right"
        >
        </tiny-date-picker>
      </div>
      <div class="div-cls">
        <div class="div-statistic">
          <tiny-statistic
            :value="statistic?.dataSourceUnit"
            :value-style="{'color': '#eb1212', 'font-size': '25px'}"
            :title="{ position: 'bottom' }"
          >
            <template #title>
              <span style="font-size: 20px;color: #3ac295">{{ $t('assets.asset.statistic.dataSourceUnit') }}</span>
            </template>
            <template #suffix>
              <span style="font-size: 15px">{{ $t('assets.asset.statistic.number' )}}</span>
            </template>
          </tiny-statistic>
        </div>
        <div class="div-statistic">
          <tiny-statistic
            :value="statistic?.dataAssetCategories"
            :value-style="{ 'color': '#eb1212', 'font-size':'25px' }"
            :title="{ position: 'bottom' }"
          >
            <template #title>
              <span style="font-size: 20px;color: #3ac295">{{ $t('assets.asset.statistic.dataAssetCategories' )}}</span>
            </template>
            <template #suffix>
              <span style="font-size: 15px">{{ $t('assets.asset.statistic.classify' )}}</span>
            </template>
          </tiny-statistic>
        </div>
        <div class="div-statistic">
          <tiny-statistic
            :value="statistic?.subclassOfDataAssets"
            :value-style="{ 'color': '#eb1212', 'font-size':'25px' }"
            :title="{ position: 'bottom' }"
          >
            <template #title>
              <span style="font-size: 20px;color: #3ac295">{{ $t('assets.asset.statistic.subclassOfDataAssets' )}}</span>
            </template>
            <template #suffix>
              <span style="font-size: 15px">{{ $t('assets.asset.statistic.classify' )}}</span>
            </template>
          </tiny-statistic>
        </div>
        <div class="div-statistic">
          <tiny-statistic
            :value="statistic?.dataItem"
            :value-style="{ 'color': '#eb1212', 'font-size':'25px' }"
            :title="{ position: 'bottom' }"
          >
            <template #title>
              <span style="font-size: 20px;color: #3ac295">{{ $t('assets.asset.statistic.dataItem' )}}</span>
            </template>
            <template #suffix>
              <span style="font-size: 15px">{{ $t('assets.asset.statistic.number' )}}</span>
            </template>
          </tiny-statistic>
        </div>
        <div class="div-statistic">
          <tiny-statistic
            :value="statistic?.numberOfRecords"
            :value-style="{ 'color': '#eb1212', 'font-size':'25px' }"
            :title="{ position: 'bottom' }"
          >
            <template #title>
              <span style="font-size: 20px;color: #3ac295">{{ $t('assets.asset.statistic.numberOfRecords' )}}</span>
            </template>
            <template #suffix>
              <span style="font-size: 15px">{{ $t('assets.asset.statistic.number' )}}</span>
            </template>
          </tiny-statistic>
        </div>
      </div>
      <div>
        <ChartLine :data="monthOptions" :title="$t('assets.asset.statistic.trendsInDataAssetChanges')" />
      </div>
      <div style="margin: 10px 0 0 0;display: flex">
        <ChartPie :data="provideDepOptions" :title="$t('assets.asset.statistic.distributionOfDataAssetContributions')" style="width: 50%" />
        <ChartHistogram :data="useDepOptions" :title="$t('assets.asset.statistic.distributionOfDataAssetUsage')" style="width: 50%" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { find, isEmpty } from 'lodash-es'
import { DataAssetsService, type DataAssetsStatisticParam } from '@/services/assets/asset'
import { getDateYear } from '@/utils/date'
import ChartPie from '@/views/components/chart/chart-pie.vue'
import ChartLine from '@/views/components/chart/chart-line.vue'
import ChartHistogram from '@/views/components/chart/chart-histogram.vue'


const { t } = useI18n()
const dateSearch = ref(new Date())
const statistic = ref<DataAssetsStatisticParam>()
const dateSearchChange = (value: any) => {
  let year = 0
  if (value !== null) {
    year = getDateYear(value)
  }
  DataAssetsService.getStatistic(year).then(result => {
    statistic.value = result
    setMonthOptions(year, result.trendsInDataAssetChanges)
    setProvideDepOptions(result.distributionOfDataAssetContributions)
    setUseDepOptions(result.distributionOfDataAssetUsage)
  })
}

const monthOptions = ref<any[]>()
const setMonthOptions = (year: number, result: any[]) => {
  let add = t('common.operations.add')
  let data = [] as any[]

  if (year === 0) {
    ['common.January', 'common.February', 'common.March', 'common.April', 'common.May', 'common.June', 'common.July', 'common.August', 'common.September', 'common.October', 'common.November', 'common.December'].forEach(value => {
      data.push({
        key: t(value)
      })
    })
  } else {
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach((value: any) => {
      data.push({
        key: year + '-' + value
      })
    })
  }

  data.forEach((value: any) => {
    let info = {} as any
    if (year === 0) {
      if (value['key'] === t('common.January')) {
        info = find(result, { key: '1' })
      } else if (value['key'] === t('common.February')) {
        info = find(result, { key: '2' })
      } else if (value['key'] === t('common.March')) {
        info = find(result, { key: '3' })
      } else if (value['key'] === t('common.April')) {
        info = find(result, { key: '4' })
      } else if (value['key'] === t('common.May')) {
        info = find(result, { key: '5' })
      } else if (value['key'] === t('common.June')) {
        info = find(result, { key: '6' })
      } else if (value['key'] === t('common.July')) {
        info = find(result, { key: '7' })
      } else if (value['key'] === t('common.August')) {
        info = find(result, { key: '8' })
      } else if (value['key'] === t('common.September')) {
        info = find(result, { key: '9' })
      } else if (value['key'] === t('common.October')) {
        info = find(result, { key: '10' })
      } else if (value['key'] === t('common.November')) {
        info = find(result, { key: '11' })
      } else if (value['key'] === t('common.December')) {
        info = find(result, { key: '12' })
      }
    } else {
      info = find(result, { key: value['key'] })
    }
    if (isEmpty(info)) {
      value[add] = 0
    } else {
      value[add] = info.value
    }
  })

  monthOptions.value = data
}

const provideDepOptions = ref<any[]>()
const setProvideDepOptions = (result : any[]) => {
  let data = [] as any[]
  result.forEach((value: any) => {
    if(value['value'] > 0){
      data.push({
        name: value['key'],
        value: value['value']
      })
    }
  })
  provideDepOptions.value = data
}

const useDepOptions = ref<any[]>()
const setUseDepOptions = (result : any[]) => {
  let data = [] as any[]
  result.forEach((value: any) => {
    if(value['value'] > 0 || value['value1'] > 0){
      let obj = {} as any
      obj['name'] = value['key']
      obj[t('assets.asset.statistic.DownloadQuantity')] = value['value']
      obj[t('assets.asset.statistic.SearchVolume')] = value['value1']
      data.push(obj)
    }
  })
  useDepOptions.value = data
}

onMounted(async () => {
  dateSearchChange(new Date())
})

</script>
<style scoped lang="less">
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
  width: 20%;
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
  height: calc(75vh - 100px);
  overflow-x: hidden;
  overflow-y: auto;
}


.grid-toolbar {
  margin: 12px 0;
  display: flex;
  float: right;
}
</style>

