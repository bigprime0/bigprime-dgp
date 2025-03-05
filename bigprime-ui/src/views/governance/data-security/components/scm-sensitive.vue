<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg','menu.dg.dg-scm', 'menu.dg.dg-scm.dg-scm-sensitive']" />
    <div class="contain">
      <tiny-grid :data="dataSecurityLevelList" :fit="true" size="small"
                 auto-resize border :stripe="true"
                 show-header-overflow="tooltip" show-overflow="tooltip"
                 highlight-hover-row max-height="85%">
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search @search="search" @clear="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>
            <div>
              <tiny-button type="primary" @click="openDataSecurityLevelForm(null, 'add')">{{
                  $t('common.operations.add') }}
              </tiny-button>
            </div>
          </div>
        </template>

        <tiny-grid-column field="id" :title="$t('common.id')" width="50"></tiny-grid-column>
        <tiny-grid-column field="sensitiveLevel"
                          :title="$t('security.level.field.sensitiveLevel')"></tiny-grid-column>
        <tiny-grid-column field="sensitiveName"
                          :title="$t('security.level.field.sensitiveName')"></tiny-grid-column>

        <tiny-grid-column :title="$t('common.operations')" width="100" align="center">
          <template v-slot="data">
            <a @click="deleteDataSecurityLevelData(data.row.id)">
              {{ t('common.operations.delete') }}
            </a>
            <a @click="openDataSecurityLevelForm(data.row, 'update')">
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
    <tiny-drawer :title="dataSecurityLevelFormTitle"
                 :visible="dataSecurityLevelFormDrawer"
                 @update:visible="dataSecurityLevelFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataSecurityLevelForm(false)">
      <div>
        <suspense>
          <DataForm :dataSecurityLevelFormData="dataSecurityLevelFormData"></DataForm>
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
import DataForm from '@/views/governance/data-security/components/scm-sensitive-form.vue'
import { DataSecurityLevelService } from '@/services/governance/security-level'


const { t } = useI18n()
const searchValue = ref('')
const dataSecurityLevelList = ref()

const dataSecurityLevelFormDrawer = ref(false)
const dataSecurityLevelFormTitle = ref('')
const dataSecurityLevelFormData = ref()
const dataSecurityLevelFormDataCopy = ref()

const search = async () => {
  const result = await DataSecurityLevelService.getPage({
    model: {
      sensitiveName:searchValue.value
    },
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  dataSecurityLevelList.value = result.list
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

const openDataSecurityLevelForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    dataSecurityLevelFormTitle.value = t('common.text.add.data')
    dataSecurityLevelFormData.value = { id: 0 }
  } else {
    dataSecurityLevelFormTitle.value = t('common.text.update.data')
    dataSecurityLevelFormData.value = row
    dataSecurityLevelFormDataCopy.value = cloneDeep(row)
  }
  dataSecurityLevelFormDrawer.value = true
}

const deleteDataSecurityLevelData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await DataSecurityLevelService.deleteById(id)
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      await search()
    }
  })
}

const closeDataSecurityLevelForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(dataSecurityLevelFormData.value, dataSecurityLevelFormDataCopy.value)
  }
  dataSecurityLevelFormDrawer.value = false
}

emitter.on('closeDataSecurityLevelForm', (isUp) => {
  closeDataSecurityLevelForm(isUp)
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
