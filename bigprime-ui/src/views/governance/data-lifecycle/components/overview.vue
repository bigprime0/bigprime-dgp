<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dlc', 'menu.dg.dg-dlc.dg-dlc-overview']" />
    <div class="contain">
      <tiny-tabs v-model="activeName" @click="activeClick">
        <tiny-tab-item :title="$t('lifecycle.overview.tabs.week')" lazy name="week"></tiny-tab-item>
        <tiny-tab-item :title="$t('lifecycle.overview.tabs.month')" lazy name="month"></tiny-tab-item>
        <tiny-tab-item :title="$t('lifecycle.overview.tabs.year')" lazy name="year"></tiny-tab-item>
        <tiny-tab-item :title="$t('lifecycle.overview.tabs.all')" lazy name="all"></tiny-tab-item>
      </tiny-tabs>
      <div class="div-card">
        <tiny-card class="card">
          <template #title>
            <tiny-link class="card-title" :underline="false">{{ t('lifecycle.overview.statistic.synchro') }}
            </tiny-link>
          </template>
          <template #default>
            <tiny-layout cols="2">
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">{{ statistics.synchro.size }} GB</tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">
                    {{ statistics.synchro.rows >= 100000 ? statistics.synchro.rows / 10000 : statistics.synchro.rows }}
                    {{ statistics.synchro.rows >= 100000 ? t('lifecycle.overview.statistic.ten.thousand.rows') : t('lifecycle.overview.statistic.row')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.data.volume')
                    }}
                  </tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.record.rows')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
            </tiny-layout>
          </template>
        </tiny-card>
        <tiny-card class="card">
          <template #title>
            <tiny-link class="card-title" :underline="false">{{ t('lifecycle.overview.statistic.online.storage') }}
            </tiny-link>
          </template>
          <template #default>
            <tiny-layout cols="2">
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">{{ statistics.online.size }} GB</tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">
                    {{ statistics.online.rows >= 100000 ? statistics.online.rows / 10000 : statistics.online.rows }}
                    {{ statistics.online.rows >= 100000 ? t('lifecycle.overview.statistic.ten.thousand.rows') : t('lifecycle.overview.statistic.row')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.data.volume')
                    }}
                  </tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.record.rows')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
            </tiny-layout>
          </template>
        </tiny-card>
        <tiny-card class="card">
          <template #title>
            <tiny-link class="card-title" :underline="false">{{ t('lifecycle.overview.statistic.near.line.storage') }}
            </tiny-link>
          </template>
          <template #default>
            <tiny-layout cols="2">
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">{{ statistics.nearline.size }} GB</tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">
                    {{ statistics.nearline.rows >= 100000 ? statistics.nearline.rows / 10000 : statistics.nearline.rows
                    }}
                    {{ statistics.nearline.rows >= 100000 ? t('lifecycle.overview.statistic.ten.thousand.rows') : t('lifecycle.overview.statistic.row')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.data.volume')
                    }}
                  </tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.record.rows')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
            </tiny-layout>
          </template>
        </tiny-card>
        <tiny-card class="card">
          <template #title>
            <tiny-link class="card-title" :underline="false">{{ t('lifecycle.overview.statistic.offline.storage') }}
            </tiny-link>
          </template>
          <template #default>
            <tiny-layout cols="2">
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">{{ statistics.offline.size }} GB</tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">
                    {{ statistics.offline.rows >= 100000 ? statistics.offline.rows / 10000 : statistics.offline.rows }}
                    {{ statistics.offline.rows >= 100000 ? t('lifecycle.overview.statistic.ten.thousand.rows') : t('lifecycle.overview.statistic.row')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.data.volume')
                    }}
                  </tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.record.rows')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
            </tiny-layout>
          </template>
        </tiny-card>
        <tiny-card class="card">
          <template #title>
            <tiny-link class="card-title" :underline="false">{{ t('lifecycle.overview.statistic.destruction') }}
            </tiny-link>
          </template>
          <template #default>
            <tiny-layout cols="2">
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">{{ statistics.destruction.size }} GB</tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-value" :underline="false">
                    {{ statistics.destruction.rows >= 100000 ? statistics.destruction.rows / 10000 : statistics.destruction.rows
                    }}
                    {{ statistics.destruction.rows >= 100000 ? t('lifecycle.overview.statistic.ten.thousand.rows') : t('lifecycle.overview.statistic.row')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
              <tiny-row class="card-row">
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.data.volume')
                    }}
                  </tiny-link>
                </tiny-col>
                <tiny-col :span="1">
                  <tiny-link class="card-col-label" :underline="false">{{ t('lifecycle.overview.statistic.record.rows')
                    }}
                  </tiny-link>
                </tiny-col>
              </tiny-row>
            </tiny-layout>
          </template>
        </tiny-card>
      </div>

      <div>
        <ChartLine :data="warehouseData" :title="$t('lifecycle.overview.statistic.warehouse')" />
      </div>
      <div style="margin: 10px 0 0 0;display: flex">
        <ChartPie :data="sourceData" :title="$t('lifecycle.overview.statistic.source')"
                  style="width: 50%">
          <template #default>
            <tiny-radio v-model="radioPie" :label=1>
              {{ $t('lifecycle.overview.statistic.data.volume') }}
            </tiny-radio>
            <tiny-radio v-model="radioPie" :label=2>
              {{ $t('lifecycle.overview.statistic.record.rows') }}
            </tiny-radio>
          </template>
        </ChartPie>
        <ChartHistogram :data="archiveData" :title="$t('lifecycle.overview.statistic.archive')"
                        style="width: 50%" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ChartPie from '@/views/components/chart/chart-pie.vue'
import ChartLine from '@/views/components/chart/chart-line.vue'
import ChartHistogram from '@/views/components/chart/chart-histogram.vue'
import { DataLifeCycleTaskService } from '@/services/lifecycle/life-cycle-task'
import { groupBy, reduce, sumBy } from 'lodash-es'


const { t } = useI18n()
const radioPie = ref(1)
const activeName = ref('week')
const warehouseData = ref()
const sourceData = ref()
const archiveData = ref()
const dateType = ref(1)
const allData = ref()


const mapping: Record<string, string> = {
  '1': 'nearline',
  '2': 'offline',
  '3': 'destruction',
  '4': 'synchro',
  '5': 'online'
}

const statistics = ref({
  nearline: { size: 0, rows: 0 },
  offline: { size: 0, rows: 0 },
  destruction: { size: 0, rows: 0 },
  online: { size: 0, rows: 0 },
  synchro: { size: 0, rows: 0 }
})
const getStatisticData = (data: any) => {
  const grouped = groupBy(data, 'type')
  const statistic: any = reduce(grouped, (result, group, key) => {
    const newKey = mapping[key] || key
    result[newKey] = {
      size: sumBy(group, 'size'),
      rows: sumBy(group, 'rows')
    }
    return result
  }, {})

  let dataHolders = {
    nearline: { size: 0, rows: 0 },
    offline: { size: 0, rows: 0 },
    destruction: { size: 0, rows: 0 },
    online: { size: 0, rows: 0 },
    synchro: { size: 0, rows: 0 }
  }

  for (const [key] of Object.entries(dataHolders)) {
    if (statistic[key]) {
      dataHolders[key].size = statistic[key].size
      dataHolders[key].rows = statistic[key].rows
    }
  }
  statistics.value = dataHolders
}


const getChartStatistic = (data: any, keyField: string, applyValues: string [], applyKeys: {}) => {
  const result: any = []
  const grouped = groupBy(data, keyField)
  const length = applyValues.length
  for (const [key, value] of Object.entries(grouped)) {
    if (applyValues.includes(key) || length === 0) {
      applyValues = applyValues.filter(f => f !== key)

      let object: any = {}
      if (key in applyKeys) {
        object[keyField] = t(applyKeys[key])
      } else {
        object[keyField] = key
      }


      object[t('lifecycle.overview.statistic.data.volume')] = sumBy(value, 'size').toFixed(2)
      object[t('lifecycle.overview.statistic.record.rows')] = sumBy(value, 'rows').toFixed(0)
      result.push(object)
    }
  }


  for (const [apply] of Object.entries(applyValues)) {
    let object: any = {}

    if (applyValues[apply] in applyKeys) {
      object[keyField] = t(applyKeys[applyValues[apply]])
    } else {
      object[keyField] = applyValues[apply]
    }

    object[t('lifecycle.overview.statistic.data.volume')] = 0
    object[t('lifecycle.overview.statistic.record.rows')] = 0
    result.push(object)
  }
  return result
}

const getPieChartStatistic = (data: any, keyField: string, statisticField: string) => {
  const result: any = []
  const grouped = groupBy(data, keyField)
  for (const [key, value] of Object.entries(grouped)) {
    let object: any = {
      name: key,
      value: sumBy(value, statisticField)
    }
    result.push(object)
  }
  return result
}

const checkPie = () => {
  sourceData.value = getPieChartStatistic(allData.value, 'sourceName', radioPie.value === 1 ? 'size' : 'rows')
}

const search = async () => {
  let result: any = await DataLifeCycleTaskService.getStatistic({
    dateType: dateType.value
  })
  allData.value = result
  getStatisticData(result)
  warehouseData.value = getChartStatistic(result, 'warehouseLocation', ['ODS', 'DIM', 'DWD', 'DWS', 'ADS'], {})
  archiveData.value = getChartStatistic(result, 'type', ['1', '2', '3'], {
    '1': 'lifecycle.overview.statistic.near.line.storage',
    '2': 'lifecycle.overview.statistic.offline.storage',
    '3': 'lifecycle.overview.statistic.destruction'
  })
  checkPie()
}

const activeClick = (tabs: any) => {
  switch (tabs.name) {
    case 'week':
      dateType.value = 1
      break
    case 'month':
      dateType.value = 2
      break
    case 'year':
      dateType.value = 3
      break
    default:
      dateType.value = 0
      break
  }
  search()
}


onMounted(() => {
  search()
})

watch(radioPie, () => {
  checkPie()
})

</script>
<style scoped lang="less">

.div-card {
  display: flex;
  width: 100%;
  text-align: center;
  margin: 0 0 20px 10px;


  .card {
    width: 20%;
    height: 150px;
    margin-right: 10px;
  }

  .card-title {
    font-size: 15px;
    color: #3ac295;
  }

  .card-row {
    margin-top: 20px;
    text-align: left;
    padding-left: 0px;
  }

  .card-col-value {
    font-size: 16px;
    color: red;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-col-label {
    font-size: 18px;
    //color: #002FA7;
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

</style>

