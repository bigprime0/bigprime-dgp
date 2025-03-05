<template>
  <div class="container-list">
    <Breadcrumb
      :items="['menu.dg', 'menu.dg.dg-metadata', 'menu.dg.dg-metadata.dg-metadata-log']"
    />
    <div class="contain">
      <tiny-grid
        :data="detailGridData"
        ref="configGridRef"
        :fit="true"
        size="small"
        border
        :stripe="true"
        show-header-overflow="tooltip"
        show-overflow="tooltip"
        highlight-hover-row
      >
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search
              @search="search"
              @clear="search"
              v-model="searchValue"
              :placeholder="$t('common.search.placeholder')"
              is-enter-search
              clearable
            ></tiny-search>
          </div>
        </template>
        <tiny-grid-column type="index" width="60"></tiny-grid-column>
        <tiny-grid-column
          field="categoryName"
          :title="$t('metadata.show.categoryName')"
          show-overflow
        ></tiny-grid-column>
        <tiny-grid-column
          field="sourceName"
          :title="$t('metadata.show.sourceName')"
          show-overflow
        ></tiny-grid-column>
        <tiny-grid-column
          field="ownerCode"
          :title="$t('metadata.show.ownerCode')"
          show-overflow
        ></tiny-grid-column>
        <tiny-grid-column
          field="ownerName"
          :title="$t('metadata.show.ownerName')"
          show-overflow
        ></tiny-grid-column>
        <tiny-grid-column
          field="eleCode"
          :title="$t('metadata.show.eleCode')"
          show-overflow
        ></tiny-grid-column>
        <tiny-grid-column
          field="eleName"
          :title="$t('metadata.show.eleName')"
          show-overflow
        ></tiny-grid-column>
        <tiny-grid-column
          field="oldEleValue"
          :title="$t('metadata.show.oldEleValue')"
          show-overflow
        ></tiny-grid-column>
        <tiny-grid-column
          field="newEleValue"
          :title="$t('metadata.show.newEleValue')"
          show-overflow
        ></tiny-grid-column>
        <tiny-grid-column
          field="editorName"
          :title="$t('metadata.show.editorName')"
          show-overflow
        ></tiny-grid-column>
        <tiny-grid-column field="lastUpdated" :title="$t('common.lastupdated')"></tiny-grid-column>
      </tiny-grid>
      <!--分页-->
      <tiny-pager
        :current-page="formPage.page"
        :page-size="formPage.limit"
        :total="formPage.total"
        :page-sizes="formPage.pageSizes"
        @current-change="formPage.pageChange(formPage.page, search)"
        @size-change="formPage.limitChange(formPage.page, search)"
        :align="formPage.align"
        :layout="formPage.layout"
      ></tiny-pager>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { formPage } from '@/utils/tool'
import { MetadataService } from '@/services/metadata/metadata'

const searchValue = ref('')
const detailGridData = ref([])

onMounted(() => {
  search()
})

//搜索查询
const search = async () => {
  const result: any = await MetadataService.getUpdateLogs({
    search: searchValue.value,
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  detailGridData.value = result.list
  formPage.value.total = result.total
}
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
}

.grid-toolbar {
  display: flex;
  justify-content: left;
  width: calc(40vh + 200px);
  margin: 12px 0;

  .tiny-search {
    width: 256px;
  }

  div {
    margin-right: 5px;
  }

  .tiny-button-group {
    margin-right: 5px;
  }
}
</style>
