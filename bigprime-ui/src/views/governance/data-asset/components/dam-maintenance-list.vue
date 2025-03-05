<template>
  <div class="container-list">
    <Breadcrumb class="svg-dir" :items="[pathName]" :IconLeft="IconFolderOpened" />
    <div class="contain">
      <div class="grid-toolbar">
        <tiny-search @search="search" @clear="search" v-model="searchValue"
                     :placeholder="$t('common.search.placeholder')"
                     is-enter-search clearable></tiny-search>
        <div>
          <tiny-button type="primary" @click="openDataAssetsForm(null, 'add')" :disabled="changeType.id <= 0">{{
              $t('common.operations.add') }}
          </tiny-button>
        </div>
      </div>
      <div class="card-wrap" v-for="item in dataAssetsList" :key="item.id">
        <tiny-card size="mini">
          <template #title-left>
          </template>
          <template #title>
            <tiny-link class="span-font" type="info" :underline="false"
                       :title="isEmpty(item.remark) ? item.name : item.remark">
              {{ item.name }}
            </tiny-link>
          </template>
          <template #title-right>
            <tiny-link v-if="item.status === 0" class="list-link" type="primary"
                       :underline="item.creator === userStore.userInfo.id"
                       @click="updateStatus(item,2,t('common.operations.status.publish.prompt'))"
                       :title="item.createTime"
                       :value="$t('common.operations.status.new')" />
            <tiny-link v-if="item.status === 1" class="list-link" type="warning"
                       :underline="item.creator === userStore.userInfo.id"
                       :title="$t('common.operations.status')"
                       :value="$t('common.operations.status.underReview')" />
            <tiny-link v-if="item.status === 2" class="list-link" type="success"
                       :underline="item.creator === userStore.userInfo.id"
                       @click="updateStatus(item,0,t('common.operations.status.unpublish.prompt'))"
                       :title="item.publishDate"
                       :value="$t('common.operations.status.published')" />
          </template>
          <template #default>
            <tiny-layout cols="3">
              <tiny-row>
                <tiny-col :span="1">
                  <tiny-user-head v-if="item.assetFormatClassification === 1" type="icon" round
                                  v-model="dataSource"
                                  class="source"
                                  :title="isEmpty(item.remark) ? item.name : item.remark"
                                  background-color="#a4d9c6" />
                  <tiny-user-head v-if="item.assetFormatClassification === 2" type="icon" round
                                  v-model="editorVideo"
                                  class="source"
                                  :title="isEmpty(item.remark) ? item.name : item.remark"
                                  background-color="#b8d9f9" />
                  <tiny-user-head v-if="item.assetFormatClassification === 3" type="icon" round
                                  v-model="files"
                                  class="source"
                                  :title="isEmpty(item.remark) ? item.name : item.remark"
                                  background-color="#2e86de" />
                </tiny-col>

                <tiny-col :span="2" class="source-text">
                  <tiny-popover trigger="hover" placement="right"
                                popper-class="popover-cls"
                                :title="$t('assets.asset.field.tag.info')">
                    <div v-for="tag in item.tagNameList" :key="tag" style="font-size: 11px;margin: 5px;">
                      <tiny-tag type="success" effect="plain">
                        {{ tag }}
                      </tiny-tag>
                    </div>
                    <template #reference>
                      <tiny-link class="source-text-link" type="primary"
                                 :underline="false"
                                 :icon="iconRadio()"
                                 :value="item.code" />
                    </template>
                  </tiny-popover>

                  <br />
                  <br />
                  <tiny-popover trigger="hover" placement="right"
                                popper-class="popover-cls"
                                :title="$t('assets.asset.provide.divider')">
                    <tiny-link style="font-size: 11px;margin: 5px" type="primary"
                               :underline="false"
                               :value="getOrgName(item.provideOrganizationId)"
                               :title="$t('assets.asset.field.provideOrganizationId')" />
                    <br />
                    <tiny-link style="font-size: 11px;margin: 5px" type="primary"
                               :underline="false"
                               :value="getOrgName(item.belongingOrganizationId)"
                               :title="$t('assets.asset.field.belongingOrganizationId')" />
                    <br />
                    <tiny-link style="font-size: 11px;margin: 5px" type="primary"
                               :underline="false"
                               :value="item.belongingOrganizationLeader"
                               :title="$t('assets.asset.field.belongingOrganizationLeader')" />
                    <br />
                    <tiny-link style="font-size: 11px;margin: 5px" type="primary"
                               :underline="false"
                               :value="item.belongingOrganizationContactInfo"
                               :title="$t('assets.asset.field.belongingOrganizationContactInfo')" />

                    <template #reference>
                      <tiny-link class="source-text-link" type="primary"
                                 :underline="false"
                                 :icon="iconTelephone()"
                                 :value="getOrgName(item.belongingOrganizationId)" />
                    </template>
                  </tiny-popover>
                </tiny-col>
              </tiny-row>
            </tiny-layout>
          </template>
          <template #footer>
            <tiny-button v-if="item.assetFormatClassification === 1" type="info" :icon="dataSource" circle size="mini"
                         :title="$t('assets.asset.look.database.resources')"
                         :disabled="!item.isPurview"
                         @click="openDataAssetsForm(item, 'source')" />
            <tiny-button v-if="item.assetFormatClassification === 2" type="info" :icon="editorVideo" circle size="mini"
                         :title="$t('assets.asset.look.video.resources')"
                         :disabled="!item.isPurview"
                         @click="openDataAssetsForm(item, 'source')" />
            <tiny-button v-if="item.assetFormatClassification === 3" type="info" :icon="files" circle size="mini"
                         :title="$t('assets.asset.look.file.resources')"
                         :disabled="!item.isPurview"
                         @click="openDataAssetsForm(item, 'source')" />

            <tiny-button type="success" :icon="iconTeams()" circle size="mini"
                         :title="$t('assets.asset.look.purview')"
                         @click="openDataAssetsForm(item, 'purview')"
                         :disabled="item.creator !== userStore.userInfo.id" />

            <tiny-button v-if="item.creator === userStore.userInfo.id && item.status === 0" type="primary"
                         :icon="iconEdit()" circle
                         size="mini"
                         :title="$t('common.operations.update')"
                         :disabled="item.creator !== userStore.userInfo.id"
                         @click="openDataAssetsForm(item, 'update')" />
            <tiny-button v-else type="primary" :icon="iconEyeopen()" circle
                         size="mini"
                         :title="$t('assets.asset.look.info')"
                         @click="openDataAssetsForm(item, 'look')" />

            <tiny-button type="warning" :icon="iconDel()" circle size="mini"
                         :title="$t('common.operations.delete')"
                         @click="deleteDataAssetsData(item.id)"
                         :disabled="item.creator !== userStore.userInfo.id || item.status !== 0" />
          </template>
        </tiny-card>
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
  <div>
    <tiny-drawer :title="dataAssetsFormTitle"
                 :visible="dataAssetsFormDrawer"
                 @update:visible="dataAssetsFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataAssetsForm(false)">
      <div>
        <suspense>
          <DamMaintenanceForm :dataAssetsFormData="dataAssetsFormData" :formDisabled="formDisabled"
                              :formHidden="formHidden" :formType="formType"
                              :db-disabled="dbDisabled"></DamMaintenanceForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { assign, cloneDeep, find, isEmpty } from 'lodash-es'
import { Modal, Notify } from '@opentiny/vue'
import DamMaintenanceForm from '@/views/governance/data-asset/components/dam-maintenance-form.vue'
import { type DataAssetsParam, DataAssetsService } from '@/services/assets/asset'
import type { DataAssetsCategoryParam } from '@/services/assets/asset-category'
import {
  iconAttachment,
  iconDataSource,
  iconDel,
  iconEdit,
  iconEditorVideo,
  iconEyeopen,
  iconFolderOpened,
  iconRadio,
  iconTeams,
  iconTelephone
} from '@opentiny/vue-icon'
import { useUserStore } from '@/store'
import { SysOrgService } from '@/services/sys/sys-org'
import { getNowDateTime } from '@/utils/date'

const dataSource = iconDataSource()
const editorVideo = iconEditorVideo()
const files = iconAttachment()

const { t } = useI18n()
const userStore = useUserStore()
const IconFolderOpened = iconFolderOpened()
const changeType = defineModel('changeType', { default: {} as DataAssetsCategoryParam })
const searchValue = ref('')
const dataAssetsList = ref()

const dataAssetsFormDrawer = ref(false)
const dataAssetsFormTitle = ref('')
const dataAssetsFormData = ref()
const dataAssetsFormDataCopy = ref()
const pathName = ref()
const orgList = ref()

const formPage = ref({
  total: 0,
  page: 1,
  limit: 8,
  pageSizes: [8, 16, 32, 64],
  align: 'right',// 可选值：['left', 'center', 'right']
  layout: 'total, prev, pager, next, jumper, sizes'
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
const search = () => {
  if (changeType.value.id <= 0) {
    dataAssetsList.value = []
    formPage.value.total = 0
  } else {
    DataAssetsService.getPage({
      isStatistic: 0,
      model: {
        name: searchValue.value,
        categoryId: changeType.value.id
      },
      page: formPage.value.page,
      limit: formPage.value.limit
    }).then(result => {
      dataAssetsList.value = result.list
      formPage.value.total = result.total
    })
  }
}

const dbDisabled = ref(false)
const formDisabled = ref(false)
const formHidden = ref(false)
const formType = ref()
//打开form表单
const openDataAssetsForm = (row: any, typeValue: any) => {
  formHidden.value = false
  dbDisabled.value = false
  formType.value = 'purview'
  if (typeValue == 'add') {
    formDisabled.value = false
    dataAssetsFormTitle.value = t('common.text.add.data')
    dataAssetsFormData.value = {
      id: 0,
      categoryId: changeType.value.id,
      categoryName: pathName.value,
      tagNameList: [],
      status: 0,
      purviewType: 1,
      assetFormatClassification: 1
    }
  } else {
    formDisabled.value = row.creator !== userStore.userInfo.id
    if (typeValue == 'look') {
      dataAssetsFormTitle.value = t('common.operations.look')
      formDisabled.value = true
    } else {
      dataAssetsFormTitle.value = t('common.text.update.data')
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
    row.categoryName = pathName.value
    dataAssetsFormData.value = row
    dataAssetsFormDataCopy.value = cloneDeep(row)
  }
  dataAssetsFormDrawer.value = true
}

const deleteDataAssetsData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await DataAssetsService.deleteById(id)
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

//抽屉关闭操作
const closeDataAssetsForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    //还原数据
    assign(dataAssetsFormData.value, dataAssetsFormDataCopy.value)
  }
  dataAssetsFormDrawer.value = false
}

//监听抽屉子组件的取消
emitter.on('closeDataAssetsForm', (isUp) => {
  closeDataAssetsForm(isUp)
})

const updateStatus = (row: DataAssetsParam, newStatus: number, message: string) => {
  if (row.creator !== userStore.userInfo.id) {
    return
  }
  Modal.confirm(message).then(async (res: string) => {
    if (res === 'confirm') {
      row.status = newStatus
      if (row.status === 2) {
        row.publishDate = getNowDateTime()
      } else if (row.status === 0) {
        row.publishDate = ''
      }
      await DataAssetsService.save(row)
      search()
    }
  })
}

const getOrgName = (id: number) => {
  const org = find(orgList.value, { id: id })
  if (!isEmpty(org)) {
    return org.name
  }
  return ''
}

onMounted(async () => {
  orgList.value = await SysOrgService.getAll()
  search()
})

watchEffect(async () => {
  if (isEmpty(changeType.value.pidName)) {
    pathName.value = changeType.value.name
  } else {
    pathName.value = changeType.value.pidName + ' / ' + changeType.value.name
  }
  if (changeType.value.id > 0) {
    search()
  } else {
    dataAssetsList.value = []
    formPage.value.total = 0
  }
})

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
    .tiny-button.is-disabled:hover) {
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

  :deep(.tiny-breadcrumb .tiny-breadcrumb__item:last-child .tiny-breadcrumb__inner) {
    font-weight: 500;
    color: #2c3e50;
    text-decoration: none;
  }

  :deep(.container-breadcrumb) {
    font-size: 12px;
    margin: 5px 10px 0 10px;
  }
}

.contain {
  flex: 1 1 auto;
  background: #fff;
  height: 99%;
}

.grid-toolbar {
  display: flex;
  justify-content: left;
  width: calc(25vh + 100px);
  margin: 12px 0 12px 10px;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
    margin-top: -5px;
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

.svg-dir {
  fill: #ffcc41;
}
</style>

<style>
.popover-cls {

}

.popover-cls .tiny-popover__title {
  font-size: 11px !important;
}
</style>

