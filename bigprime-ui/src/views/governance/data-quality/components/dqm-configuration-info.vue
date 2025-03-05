<template>
  <div class="container-list">
    <Breadcrumb :class="changeType.type === '' ? 'svg-dir': 'svg-file'" :items="[changeType.name]" :IconLeft="changeType.type === '' ? IconFolderOpened : IconFiles" />
    <tiny-grid :data="dataQualityConfigList" :fit="true" size="medium" auto-resize border :stripe="true"
               highlight-hover-row max-height="85%" show-header-overflow="tooltip" show-overflow="tooltip">
      <template #toolbar>
        <div class="grid-toolbar">
          <tiny-search @search="search" @clear="search" v-model="searchValue"
                       :placeholder="$t('common.search.placeholder')"
                       is-enter-search clearable></tiny-search>
          <div>
            <tiny-button type="primary" @click="openDataQualityConfigForm(null, 'add')"
                         :disabled="changeType.type === ''">{{ $t('common.operations.add')
              }}
            </tiny-button>
          </div>
        </div>
      </template>

      <tiny-grid-column field="id" :title="$t('common.id')" width="100"></tiny-grid-column>
      <tiny-grid-column field="name" :title="$t('governance.quality.config.field.name')"></tiny-grid-column>
      <tiny-grid-column :title="$t('governance.quality.detection.type')">
        {{ changeType.name }}
      </tiny-grid-column>
      <tiny-grid-column field="schedulerJobParam.actuator" :title="$t('scheduler.job.field.actuator')">
        <template v-slot="data">
          {{ $t(findDescribe(schedulerActuatorEnums, data.row.schedulerJobParam.actuator)) }}
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="schedulerJobParam.cron" :title="$t('scheduler.job.field.cron')"></tiny-grid-column>

      <tiny-grid-column field="schedulerJobParam.concurrent" :title="$t('scheduler.job.field.concurrent')">
        <template v-slot="data">
          <tiny-switch v-model="data.row.schedulerJobParam.concurrent" :disabled="true"></tiny-switch>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="schedulerJobParam.status" :title="$t('scheduler.job.field.status')">
        <template v-slot="data">
          <tiny-switch v-model="data.row.schedulerJobParam.status" :disabled="true"></tiny-switch>
        </template>
      </tiny-grid-column>

      <tiny-grid-column :title="$t('common.operations')" width="150" align="center">
        <template v-slot="data">
          <a @click="deleteDataQualityConfigData(data.row.id)">
            {{ t('common.operations.delete') }}
          </a>
          <a @click="openDataQualityConfigForm(data.row, 'update')">
            {{ t('common.operations.update') }}
          </a>

          <!--            <a @click="openSchedulerTrigger(data.row)">
                        {{ t('scheduler.trigger.field.execution.log') }}
                      </a>-->

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

  <div>
    <tiny-drawer :title="$t('scheduler.trigger.field.execution.log')"
                 :visible="schedulerTriggerDrawer"
                 @update:visible="schedulerTriggerDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="schedulerTriggerDrawer = false">
      <div>
<!--        <suspense>
          <SchedulerTrigger :jobId="jobId" lazy />
        </suspense>-->
      </div>
    </tiny-drawer>
  </div>

  <div>
    <tiny-drawer :title="dataQualityConfigFormTitle"
                 :visible="dataQualityConfigFormDrawer"
                 @update:visible="dataQualityConfigFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataQualityConfigForm(false)">
      <div>
        <suspense>
          <DqmConfigurationForm :dataQualityConfigFormData="dataQualityConfigFormData"
                             :schedulerActuatorEnums="schedulerActuatorEnums"></DqmConfigurationForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>

  <div>
    <tiny-drawer :title="dataQualityConfigFormTitle"
                 :visible="dataQualityConfigFormSysDrawer"
                 @update:visible="dataQualityConfigFormSysDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataQualityConfigSysForm(false)">
      <div>
        <suspense>
          <DqmConfigurationSysForm :dataQualityConfigSysFormData="dataQualityConfigFormData"></DqmConfigurationSysForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { assign, cloneDeep } from 'lodash-es'
import { Modal, Notify } from '@opentiny/vue'
import { findDescribe, formPage, type SelectModel } from '@/utils/tool'
import { DataQualityConfigService } from '@/services/governance/quality-config'
import { iconFiles, iconFolderOpened } from '@opentiny/vue-icon'
import { CurrencyService } from '@/services/currency/currency'

const DqmConfigurationForm = defineAsyncComponent(() => import('@/views/governance/data-quality/components/dqm-configuration-form.vue'))
const DqmConfigurationSysForm = defineAsyncComponent(() => import('@/views/governance/data-quality/components/dqm-configuration-sys-form.vue'))

const IconFiles = iconFiles()
const IconFolderOpened = iconFolderOpened()
const { t } = useI18n()
const searchValue = ref('')
const dataQualityConfigList = ref()

const dataQualityConfigFormSysDrawer = ref(false)
const dataQualityConfigFormDrawer = ref(false)
const dataQualityConfigFormTitle = ref('')
const dataQualityConfigFormData = ref()
const dataQualityConfigFormDataCopy = ref()

const changeType = defineModel('changeType', { default: {} as any })
const schedulerActuatorEnums = ref<SelectModel[]>([])


const schedulerTriggerDrawer = ref(false)
const jobId = ref(0)

onMounted(async () => {
  schedulerActuatorEnums.value = await CurrencyService.getEnum('SchedulerActuatorEnum')
})

//搜索查询
const search = async () => {
  const result = await DataQualityConfigService.getPage({
    ruleType: changeType.value.type,
    search: searchValue.value,
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  dataQualityConfigList.value = result.list
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

const deleteDataQualityConfigData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await DataQualityConfigService.deleteById(id)
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

const openDataQualityConfigForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    dataQualityConfigFormTitle.value = t('common.text.add.data')
    dataQualityConfigFormData.value = {
      id: 0,
      ruleType: changeType.value.type,
      schedulerJobParam: { id: 0, group: 'QUALITY', concurrent: 0, status: 1 }
    }
  } else {
    dataQualityConfigFormTitle.value = t('common.text.update.data')
    dataQualityConfigFormData.value = row
    dataQualityConfigFormDataCopy.value = cloneDeep(row)
  }
  if (changeType.value.type === 'custom') {
    dataQualityConfigFormDrawer.value = true
  } else {
    dataQualityConfigFormSysDrawer.value = true

  }

}

const closeDataQualityConfigForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    //还原数据
    assign(dataQualityConfigFormData.value, dataQualityConfigFormDataCopy.value)
  }
  dataQualityConfigFormDrawer.value = false
}

const closeDataQualityConfigSysForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    //还原数据
    assign(dataQualityConfigFormData.value, dataQualityConfigFormDataCopy.value)
  }
  dataQualityConfigFormSysDrawer.value = false
}

emitter.on('closeDataQualityConfigSysForm', (isUp) => {
  closeDataQualityConfigSysForm(isUp)
})


emitter.on('closeDataQualityConfigForm', (isUp) => {
  closeDataQualityConfigForm(isUp)
})

const openSchedulerTrigger = (row: any) => {
  jobId.value = row.jobId
  schedulerTriggerDrawer.value = true
}

watchEffect(async () => {
  if (changeType.value.type !== '') {
    await search()
  }else{
    dataQualityConfigList.value = []
    formPage.value.total = 0
  }
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

  :deep(.tiny-breadcrumb .tiny-breadcrumb__item:last-child .tiny-breadcrumb__inner) {
    font-weight: 500;
    color: #2c3e50;
    text-decoration: none;
  }

  :deep(.container-breadcrumb) {
    font-size: 12px;
    margin: 5px 10px 0 0;
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
  width: calc(25vh + 100px);
  margin: 12px 0;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }
}
.svg-dir{
  fill: #ffcc41;
}

.svg-file{
  fill: #1ac456;
}
</style>
