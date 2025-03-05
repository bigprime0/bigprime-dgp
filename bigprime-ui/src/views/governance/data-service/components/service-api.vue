<template>
  <div :class="type === 'OTHER' ? 'container-list' : ''">
    <Breadcrumb v-if="type === 'OTHER'" :items="['menu.dg', 'menu.dg.dg-service', 'menu.dg.dg-service.dg-service-api']" />
    <div :class="type === 'OTHER' ? 'contain' : ''">
      <tiny-grid :data="dataServiceApiList" :fit="true" size="medium" auto-resize border :stripe="true"
                 highlight-hover-row max-height="85%" show-header-overflow="tooltip" show-overflow="tooltip">
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search @search="search" @clear="search" @change="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>
            <div>
              <tiny-button v-if="!(type === 'MASTER' && isEmpty(sourceTable))" type="primary" @click="openDataServiceApiForm(null, 'add')">{{
                  $t('common.operations.add') }}
              </tiny-button>
            </div>
          </div>
        </template>

        <tiny-grid-column field="name" :title="$t('service.api.field.name')"></tiny-grid-column>
        <tiny-grid-column field="path" :title="$t('service.api.field.path')"></tiny-grid-column>
        <tiny-grid-column field="version" width="90" :title="$t('service.api.field.version')"></tiny-grid-column>
        <tiny-grid-column width="90" :title="$t('service.api.field.beginTime')">
          <template v-slot="data">
            <span>{{formatDate(data.row.beginTime)}}</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column width="90" :title="$t('service.api.field.endTime')">
          <template v-slot="data">
            <span>{{formatDate(data.row.endTime)}}</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="description" :title="$t('service.api.field.description')"></tiny-grid-column>
        <tiny-grid-column width="70" :title="$t('service.api.field.status')">
          <template v-slot="data">
            <span v-if="data.row.status === 0" >{{ t('common.operations.status.new') }}</span>
            <span v-if="data.row.status === 1" >{{ t('common.operations.status.underReview') }}</span>
            <span v-if="data.row.status === 2" >{{ t('common.operations.status.published') }}</span>
          </template>
        </tiny-grid-column>

        <tiny-grid-column :title="$t('common.operations')" width="220" align="center">
          <template v-slot="data">
            <a v-if="data.row.status === 0" @click="deleteDataServiceApiData(data.row.id)">
              {{ t('common.operations.delete') }}
            </a>
            <a v-if="data.row.status === 0"
               @click="updateStatus(data.row,2,t('common.operations.status.publish.prompt'))">
              {{ t('common.operations.status.publish') }}
            </a>
            <a v-if="data.row.status === 2"
               @click="updateStatus(data.row,0,t('common.operations.status.unpublish.prompt'))">
              {{ t('common.operations.status.unpublish') }}
            </a>
            <a @click="openDataServiceApiForm(data.row, 'update')">
              {{ data.row.status === 0 ? t('common.operations.update') :  t('common.operations.look')}}
            </a>
            <a @click="openDataServiceExampleForm(data.row)">
              {{ t('service.api.field.example.api.example')}}
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
    <tiny-drawer :title="dataServiceApiFormTitle"
                 :visible="dataServiceApiFormDrawer"
                 @update:visible="dataServiceApiFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="60%"
                 @close="closeDataServiceApiForm(false)">
      <div>
        <suspense>
          <ServiceApiForm :dataServiceApiFormData="dataServiceApiFormData" :security-data="securityData"></ServiceApiForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>

  <div>
    <tiny-drawer :title="$t('service.api.field.example.api.example')"
                 :visible="dataServiceExampleFormDrawer"
                 @update:visible="dataServiceExampleFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="60%"
                 @close="closeDataServiceExampleForm()">
      <div>
        <suspense>
          <ServiceApiExample :dataServiceExampleFormData="dataServiceApiFormData" :security-data="securityData"></ServiceApiExample>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { assign, cloneDeep, find, isEmpty } from 'lodash-es'
import { Modal } from '@opentiny/vue'
import { formPage } from '@/utils/tool'
import ServiceApiForm from '@/views/governance/data-service/components/service-api-form.vue'
import ServiceApiExample from '@/views/governance/data-service/components/service-api-example.vue'
import { DataServiceApiService } from '@/services/service/service-api'
import { formatDate } from '@/utils/date'
import { SecurityService } from '@/services/spi/security'


const { t } = useI18n()
const searchValue = ref('')
const dataServiceApiList = ref()

const dataServiceApiFormDrawer = ref(false)
const dataServiceApiFormTitle = ref('')
const dataServiceApiFormData = ref()
const dataServiceApiFormDataCopy = ref()

const dataServiceExampleFormDrawer = ref(false)

const sourceId = defineModel('sourceId', {default: undefined})
const sourceTable = defineModel('sourceTable', {default: ''})
const type = defineModel('type', {default: 'OTHER'})
const securityData = ref()

const search = async () => {
  let query:any = {
    model: {
      name: searchValue.value,
      type: type.value,
      sourceTable: sourceTable.value
    },
    page: formPage.value.page,
    limit: formPage.value.limit
  }
  if(sourceId){
    query.model.sourceId = sourceId.value
  }
  const result = await DataServiceApiService.getPage(query)
  dataServiceApiList.value = result.list
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

//打开form表单
const openDataServiceApiForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    dataServiceApiFormTitle.value = t('common.text.add.data')
    dataServiceApiFormData.value = {
      id: 0,
      status:0,
      type: type.value,
      sourceTable: sourceTable.value,
      config: {
        reqParameter:[],
        resParameter:[]
      }
    }
    if(sourceId){
      dataServiceApiFormData.value.sourceId = sourceId.value
    }
  } else {
    dataServiceApiFormTitle.value = t('common.text.update.data')
    dataServiceApiFormData.value = row
    dataServiceApiFormDataCopy.value = cloneDeep(row)
  }
  dataServiceApiFormDrawer.value = true
}

const openDataServiceExampleForm = (row: any) => {
  dataServiceApiFormData.value = row
  dataServiceApiFormDataCopy.value = cloneDeep(row)
  dataServiceExampleFormDrawer.value = true
}

const deleteDataServiceApiData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await DataServiceApiService.deleteById(id)
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      await search()
    }
  })
}

const updateStatus = (row: any, newStatus: number, message: string) => {
  Modal.confirm(message).then(async (res: string) => {
    if (res === 'confirm') {
      row.status = newStatus
      await DataServiceApiService.save(row)
      await search()
    }
  })
}

const closeDataServiceApiForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(dataServiceApiFormData.value, dataServiceApiFormDataCopy.value)
  }
  dataServiceApiFormDrawer.value = false
}

emitter.on('closeDataServiceApiForm', (isUp) => {
  closeDataServiceApiForm(isUp)
})

const closeDataServiceExampleForm = () => {
  assign(dataServiceApiFormData.value, dataServiceApiFormDataCopy.value)
  dataServiceExampleFormDrawer.value = false
}

const initData = async () => {
  securityData.value = await SecurityService.getSecuritySelect(t)
}

onMounted(() => {
  initData()
  search()
})

</script>

<style scoped lang="less">
.container-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: auto;
}

.contain {
  flex: 1 1 auto;
  margin: 8px 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px 8px rgba(169, 174, 184, 0.05);
  padding: 10px;

  :deep(.tiny-tabs__content) {
    position: relative;
    margin: 5px 1px;
    font-size: var(--ti-tabs-content-font-size);
  }
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
