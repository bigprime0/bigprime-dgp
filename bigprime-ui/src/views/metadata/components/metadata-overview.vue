<template>
  <div class="container-list">
    <Breadcrumb
      :items="['menu.dg', 'menu.dg.dg-metadata', 'menu.dg.dg-metadata.dg-metadata-overview']"
    />
    <div class="contain">
      <div class="div-cls">
        <div class="div-statistic">
          <tiny-statistic
            v-for="item in statistic"
            :key="item.key"
            :value="item.value"
            :value-style="{ color: '#eb1212', 'font-size': '25px' }"
            :title="{ position: 'bottom' }"
          >
            <template #title>
              <span style="font-size: 20px; color: #3ac295">{{ item.name }}</span>
            </template>
            <!--            <template #suffix>-->
            <!--              <span style="font-size: 15px">{{ item.value }}</span>-->
            <!--            </template>-->
          </tiny-statistic>
        </div>
      </div>
      <div>
        <ChartLine
          loading
          v-for="(item, index) in lineDatas"
          height="300px"
          :key="index"
          :data="item.value"
          :title="item.name"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type metadataAnalyseModel, MetadataService } from '@/services/metadata/metadata'
import { forIn, sortBy } from 'lodash-es'
import ChartLine from '@/views/components/chart/chart-line.vue'
import getMetadataAnalyse = MetadataService.getMetadataAnalyse

const { t } = useI18n()
const statistic = ref<metadataAnalyseModel[]>()
const lineDatas = ref<metadataAnalyseModel[]>()
//const lineOptions = ref<any[]>([])
onMounted(() => {
  getAnalyseData()
})
const getAnalyseData = async () => {
  let resp = await getMetadataAnalyse()
  if (resp) {
    statistic.value = resp.filter((w: metadataAnalyseModel) => w.type == 'Number')
    lineDatas.value = resp.filter((w: metadataAnalyseModel) => w.type.endsWith('Chart'))
    if (lineDatas.value && lineDatas.value.length > 0) {
      lineDatas.value.forEach((item: metadataAnalyseModel) => {
        const options = [] as any[]
        forIn(item.value, (value: string, key: any) => {
          options.push({ key: key, value: value })
        })
        item.value = sortBy(options, 'key')
      })
    }
  }
}
</script>
<style scoped lang="less">
.div-cls {
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
  display: flex;
  justify-content: space-between;
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
