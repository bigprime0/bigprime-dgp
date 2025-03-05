<template>
  <div class="container-list">
    <Breadcrumb
      :items="['menu.dg', 'menu.dg.dg-metadata', 'menu.dg.dg-metadata.dg-metadata-search']"
    />
    <div class="contain">
      <div class="grid-toolbar">
        <tiny-search
          v-model="searchValue"
          @search="search"
          @clear="search"
          is-enter-search
          clearable
          :search-types="searchScope"
          :type-value="scopeValue"
          @select="selectScope"
        >
        </tiny-search>
      </div>
      <div class="contain-card">
        <div class="card-wrap">
          <div class="card-item" v-for="(item, index) in searchResult" :key="index">
            <!--            <tiny-col :span="2">-->
            <tiny-card size="mini">
              <template #title-left></template>

              <template #title>
                <tiny-user-head
                  v-model="item.category"
                  class="head-item"
                  type="label"
                  min
                  round
                  background-color="#2e86de"
                  color="#fff"
                ></tiny-user-head>
                <tiny-link
                  class="span-font"
                  type="info"
                  :underline="false"
                  :title="isEmpty(item.description) ? item.name : item.description"
                >
                </tiny-link>
              </template>

              <template #title-right>
                <div>
                  &nbsp;&nbsp;
                  <tiny-tag :value="item.sourceType"></tiny-tag>
                  &nbsp;&nbsp;
                  <tiny-tag :value="item.version"></tiny-tag>
                </div>
              </template>

              <template #default>
                <div>
                  <div>
                    <span>{{ t('metadata.collect.source') }}</span
                    >：<span>{{ item.sourceName }}</span>
                  </div>
                  <div>
                    <span>{{ t('metadata.show.description') }}</span
                    >：<span>{{ item.description || item.name }}</span>
                  </div>
                  <div>
                    <span>{{ t('metadata.show.name') }}</span
                    >：<span>{{ item.name }}</span>
                  </div>
                </div>
              </template>
              <template #footer>
                <tiny-button
                  type="primary"
                  :icon="iconEditorBackground()"
                  circle
                  size="mini"
                  :title="$t('assets.asset.look.info')"
                  @click="showDataElement(item)"
                />
              </template>
            </tiny-card>
            <!--            </tiny-col>-->
          </div>
        </div>
      </div>
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

    <tiny-drawer
      :title="drawConfig.title"
      :visible="drawConfig.visible"
      @update:visible="drawConfig.visible = $event"
      :show-header="true"
      :mask-closable="false"
      :width="drawConfig.width"
      @close="drawConfig.handleDrawerClose"
    >
      <MetadataContent />
    </tiny-drawer>
  </div>
</template>
<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { formPage, type OptionModel } from '@/utils/tool'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { iconEditorBackground } from '@opentiny/vue-icon'
import { type metadataModel, MetadataService } from '@/services/metadata/metadata'
import MetadataContent from '@/views/metadata/components/metadata-content.vue'
import emitter from '@/utils/evnetbus'

const { t } = useI18n()
const searchValue = ref('')
const searchResult = ref<metadataModel[]>([])
const searchScope = ref<OptionModel[]>([
  { text: t('metadata.serach.source'), value: 'Source' },
  { text: t('metadata.serach.table'), value: 'Table' },
  { text: t('metadata.serach.view'), value: 'View' },
  { text: t('metadata.serach.function'), value: 'Function' }
])
const scopeValue = ref('Table')

onMounted(() => {
  search()
})

const search = () => {
  MetadataService.getMetadataPage({
    page: formPage.value.page,
    limit: formPage.value.limit,
    category: scopeValue.value,
    search: searchValue.value
  }).then((response: any) => {
    searchResult.value = response.list
    formPage.value.total = response.total
  })
}

const drawConfig = ref({
  title: t('metadata.content.title'),
  visible: false,
  width: '65%',
  handleDrawerClose: () => {
    drawConfig.value.visible = false
  }
})
emitter.on('drawerCancel', drawConfig.value.handleDrawerClose)

const pageChange = (page: number) => {
  formPage.value.page = page
  search()
}

const limitChange = (limit: number) => {
  formPage.value.limit = limit
  search()
}

const showDataElement = (node: any) => {
  emitter.emit('queryDataElements', node)
  drawConfig.value.visible = true
}

const selectScope = (value: OptionModel) => {
  scopeValue.value = value.value
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
  height: 99%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.tiny-search) {
    width: 60%;
  }

  :deep(.contain-card) {
    height: calc(75vh - 100px);
    width: 100%;
  }
}

.card-wrap {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.card-item {
  margin: 10px;
  padding: 10px;

  :deep(.tiny-card__footer) {
    text-align: right;
  }
}
</style>
