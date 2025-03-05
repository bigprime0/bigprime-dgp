<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-service', 'menu.dg.dg-service.dg-service-call-record']" />
    <div class="contain">
      <tiny-grid :data="dataServiceApiLogList" :fit="true" size="medium" auto-resize border :stripe="true"
                 show-header-overflow="tooltip" show-overflow="tooltip"
                 highlight-hover-row max-height="82%">
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search @search="search" @clear="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>
          </div>
        </template>

        <tiny-grid-column field="name"
                          :title="$t('service.api.log.field.name')"></tiny-grid-column>
        <tiny-grid-column field="path"
                          :title="$t('service.api.log.field.path')"></tiny-grid-column>
        <tiny-grid-column field="status"
                          :title="$t('service.api.log.field.status')">
          <template v-slot="data">
            <span v-if="data.row.status === 1" style="color: #1ac456;">{{$t('common.text.success')}}</span>
            <span v-if="data.row.status === 2" style="color: red">{{$t('common.text.fail')}}</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="reqParameter"
                          :title="$t('service.api.log.field.reqParameter')">
          <template v-slot="data">
            <tiny-popover width="500">
              <json-viewer
                :preview-mode="false"
                :expanded="false"
                :expand-depth="3"
                :copyable="true"
                :value="JSON.parse(data.row.reqParameter)" />
              <template #reference>
                <tiny-link :underline="false" style="color: #1ac456;font-size: 12px;">{{ t('common.operations.look') }}</tiny-link>
              </template>
            </tiny-popover>
          </template>

        </tiny-grid-column>
        <tiny-grid-column field="returnCount"
                          :title="$t('service.api.log.field.returnCount')"></tiny-grid-column>
        <tiny-grid-column field="errorCode"
                          :title="$t('service.api.log.field.errorCode')"></tiny-grid-column>
        <tiny-grid-column field="errorMessage"
                          :title="$t('service.api.log.field.errorMessage')"></tiny-grid-column>
<!--        <tiny-grid-column field="apiId"
                          :title="$t('service.api.log.field.apiId')"></tiny-grid-column>
        <tiny-grid-column field="ip"
                          :title="$t('service.api.log.field.ip')"></tiny-grid-column>-->

<!--        <tiny-grid-column field="type"
                          :title="$t('service.api.log.field.type')"></tiny-grid-column>-->
<!--        <tiny-grid-column :title="$t('common.operations')" width="100" align="center">
          <template v-slot="data">
            <a @click="deleteDataServiceApiLogData(data.row.id)">
              {{ t('common.operations.delete') }}
            </a>
            <a @click="openDataServiceApiLogForm(data.row, 'update')">
              {{ t('common.operations.update') }}
            </a>
          </template>
        </tiny-grid-column>-->
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
    <tiny-drawer :title="dataServiceApiLogFormTitle"
                 :visible="dataServiceApiLogFormDrawer"
                 @update:visible="dataServiceApiLogFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataServiceApiLogForm(false)">
      <div>
        <suspense>
          <ServiceCallRecordForm :dataServiceApiLogFormData="dataServiceApiLogFormData"></ServiceCallRecordForm>
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
import { formPage } from '@/utils/tool'
import ServiceCallRecordForm from '@/views/governance/data-service/components/service-call-record-form.vue'
import { DataServiceApiLogService } from '@/services/service/service-log'


const { t } = useI18n()
const searchValue = ref('')
const dataServiceApiLogList = ref()

const dataServiceApiLogFormDrawer = ref(false)
const dataServiceApiLogFormTitle = ref('')
const dataServiceApiLogFormData = ref()
const dataServiceApiLogFormDataCopy = ref()

onMounted(() => {
  search()
})

const pageChange = (page: number) => {
  formPage.value.page = page
  search()
}

const limitChange = (limit: number) => {
  formPage.value.limit = limit
  search()
}

//搜索查询
const search = async () => {
  const result = await DataServiceApiLogService.getPage({
    search: searchValue.value,
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  dataServiceApiLogList.value = result.list
  formPage.value.total = result.total
}

//打开form表单
const openDataServiceApiLogForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    dataServiceApiLogFormTitle.value = t('common.text.add.data')
    dataServiceApiLogFormData.value = { id: 0 }
  } else {
    dataServiceApiLogFormTitle.value = t('common.text.update.data')
    dataServiceApiLogFormData.value = row
    dataServiceApiLogFormDataCopy.value = cloneDeep(row)
  }
  dataServiceApiLogFormDrawer.value = true
}

const deleteDataServiceApiLogData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await DataServiceApiLogService.deleteById(id)
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

//抽屉关闭操作
const closeDataServiceApiLogForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    //还原数据
    assign(dataServiceApiLogFormData.value, dataServiceApiLogFormDataCopy.value)
  }
  dataServiceApiLogFormDrawer.value = false
}

//监听抽屉子组件的取消
emitter.on('closeDataServiceApiLogForm', (isUp) => {
  closeDataServiceApiLogForm(isUp)
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
</style>
