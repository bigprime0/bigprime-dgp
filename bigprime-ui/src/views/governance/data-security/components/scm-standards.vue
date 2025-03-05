<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg','menu.dg.dg-scm', 'menu.dg.dg-scm.dg-scm-standards']" />
    <div class="contain">
      <tiny-grid :data="dataSecurityStandardsList" :fit="true" size="small" auto-resize border :stripe="true"
                 show-header-overflow="tooltip" show-overflow="tooltip"
                 highlight-hover-row max-height="85%">
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search @search="search" @clear="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>
            <div>
              <tiny-button type="primary" @click="openDataSecurityStandardsForm(null, 'add')">{{
                  $t('common.operations.add') }}
              </tiny-button>
            </div>
          </div>
        </template>

        <tiny-grid-column field="id" :title="$t('common.id')" width="50"></tiny-grid-column>
        <tiny-grid-column field="code"
                          :title="$t('security.standards.field.code')"></tiny-grid-column>
        <tiny-grid-column field="name"
                          :title="$t('security.standards.field.name')"></tiny-grid-column>

        <tiny-grid-column field="approvalDate"
                          :title="$t('security.standards.field.approvalDate')"></tiny-grid-column>

        <tiny-grid-column field="implementationDate"
                          :title="$t('security.standards.field.implementationDate')"></tiny-grid-column>

        <tiny-grid-column field="filingsCode"
                          :title="$t('security.standards.field.filingsCode')"></tiny-grid-column>
        <tiny-grid-column field="filingDate"
                          :title="$t('security.standards.field.filingDate')"></tiny-grid-column>
        <tiny-grid-column field="remark"
                          :title="$t('security.standards.field.remark')"></tiny-grid-column>
        <tiny-grid-column :title="$t('common.operations.status')">
          <template v-slot="data">
            <span v-if="data.row.status === 0">{{ $t('common.operations.status.new') }}</span>
            <span v-if="data.row.status === 1">{{ $t('common.operations.status.underReview') }}</span>
            <span v-if="data.row.status === 2">{{ $t('common.operations.status.published') }}</span>
            <span v-else></span>
          </template>
        </tiny-grid-column>

        <tiny-grid-column :title="$t('common.operations')" width="150" align="center">
          <template v-slot="data">
            <a v-if="data.row.status === 0" @click="deleteDataSecurityStandardsData(data.row.id)">
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
            <a @click="openDataSecurityStandardsForm(data.row, 'update')">
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
    <tiny-drawer :title="dataSecurityStandardsFormTitle"
                 :visible="dataSecurityStandardsFormDrawer"
                 @update:visible="dataSecurityStandardsFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataSecurityStandardsForm(false)">
      <div>
        <suspense>
          <DataForm :dataSecurityStandardsFormData="dataSecurityStandardsFormData"></DataForm>
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
import { Modal } from '@opentiny/vue'
import { formPage } from '@/utils/tool'
import DataForm from '@/views/governance/data-security/components/scm-standards-form.vue'
import { DataSecurityStandardsService } from '@/services/governance/security-standards'


const { t } = useI18n()
const searchValue = ref('')
const dataSecurityStandardsList = ref()

const dataSecurityStandardsFormDrawer = ref(false)
const dataSecurityStandardsFormTitle = ref('')
const dataSecurityStandardsFormData = ref()
const dataSecurityStandardsFormDataCopy = ref()

const search = async () => {
  const result = await DataSecurityStandardsService.getPage({
    model: {
      name: searchValue.value
    },
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  dataSecurityStandardsList.value = result.list
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

const handleStatus = (row: any, newStatus: number, message: string) => {
  Modal.confirm(message).then(async (res: string) => {
    if (res === 'confirm') {
      row.status = newStatus
      await DataSecurityStandardsService.save(row)
      await search()
    }
  })
}

const openDataSecurityStandardsForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    dataSecurityStandardsFormTitle.value = t('common.text.add.data')
    dataSecurityStandardsFormData.value = { id: 0, status: 0, file:'' }
  } else {
    dataSecurityStandardsFormTitle.value = t('common.text.update.data')
    dataSecurityStandardsFormData.value = row
    dataSecurityStandardsFormDataCopy.value = cloneDeep(row)
  }
  dataSecurityStandardsFormDrawer.value = true
}

const deleteDataSecurityStandardsData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await DataSecurityStandardsService.deleteById(id)
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      await search()
    }
  })
}

const closeDataSecurityStandardsForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(dataSecurityStandardsFormData.value, dataSecurityStandardsFormDataCopy.value)
  }
  dataSecurityStandardsFormDrawer.value = false
}

emitter.on('closeDataSecurityStandardsForm', (isUp) => {
  closeDataSecurityStandardsForm(isUp)
})

onMounted(() => {
  search()
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
