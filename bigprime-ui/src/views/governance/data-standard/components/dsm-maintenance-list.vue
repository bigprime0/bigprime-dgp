<template>
  <div class="container-list">
    <Breadcrumb :class="changeType.dataType === 0 ? 'svg-dir': 'svg-file'" :items="[pathName]" :IconLeft="changeType.dataType === 0 ? IconFolderOpened: IconFiletext"/>
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
            <tiny-search @search="search" @clear="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>

            <tiny-button type="primary" @click="handleForm({} as Standard, 'add')" :disabled="changeType.dataType === 0">
              {{ $t('common.operations.add') }}
            </tiny-button>
          </div>
        </template>

        <tiny-grid-column field="code" :title="$t('governance.standard.field.code')"></tiny-grid-column>
        <tiny-grid-column field="cnName" :title="$t('governance.standard.field.cnName')"></tiny-grid-column>
        <tiny-grid-column field="enName" :title="$t('governance.standard.field.enName')"></tiny-grid-column>
        <tiny-grid-column field="description" :title="$t('governance.standard.field.description')"></tiny-grid-column>
        <tiny-grid-column :title="$t('common.operations.status')">
          <template v-slot="data">
            <span v-if="data.row.status === 0">{{ $t('common.operations.status.new') }}</span>
            <span v-if="data.row.status === 1">{{ $t('common.operations.status.underReview') }}</span>
            <span v-if="data.row.status === 2">{{ $t('common.operations.status.published') }}</span>
            <span v-else></span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="publishDate" :title="$t('common.operations.publishDate')"></tiny-grid-column>


        <tiny-grid-column :title="$t('common.operations')" width="150" align="center">
          <template v-slot="data">
            <a v-if="data.row.status === 0" @click="handleDelete(data.row.id)">
              {{ t('common.operations.delete') }}
            </a>
            <a v-if="data.row.status === 0"
               @click="handleStatus(data.row,2,t('common.operations.status.publish.prompt'))">
              {{ t('common.operations.status.publish') }}
            </a>
            <a v-if="data.row.status === 2"
               @click="handleStatus(data.row,0,t('common.operations.status.unpublish.prompt'))">
              {{ t('common.operations.status.unpublish') }}
            </a>
            <a @click="handleForm(data.row, 'update')">
              {{ data.row.status === 0 ? t('common.operations.update') : t('common.operations.look') }}
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
        <DataForm ref="formRef" :formData="formData" :fields="fields" :codes="codes"></DataForm>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import DataForm from '@/views/governance/data-standard/components/dsm-maintenance-list-form.vue'
import { Modal, Notify } from '@opentiny/vue'
import { formPage } from '@/utils/tool'
import { ConvertCodeType, type Standard, StandardService, type StandardTypeInfo } from '@/services/governance/standard'
import { assign, cloneDeep, isEmpty } from 'lodash-es'
import { iconFiletext, iconFolderOpened } from '@opentiny/vue-icon'

const IconFolderOpened = iconFolderOpened()
const IconFiletext = iconFiletext()

const { t } = useI18n()
const tableData = ref()
const searchValue = ref('')
const drawVisible = ref(false)
const drawTitle = ref('')
const formRef = ref()
const formData = ref()
const formDataCopy = ref()

const changeType = defineModel('changeType', { default: {} as StandardTypeInfo })
const fields = ref()
const codes = ref()
const pathName = ref()

onMounted(() => {
  getTypes()
})

watchEffect(async () => {
  if (isEmpty(changeType.value.pidName)) {
    pathName.value = changeType.value.name
  } else {
    pathName.value = changeType.value.pidName + ' / ' + changeType.value.name
  }
  if (changeType.value.id >= 0) {
    await search()
  }
})

const pageChange = (page: number) => {
  formPage.value.page = page
  search()
}

const limitChange = (limit: number) => {
  formPage.value.limit = limit
  search()
}

const getTypes = async () => {
  const result = await StandardService.getTypes()
  fields.value = result.fields
  codes.value = result.codes
}

//搜索查询
const search = async () => {
  const result = await StandardService.getPage({
    id: changeType.value.id,
    search: searchValue.value,
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  tableData.value = result.list
  formPage.value.total = result.total
}

//打开form表单
const handleForm = (row: Standard, typeValue: any) => {
  if (typeValue == 'add') {
    drawTitle.value = t('common.text.add.data')
    formData.value = {
      id: 0,
      standardTypeId: changeType.value.id,
      standardTypeName: pathName.value,
      status: 0,
      isNone: 1,
      documents: [],
      codeTypeModel: {
        rangeModel: { minValue: 0, maxValue: 0 },
        listModel: [],
        boolModel: { trueOrFalse: '' }
      }
    }
  } else {
    drawTitle.value = t('common.text.update.data')
    row.standardTypeName = pathName.value
    ConvertCodeType(row)
    formData.value = row
    formDataCopy.value = cloneDeep(row)
  }
  drawVisible.value = true
}



const handleDelete = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await StandardService.deleteById(id)
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

const handleStatus = (row: Standard, newStatus: number, message: string) => {
  Modal.confirm(message).then(async (res: string) => {
    if (res === 'confirm') {
      row.status = newStatus
      await StandardService.save(row)
      await search()
    }
  })
}

//抽屉关闭操作
const handleDrawerClose = (isUp: any) => {
  if (isUp) {
    search()
  }else{
    //还原数据
    assign(formData.value, formDataCopy.value)
  }
  drawVisible.value = false
}

//监听抽屉子组件的取消
emitter.on('drawerListCancel', (isUp) => {
  handleDrawerClose(isUp)
})

</script>

<style scoped lang="less">
.span-font {
  color: #3ac295;
}

.container-list {
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

  :deep(.container-breadcrumb){
    font-size: 12px;
    margin: 5px 10px 10px 10px;
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
  margin-bottom: 10px;

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
