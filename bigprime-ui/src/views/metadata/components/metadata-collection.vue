<template>
  <div
    class="collection-form"
    v-loading="isLoading"
    :tiny-loading__text="$t('metadata.collect.loading.text')"
  >
    <tiny-form
      :ref="collectionFormRef"
      overflow-title
      :model="collectionFormData"
      :rules="formRules"
      label-width="150px"
    >
      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('metadata.collect.sourceType')">
            <tiny-select v-model="collectionFormData.sourceType">
              <tiny-option
                v-for="item in collectionTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('metadata.collect.source')">
            <tiny-select v-model="collectionFormData.sourceId" @change="Method.handleSourceChange">
              <tiny-option
                v-for="item in sourceData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('metadata.collect.mode')">
            <tiny-radio-group v-model="collectionFormData.collectionMode">
              <tiny-radio label="manual">手工采集</tiny-radio>
              <tiny-radio label="timing" disabled>定时采集</tiny-radio>
            </tiny-radio-group>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row v-if="collectionFormData.collectionMode == 'timing'">
        <tiny-col :span="12">
          <tiny-form-item :label="$t('metadata.collect.frequency')">
            <tiny-input v-model="collectionFormData.frequency">
              <template #append>
                <tiny-button :reset-time="500" type="primary" @click="Method.openCron">
                  Cron
                </tiny-button>
              </template>
            </tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('metadata.collect.area')">
            <tiny-radio-group
              v-model="collectionFormData.collectionArea"
              @change="Method.handleAreaChange"
            >
              <tiny-radio label="all">全部范围</tiny-radio>
              <tiny-radio label="custom" disabled>自定义选择</tiny-radio>
            </tiny-radio-group>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row v-if="collectionFormData.collectionArea == 'custom'">
        <tiny-col :span="12">
          <tiny-form-item>
            <tiny-transfer
              ref="transferRef"
              :titles="['采集范围列表', '已采集范围']"
              v-model="collectionFormData.sourceData"
              :data="areaData"
              filterable
              :filter-method="Method.filterAreaMethod"
              :drop-config="dropConfig"
            ></tiny-transfer>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-divider content-position="left" content-color="#7693f5"></tiny-divider>
      <tiny-form-item style="text-align: center">
        <tiny-button plain type="primary" @click="Method.handleCancel">
          {{ $t('common.operations.cancel') }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="Method.handleCollection">
          {{ $t('common.operations.collection') }}
        </tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
  <tiny-drawer
    title="cron"
    :visible="cronDrawer"
    @update:visible="cronDrawer = $event"
    :show-header="true"
    :mask-closable="false"
    width="50%"
    @close="cronDrawer = false"
  >
    <div>
      <Cron :cronExpression="cronExpression" />
    </div>
  </tiny-drawer>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { SourceService } from '@/services/spi/source'
import Sortable from 'sortablejs'
import { MetadataService } from '@/services/metadata/metadata'
import { Modal } from '@opentiny/vue'

const isLoading = ref(false)
const Cron = defineAsyncComponent(() => import('@/components/cron/index.vue'))
const cronDrawer = ref(false)
const cronExpression = ref()
const { t } = useI18n()
const collectionFormRef = ref()
const collectionFormData = ref({
  sourceId: '',
  sourceName: '',
  sourceType: 'JDBC',
  collectionMode: 'manual',
  frequency: '',
  collectionArea: 'all',
  sourceData: ''
})
const collectionTypeOptions = ref([{ label: 'JDBC采集器', value: 'JDBC', en: 'JDBC Collect' }])
const sourceData = ref<any[]>([])
const formRules = computed(() => {
  return {
    sourceId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
})
const areaData = ref([])
const dropConfig = ref({
  plugin: Sortable
})
emitter.on('closeCron', (cronValue: any) => {
  collectionFormData.value.frequency = cronValue
  cronDrawer.value = false
})

onMounted(() => {
  if (collectionFormData.value.sourceType == 'JDBC') {
    Method.queryDatasource()
  }
})

const Method = {
  openCron: () => {
    cronExpression.value = collectionFormData.value.frequency
    cronDrawer.value = true
  },

  filterAreaMethod: (query, item) => {
    return item.pinyin.includes(query)
  },

  queryDatasource: async () => {
    sourceData.value = await SourceService.getList({
      search: '',
      config: true
    })
  },

  handleSourceChange: async () => {
    if (!sourceData.value) {
      await Method.queryDatasource()
    }
  },

  handleAreaChange: async () => {},

  handleCancel: () => {
    emitter.emit('drawerCancel')
  },

  handleCollection: async () => {
    isLoading.value = true
    let find = sourceData.value.filter((w) => w.id == collectionFormData.value.sourceId)
    if (find) collectionFormData.value.sourceName = find[0].name
    let ret = await MetadataService.collect(collectionFormData.value)
    if (ret != -1) {
      Modal.message({
        message: t('common.prompt.collect.success'),
        status: 'success'
      })
      emitter.emit('getTree')
      isLoading.value = false
    } else {
      Modal.message({
        message: t('common.prompt.collect.fail'),
        status: 'error'
      })
      isLoading.value = false
    }
  }
}
</script>
<style scoped lang="less">
.span-font {
  font-size: 12px;
  color: #000000;
}

.collection-form {
  padding: 10px;

  :deep(.container-form) {
    margin-top: 0;
    padding: 20px 15px 15px 15px;
    border-radius: 0;
    box-shadow: 0 0 2px 2px #eee;
    height: calc(100vh - 130px);
  }
}
</style>
