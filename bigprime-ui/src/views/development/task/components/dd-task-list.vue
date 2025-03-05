<template>
  <div class="grid-toolbar">
    <tiny-search @search="search" @clear="search" v-model="searchValue"
                 :placeholder="$t('common.search.placeholder')"
                 is-enter-search clearable></tiny-search>
  </div>
  <tiny-grid style="max-height: calc(100vh - 480px);overflow: auto;" :data="tableData"
             size="small"
             border
             :stripe="true"
             highlight-hover-row
             resizable
             show-header-overflow="tooltip" show-overflow="tooltip">
    <tiny-grid-column field="configModel.name" :title="$t('development.task.field.configId')"></tiny-grid-column>
    <tiny-grid-column field="name" :title="$t('development.task.field.job')"></tiny-grid-column>
    <tiny-grid-column field="summary" :title="$t('development.task.field.summary')"></tiny-grid-column>

    <tiny-grid-column :title="$t('common.operations.status')">
      <template v-slot="data">
        <span v-if="data.row.status === 0" style="color: #1a83c4;">{{ $t('common.operations.status.unpublished')
          }}</span>
        <span v-if="data.row.status === 2" style="color: #24DD7F">{{ $t('common.operations.status.published') }}</span>
      </template>
    </tiny-grid-column>

    <tiny-grid-column field="publishDate" :title="$t('common.operations.publishDate')"></tiny-grid-column>
    <tiny-grid-column field="jobModel.cron" :title="$t('common.operations.execute.plan')"></tiny-grid-column>

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
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { formPage } from '@/utils/tool'
import { FlinkTaskService } from '@/services/development/task'

const tableData = ref()
const searchValue = ref('')

const status = defineModel('status', { default: -1 })

const search = async () => {
  const result = await FlinkTaskService.getPage({
    page: formPage.value.page,
    limit: formPage.value.limit,
    model: {
      name: searchValue.value,
      status: status.value,
      type: 1
    }
  })
  tableData.value = result.list
  formPage.value.total = result.total
}

watchEffect(async () => {
  if (status.value >= -1) {
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

  :deep(.container-breadcrumb) {
    font-size: 12px;
    margin: 0 10px 10px 0;
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

.svg-dir {
  fill: #ffcc41;
}

.svg-file {
  fill: #1ac456;
}
</style>
