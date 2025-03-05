<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dd.dd-global.dd-global-variable']" />
    <div class="contain">
      <tiny-grid :data="tableData" :fit="true" size="medium" auto-resize border :stripe="true"
                 show-header-overflow="tooltip" show-overflow="tooltip"
                 highlight-hover-row max-height="85%">
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search @search="search" @clear="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>
            <div>
              <tiny-button type="primary" @click="handleForm(null, 'add')">{{ $t('common.operations.add') }}
              </tiny-button>
            </div>
          </div>
        </template>

        <tiny-grid-column field="id" :title="$t('common.id')" width="80"></tiny-grid-column>
        <tiny-grid-column field="parameterKey" :title="$t('参数Key')"></tiny-grid-column>
        <tiny-grid-column :title="$t('参数类型')">
          <template v-slot="data">
            <span v-if="data.row.parameterType === 1">{{$t('自定义')}}</span>
            <span v-if="data.row.parameterType === 2">{{$t('数据源')}}</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="parameterValue" :title="$t('参数值')"></tiny-grid-column>
        <tiny-grid-column field="remarks" :title="$t('参数描述')"></tiny-grid-column>

        <tiny-grid-column :title="$t('common.operations')" width="100" align="center">
          <template v-slot="data">
            <a v-if="data.row.isSystem === 0" @click="handleDelete(data.row.id)">
              {{ t('common.operations.delete') }}
            </a>
            <a @click="handleForm(data.row, 'update')">
              {{ t('common.operations.update') }}
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
    <tiny-drawer :title="drawTitle"
                 :visible="drawVisible"
                 @update:visible="drawVisible = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="handleDrawerClose(false)">
      <div>
        <suspense>
          <GlobalVariableForm :formData="formData"></GlobalVariableForm>
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
import GlobalVariableForm from '@/views/development/global/global-variable-form.vue'
import { FlinkGlobalVariableService } from '@/services/development/global-variable'


const { t } = useI18n()
const tableData = ref()
const searchValue = ref('')
const drawVisible = ref(false)
const drawTitle = ref('')
const formData = ref()
const formDataCopy = ref()

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
  const result = await FlinkGlobalVariableService.getPage({
    model:{
      parameterKey: searchValue.value
    },
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  tableData.value = result.list
  formPage.value.total = result.total
}

//打开form表单
const handleForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    drawTitle.value = t('common.text.add.data')
    formData.value = { id: 0, parameterType: 1,isSystem: 0 }
  } else {
    drawTitle.value = t('common.text.update.data')
    formData.value = row
    formDataCopy.value = cloneDeep(row)
  }
  drawVisible.value = true
}

const handleDelete = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await FlinkGlobalVariableService.deleteById(id)
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

const handleDrawerClose = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(formData.value, formDataCopy.value)
  }
  drawVisible.value = false
}

emitter.on('GlobalVariableClose', (isUp) => {
  handleDrawerClose(isUp)
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
