<template>
  <div class="container-list">
    <Breadcrumb v-if="!isEmpty(breadcrumb)" :items="breadcrumb" />
    <div class="contain">
      <div class="grid-toolbar">
        <tiny-search @search="search" @clear="search" @change="search" v-model="searchValue"
                     :placeholder="$t('common.search.placeholder')"
                     is-enter-search clearable></tiny-search>

        <tiny-button type="primary" @click="openFlinkConfigForm(null, 'add')">{{ $t('common.operations.add') }}
        </tiny-button>
      </div>
      <div class="card-wrap" v-for="item in flinkConfigList" :key="item.id">
        <tiny-card size="mini">
          <template #title-left>
          </template>
          <template #title>
            <tiny-link class="list-link" type="success" :underline="false"
                       :value="item.flinkVersion" />
          </template>
          <template #default>
            <tiny-layout cols="3">
              <tiny-row>
                <tiny-col :span="1">
                  <tiny-user-head type="label"
                                  v-model="item.name"
                                  background-color="#a4d9c6"
                                  class="source" round />
                </tiny-col>

                <tiny-col :span="2" class="source-text">
                  <tiny-popover trigger="hover" placement="bottom"
                                popper-class="popover-cls"
                                :title="item.name">
                    <span class="span-font">{{ item.summary }}</span>
                    <template #reference>
                      <tiny-link type="primary" :underline="false"
                                 :value="item.name" />
                    </template>
                  </tiny-popover>
                </tiny-col>
              </tiny-row>
            </tiny-layout>
          </template>
          <template #footer>
            <tiny-button v-if="item.active" type="success" :icon="iconHeartempty()" size="mini" circle
                         v-loading.lock.fullscreen="saveLoading"
                         tiny-loading__background="rgba(0, 0, 0, 0.08)"
                         tiny-loading__size="large"
                         @click="handleTest(item)"
                         :title="$t('datasource.active.success')" />
            <tiny-button v-else type="danger" :icon="iconHeartempty()" size="mini" circle
                         v-loading.lock.fullscreen="saveLoading"
                         tiny-loading__background="rgba(0, 0, 0, 0.08)"
                         tiny-loading__size="large"
                         @click="handleTest(item)"
                         :title="$t('datasource.active.failed')" />

            <tiny-button type="primary" :icon="iconEdit()" size="mini" circle
                         :title="$t('common.operations.update')"
                         @click="openFlinkConfigForm(item, 'update')" />

            <tiny-button type="warning" :icon="iconDel()" circle size="mini"
                         :title="$t('common.operations.delete')"
                         @click="deleteFlinkConfigData(item.id)" />
          </template>
        </tiny-card>
      </div>
    </div>
  </div>

  <div>
    <tiny-drawer :title="flinkConfigFormTitle"
                 :visible="flinkConfigFormDrawer"
                 @update:visible="flinkConfigFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeFlinkConfigForm(false)">
      <div>
        <suspense>
          <ClusterListForm :flink-config-form-data="flinkConfigFormData" :flink-plugin="flinkPlugin"></ClusterListForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { assign, cloneDeep, isEmpty } from 'lodash-es'
import { Modal } from '@opentiny/vue'
import ClusterListForm from '@/views/development/cluster/cluster-list-form.vue'
import { FlinkConfigService } from '@/services/development/config'
import { iconDel, iconEdit, iconHeartempty } from '@opentiny/vue-icon'


const { t } = useI18n()
const searchValue = ref('')
const flinkConfigList = ref()

const breadcrumb = defineModel('breadcrumb')
const type = defineModel('type')
const flinkConfigFormDrawer = ref(false)
const flinkConfigFormTitle = ref('')
const flinkConfigFormData = ref()
const flinkConfigFormDataCopy = ref()

const flinkPlugin = ref()

const search = async () => {
  flinkConfigList.value = await FlinkConfigService.getList({
    model: {
      name: searchValue.value,
      type: type.value
    }
  })
}
const openFlinkConfigForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    flinkConfigFormTitle.value = t('common.text.add.data')
    flinkConfigFormData.value = { id: 0, configs: [], type: type.value }
  } else {
    flinkConfigFormTitle.value = t('common.text.update.data')
    flinkConfigFormData.value = row
    flinkConfigFormDataCopy.value = cloneDeep(row)
    flinkConfigFormData.value.configs = []
    if (flinkConfigFormData.value.configMap) {
      Object.entries(flinkConfigFormData.value.configMap).forEach(([key, value]) => {
        flinkConfigFormData.value.configs.push({key: key, value: value})
      });
    }
  }
  flinkConfigFormDrawer.value = true
}

const deleteFlinkConfigData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await FlinkConfigService.deleteById(id)
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      await search()
    }
  })
}

const saveLoading = ref(false)
const handleTest = async (data: any) => {
  saveLoading.value = true
  const result = await FlinkConfigService.testConnection(data).catch(error => {
    saveLoading.value = false
  })
  saveLoading.value = false
  if (result) {
    Modal.message({
      message: t('common.prompt.test.success'),
      status: 'success'
    })
  } else {
    Modal.message({
      message: t('common.prompt.test.fail'),
      status: 'error'
    })
  }
  await search()
}

const closeFlinkConfigForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(flinkConfigFormData.value, flinkConfigFormDataCopy.value)
  }
  flinkConfigFormDrawer.value = false
}

emitter.on('closeFlinkConfigForm', (isUp) => {
  closeFlinkConfigForm(isUp)
})

onMounted(async () => {
  flinkPlugin.value = await FlinkConfigService.getPlugin()
  await search()
})
</script>

<style scoped lang="less">
.card-wrap {
  float: left;
  margin: 10px 10px 0 0;

  :deep(.tiny-card.tiny-card--default) {
    border-color: var(--ti-card-default-border-color);
    margin-bottom: 15px;
  }

  :deep(.tiny-card .tiny-card__body .tiny-card--logo .tiny-card--logo__title) {
    display: flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
  }

  :deep(.tiny-card .tiny-card__body .tiny-card--logo .tiny-card--logo__title--p) {
    font-size: var(--ti-card-title-font-size);
    font-weight: var(--ti-card-title-font-weight);
    margin-right: 8px;
    margin-bottom: 1px;
    line-height: 20px;
    //color: hsla(160, 100%, 37%, 1);
  }

  :deep(.tiny-card .tiny-card__footer .tiny-card__footer-footer) {
    padding: 5px 10px 5px 5px;
    border-top: 1px solid #dfdfdf;
    text-align: right;
  }

  :deep(.tiny-button.tiny-button--info) {
    color: var(--ti-button-info-text-color);
    fill: var(--ti-button-info-text-color);
    border-color: #b3a3f8;
    background-color: #b3a3f8;
  }

  :deep(.tiny-button.tiny-button--danger) {
    color: var(--ti-button-info-text-color);
    fill: var(--ti-button-info-text-color);
    /*    border-color: #ed66ab;
        background-color: #ed66ab;*/
  }

  :deep(.tiny-button.tiny-button--primary) {
    color: var(--ti-button-info-text-color);
    fill: var(--ti-button-info-text-color);
    /*    border-color: #52c41a;
        background-color: #52c41a;*/
  }

  :deep(
    .tiny-button.is-disabled,
    .tiny-button.is-disabled:active,
    .tiny-button.is-disabled:focus,
    .tiny-button.is-disabled:hover) {
    color: var(--ti-button-primary-disabled-text-color);
    fill: var(--ti-button-primary-disabled-text-color);
    border-color: var(--ti-button-primary-disabled-border-color);
    background-color: var(--ti-button-primary-disabled-bg-color);
  }
}

.list-link {
  margin-left: 8px;
  font-size: 12px;
}

.span-font {
  font-size: 12px;
  color: #000000;
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
  height: 99%;
  overflow: auto;
}

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

.run-grid-toolbar {
  display: flex;
  justify-content: left;
}

.source {
  margin-top: 10px;
  text-align: center;
}

.source-text {
  margin-top: 15%;
  padding-left: 15%;

  :deep(.tiny-link .tiny-link-svg) {
    margin-right: 3px;
    margin-left: 0px;
  }
}

.div-select-svg {
  float: left;
  width: 0.8em;
  height: 1.2em;
  vertical-align: middle;
  overflow: auto;
  display: inline-block;
  fill: #adb0b8;
}
</style>

<style>
.popover-cls {
}

.popover-cls .tiny-popover__title {
  font-size: 10px !important;
}
</style>
