<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dsm', 'menu.dg.dg-dsm.dg-dsm-log']" />
    <div class="contain">
      <tiny-grid :data="tableData"
                 size="small"
                 border
                 :stripe="true"
                 highlight-hover-row
                 resizable
                 show-header-overflow="tooltip" show-overflow="tooltip"
                 max-height="85%">
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-select
              v-model="standardId"
              :placeholder="$t('common.search.placeholder')"
              filterable
              remote
              :remote-method="getStandardList"
              :loading="loading"
              loading-text="Loading..."
              @change="search"
              clearable
              @clear="search"
            >
              <tiny-option v-for="item in standardList" :key="item.id" :label="item.cnName"
                           :value="item.id"></tiny-option>
            </tiny-select>

            <tiny-select
              v-model="type"
              @change="search"
              :placeholder="$t('common.operations.log.type')"
              :multiple="false"
              clearable
              @clear="search"
            >
              <tiny-option :key="1" :label="$t('common.operations.update')" :value="1"></tiny-option>
              <tiny-option :key="2" :label="$t('common.operations.delete')" :value="2"></tiny-option>
              <tiny-option :key="3" :label="$t('common.operations.status.publish')"
                           :value="3"></tiny-option>
              <tiny-option :key="4" :label="$t('common.operations.status.unpublish')"
                           :value="4"></tiny-option>
            </tiny-select>
          </div>
        </template>

        <tiny-grid-column field="code" :title="$t('governance.standard.field.code')"></tiny-grid-column>
        <tiny-grid-column field="cnName" :title="$t('governance.standard.field.cnName')"></tiny-grid-column>
        <tiny-grid-column field="enName" :title="$t('governance.standard.field.enName')"></tiny-grid-column>
        <tiny-grid-column :title="$t('common.operations.log.type')">
          <template v-slot="data">
            <span v-if="data.row.type === 1">{{ $t('common.operations.update') }}</span>
            <span v-if="data.row.type === 2">{{ $t('common.operations.delete') }}</span>
            <span v-if="data.row.type === 3">{{ $t('common.operations.status.publish') }}</span>
            <span v-if="data.row.type === 4">{{ $t('common.operations.status.unpublish') }}</span>
            <span v-else></span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="updaterName" :title="$t('common.field.updaterName')"></tiny-grid-column>
        <tiny-grid-column field="updateTime" :title="$t('common.field.updateTime')"></tiny-grid-column>


        <tiny-grid-column :title="$t('common.operations')" width="150" align="center">
          <template v-slot="data">
            <a @click="handleForm(data.row)">
              {{ $t('common.operations.look') }}
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
    <tiny-drawer :title="$t('common.operations.look')"
                 :visible="drawVisible"
                 @update:visible="drawVisible = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="80%">
      <div>
        <LogForm :beginData="beginData" :endData="endData" :fields="fields" :codes="codes" :colorChanges="colorChanges"></LogForm>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import LogForm from '@/views/governance/data-standard/components/dsm-log-form.vue'
import { formPage } from '@/utils/tool'
import { ConvertCodeType, type Standard, StandardService } from '@/services/governance/standard'
import { isEmpty, isEqual, keys, omitBy } from 'lodash-es'

const tableData = ref()
const drawVisible = ref(false)
const beginData = ref()
const endData = ref()
const fields = ref()
const codes = ref()
const colorChanges = ref()
const standardId = ref()
const type = ref()

const standardList = ref<Standard[]>([])
const loading = ref(false)
const activeName = defineModel('activeName')

const getStandardList = (query : any) => {
  if (!isEmpty(query)) {
    loading.value = true
    setTimeout(async () => {
      loading.value = false
      standardList.value = await StandardService.getList({
        search: query
      })
    }, 200)

  } else {
    standardList.value = []
  }
}


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
  let types:any = []
  if(type.value){
    types.push(type.value)
  }
  const result = await StandardService.getLogPage({
    standardId: standardId.value,
    types: types,
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  result.list.forEach((o : any) => {
    o.beginData = JSON.parse(o.beginData);
    ConvertCodeType(o.beginData)
    if(!isEmpty(o.endData)){
      o.endData = JSON.parse(o.endData);
      ConvertCodeType(o.endData)
    }else{
      o.endData = {}
    }
    if(isEmpty(o.code)){
      o.code = o.beginData.code
    }
    if(isEmpty(o.enName)){
      o.enName = o.beginData.enName
    }
    if(isEmpty(o.cnName)){
      o.cnName = o.beginData.cnName
    }
  })
  tableData.value = result.list
  formPage.value.total = result.total
}

//打开form表单
const handleForm = (row: any) => {
  beginData.value = row.beginData
  endData.value = row.endData
  const differences = omitBy(beginData.value, (value, key) => isEqual(value, endData.value[key]));
  colorChanges.value = keys(differences);
  drawVisible.value = true
}

watch(activeName, () => {
  if (activeName.value === 'log') {
    search()
  }
})

onMounted( async () => {
  await search()
  const result = await StandardService.getTypes()
  fields.value = result.fields
  codes.value = result.codes
})
</script>

<style scoped lang="less">
.span-font {
  color: #3ac295;
}

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
  width: calc(40vh + 100px);
  margin:10px 0;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }
}

</style>
