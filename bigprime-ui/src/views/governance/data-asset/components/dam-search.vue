<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dam', 'menu.dg.dg-dam.dg-dam-search']" />
    <div class="contain">
      <div class="grid-toolbar">
        <tiny-search
          v-model="searchValue"
          :placeholder="$t('common.search.placeholder')"
          @search="search"
          @clear="search"
          is-enter-search
          clearable
        >
          <template #prefix>
            <tiny-select
              popper-class="select-cls"
              v-model="dataAssetsCategoryValue"
              filterable
              :width="100"
              :filter-method="filter"
              :placeholder="$t('assets.asset.category')"
              clearable
              value-field="id"
              text-field="name"
              render-type="tree"
              @change="search"
              @clear="search"
              :tree-op="dataAssetsCategoryList"
            ></tiny-select>
          </template>
        </tiny-search>
      </div>
      <div class="contain-card">
        <div class="card-wrap" v-for="item in dataAssetsList" :key="item.id">
          <tiny-card size="mini">
            <template #title-left></template>
            <template #title>
              <tiny-link
                class="span-font"
                type="info"
                :underline="false"
                :title="isEmpty(item.remark) ? item.name : item.remark"
              >
                {{ item.name }}
              </tiny-link>
            </template>
            <template #title-right>
              <tiny-link
                v-if="item.status === 0"
                class="list-link"
                type="primary"
                :underline="false"
                :title="item.createTime"
                :value="$t('common.operations.status.new')"
              />
              <tiny-link
                v-if="item.status === 1"
                class="list-link"
                type="warning"
                :underline="false"
                :title="$t('common.operations.status')"
                :value="$t('common.operations.status.underReview')"
              />
              <tiny-link
                v-if="item.status === 2"
                class="list-link"
                type="success"
                :underline="false"
                :title="item.publishDate"
                :value="$t('common.operations.status.published')"
              />
            </template>
            <template #default>
              <tiny-layout cols="3">
                <tiny-row>
                  <tiny-col :span="1">
                    <tiny-user-head
                      v-if="item.assetFormatClassification === 1"
                      type="icon"
                      round
                      v-model="dataSource"
                      class="source"
                      :title="isEmpty(item.remark) ? item.name : item.remark"
                      background-color="#a4d9c6"
                    />
                    <tiny-user-head
                      v-if="item.assetFormatClassification === 2"
                      type="icon"
                      round
                      v-model="editorVideo"
                      class="source"
                      :title="isEmpty(item.remark) ? item.name : item.remark"
                      background-color="#b8d9f9"
                    />
                    <tiny-user-head
                      v-if="item.assetFormatClassification === 3"
                      type="icon"
                      round
                      v-model="files"
                      class="source"
                      :title="isEmpty(item.remark) ? item.name : item.remark"
                      background-color="#2e86de"
                    />
                  </tiny-col>

                  <tiny-col :span="2" class="source-text">
                    <tiny-popover
                      trigger="hover"
                      placement="right"
                      popper-class="popover-cls"
                      :title="$t('assets.asset.field.tag.info')"
                    >
                      <div
                        v-for="tag in item.tagNameList"
                        :key="tag"
                        style="font-size: 11px; margin: 5px"
                      >
                        <tiny-tag type="success" effect="plain">
                          {{ tag }}
                        </tiny-tag>
                      </div>
                      <template #reference>
                        <tiny-link
                          class="source-text-link"
                          type="primary"
                          :underline="false"
                          :icon="iconRadio()"
                          :value="item.code"
                        />
                      </template>
                    </tiny-popover>

                    <br />
                    <br />
                    <tiny-popover
                      trigger="hover"
                      placement="right"
                      popper-class="popover-cls"
                      :title="$t('assets.asset.provide.divider')"
                    >
                      <tiny-link
                        style="font-size: 11px; margin: 5px"
                        type="primary"
                        :underline="false"
                        :value="getOrgName(item.provideOrganizationId)"
                        :title="$t('assets.asset.field.provideOrganizationId')"
                      />
                      <br />
                      <tiny-link
                        style="font-size: 11px; margin: 5px"
                        type="primary"
                        :underline="false"
                        :value="getOrgName(item.belongingOrganizationId)"
                        :title="$t('assets.asset.field.belongingOrganizationId')"
                      />
                      <br />
                      <tiny-link
                        style="font-size: 11px; margin: 5px"
                        type="primary"
                        :underline="false"
                        :value="item.belongingOrganizationLeader"
                        :title="$t('assets.asset.field.belongingOrganizationLeader')"
                      />
                      <br />
                      <tiny-link
                        style="font-size: 11px; margin: 5px"
                        type="primary"
                        :underline="false"
                        :value="item.belongingOrganizationContactInfo"
                        :title="$t('assets.asset.field.belongingOrganizationContactInfo')"
                      />

                      <template #reference>
                        <tiny-link
                          class="source-text-link"
                          type="primary"
                          :underline="false"
                          :icon="iconTelephone()"
                          :value="getOrgName(item.belongingOrganizationId)"
                        />
                      </template>
                    </tiny-popover>
                  </tiny-col>
                </tiny-row>
              </tiny-layout>
            </template>
            <template #footer>
              <tiny-button
                v-if="item.assetFormatClassification === 1"
                type="info"
                :icon="dataSource"
                circle
                size="mini"
                :title="$t('assets.asset.look.database.resources')"
                :disabled="!item.isPurview"
                @click="openDataAssetsForm(item, 'source')"
              />
              <tiny-button
                v-if="item.assetFormatClassification === 2"
                type="info"
                :icon="editorVideo"
                circle
                size="mini"
                :title="$t('assets.asset.look.video.resources')"
                :disabled="!item.isPurview"
                @click="openDataAssetsForm(item, 'source')"
              />
              <tiny-button
                v-if="item.assetFormatClassification === 3"
                type="info"
                :icon="files"
                circle
                size="mini"
                :title="$t('assets.asset.look.file.resources')"
                :disabled="!item.isPurview"
                @click="openDataAssetsForm(item, 'source')"
              />

              <tiny-button
                type="primary"
                :icon="iconEyeopen()"
                circle
                size="mini"
                :title="$t('assets.asset.look.info')"
                @click="openDataAssetsForm(item, 'look')"
              />
            </template>
          </tiny-card>
        </div>
        <div v-if="dataAssetsList.length === 0">
          <tiny-chart-line :data-empty="true"></tiny-chart-line>
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
  </div>

  <div>
    <tiny-drawer
      :title="dataAssetsFormTitle"
      :visible="dataAssetsFormDrawer"
      @update:visible="dataAssetsFormDrawer = $event"
      :show-header="true"
      :mask-closable="false"
      width="50%"
      @close="closeDataAssetsForm(false)"
    >
      <div>
        <suspense>
          <DamMaintenanceForm
            :dataAssetsFormData="dataAssetsFormData"
            :formDisabled="formDisabled"
            :formHidden="formHidden"
            :formType="formType"
            :db-disabled="dbDisabled"
          ></DamMaintenanceForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { find, isEmpty } from 'lodash-es'
import { formPage } from '@/utils/tool'
import DamMaintenanceForm from '@/views/governance/data-asset/components/dam-maintenance-form.vue'
import { type DataAssetsParam, DataAssetsService } from '@/services/assets/asset'
import {
  iconAttachment,
  iconDataSource,
  iconEditorVideo,
  iconEyeopen,
  iconRadio,
  iconTelephone
} from '@opentiny/vue-icon'
import {
  type DataAssetsCategoryParam,
  DataAssetsCategoryService
} from '@/services/assets/asset-category'
import { SysOrgService } from '@/services/sys/sys-org'

const dataSource = iconDataSource()
const editorVideo = iconEditorVideo()
const files = iconAttachment()

const { t } = useI18n()
const searchValue = ref('')
const dataAssetsList = ref<DataAssetsParam[]>([])

const dataAssetsFormDrawer = ref(false)
const dataAssetsFormTitle = ref('')
const dataAssetsFormData = ref()
const orgList = ref()

const dataAssetsCategoryValue = ref(0)
const dataAssetsCategoryList = ref({
  data: [] as DataAssetsCategoryParam[]
})

onMounted(async () => {
  const result = await DataAssetsCategoryService.getList({})
  result.forEach((o) => {
    setParentName(o, t('assets.asset.category'))
  })
  dataAssetsCategoryList.value.data = result
  orgList.value = await SysOrgService.getList()
  search()
})

const filter = (value: any, data: any) => {
  if (!value) return true
  return data.name.includes(value)
}
const setParentName = (data: DataAssetsCategoryParam, parentName: string) => {
  data.pidName = parentName
  if (!isEmpty(data.children)) {
    data.children.forEach((c) => {
      setParentName(c, data.pidName + ' / ' + data.name)
    })
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
const search = () => {
  if (dataAssetsCategoryValue.value <= 0 && isEmpty(searchValue.value)) {
    dataAssetsList.value = []
    formPage.value.total = 0
    return
  }
  DataAssetsService.getPage({
    isStatistic: 1,
    model: {
      name: searchValue.value,
      categoryId: dataAssetsCategoryValue.value <= 0 ? 0 : dataAssetsCategoryValue.value,
      status: 2
    },
    page: formPage.value.page,
    limit: formPage.value.limit
  }).then((result) => {
    dataAssetsList.value = result.list
    formPage.value.total = result.total
  })
}

const dbDisabled = ref(false)
const formDisabled = ref(false)
const formHidden = ref(false)
const formType = ref()

const openDataAssetsForm = (row: any, typeValue: any) => {
  formDisabled.value = true
  formHidden.value = false
  dbDisabled.value = false
  formType.value = 'purview'
  if (typeValue == 'look') {
    dataAssetsFormTitle.value = t('common.operations.look')
  }

  if (typeValue == 'source') {
    dataAssetsFormTitle.value = t('assets.asset.look.resources')
    formHidden.value = true
    dbDisabled.value = true
    formType.value = 'source'
  }
  if (typeValue == 'purview') {
    dataAssetsFormTitle.value = t('assets.asset.look.purview')
    formHidden.value = true
  }
  if (isEmpty(row.categoryName)) {
    let category = find(dataAssetsCategoryList.value.data, { id: row.categoryId })
    if (!isEmpty(category)) {
      row.categoryName = category.pidName + ' / ' + category.name
    }
  }
  dataAssetsFormData.value = row
  dataAssetsFormDrawer.value = true
}

//抽屉关闭操作
const closeDataAssetsForm = (isUp: any) => {
  dataAssetsFormDrawer.value = false
}

//监听抽屉子组件的取消
emitter.on('closeDataAssetsForm', (isUp) => {
  closeDataAssetsForm(isUp)
})

const getOrgName = (id: number) => {
  const org = find(orgList.value, { id: id })
  if (!isEmpty(org)) {
    return org.name
  }
  return ''
}
</script>
<style scoped lang="less">
.card-wrap {
  float: left;
  margin: 10px;

  :deep(.tiny-card.tiny-card--default) {
    border-color: var(--ti-card-default-border-color);
    margin-bottom: 15px;
  }

  :deep(.tiny-card .tiny-card__body .tiny-card--logo .tiny-card--logo__title) {
    display: flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
  }

  :deep(.tiny-card .tiny-card__body .tiny-card--logo .tiny-card--logo__title--p) {
    font-size: var(--ti-card-title-font-size);
    font-weight: var(--ti-card-title-font-weight);
    margin-right: 8px;
    margin-bottom: 1px;
    line-height: 20px;
    //color: hsla(160, 100%, 37%, 1);
  }

  :deep(.tiny-card .tiny-card__footer .tiny-card__footer-footer) {
    padding: 5px 10px 5px 5px;
    border-top: 1px solid #dfdfdf;
    text-align: right;
  }

  :deep(.tiny-button.tiny-button--info) {
    color: var(--ti-button-info-text-color);
    fill: var(--ti-button-info-text-color);
    border-color: #b3a3f8;
    background-color: #b3a3f8;
  }

  :deep(.tiny-button.tiny-button--danger) {
    color: var(--ti-button-info-text-color);
    fill: var(--ti-button-info-text-color);
    border-color: #ed66ab;
    background-color: #ed66ab;
  }

  :deep(.tiny-button.tiny-button--primary) {
    color: var(--ti-button-info-text-color);
    fill: var(--ti-button-info-text-color);
    border-color: #52c41a;
    background-color: #52c41a;
  }

  :deep(
      .tiny-button.is-disabled,
      .tiny-button.is-disabled:active,
      .tiny-button.is-disabled:focus,
      .tiny-button.is-disabled:hover
    ) {
    color: var(--ti-button-primary-disabled-text-color);
    fill: var(--ti-button-primary-disabled-text-color);
    border-color: var(--ti-button-primary-disabled-border-color);
    background-color: var(--ti-button-primary-disabled-bg-color);
  }
}

.list-link {
  margin-left: 8px;
  font-size: 11px;
}

.span-font {
  font-size: 12px;
  color: #000000;
}

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
}

.contain-card {
  flex: 1 1 auto;
  background: #fff;
  height: calc(75vh - 100px);
  overflow-x: hidden;
  overflow-y: auto;
}

.grid-toolbar {
  margin: 10px 0;
  display: flex;

  :deep(.tiny-search .tiny-search__line) {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 60%;
    height: var(--ti-search-input-height);
    border: 1px solid var(--ti-search-input-border-color);
    border-radius: var(--ti-search-input-border-radius);
    background-color: var(--ti-search-input-bg-color);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-collapse: separate;
    margin-left: 10px;
  }
}

.source {
  margin-top: 10px;
  text-align: center;
}

.source-text {
  margin-top: 10px;
  padding-left: 15px;

  :deep(.tiny-link .tiny-link-svg) {
    margin-right: 3px;
    margin-left: 0;
  }
}

.source-text-link {
  font-size: 11px;
  margin-left: 10px;
}
</style>

<style>
.popover-cls {
}

.select-cls {
}

.popover-cls .tiny-popover__title {
  font-size: 11px !important;
}

.select-cls .tiny-tree-node__label {
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.select-cls .tiny-tree__empty-text {
  font-size: 12px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  color: var(--ti-tree-empty-text-color);
}
</style>
