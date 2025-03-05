<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg','menu.dg.dg-scm', 'menu.dg.dg-scm.dg-scm-asset-encryption']" />
    <div class="contain">
      <tiny-grid :data="dataSecurityAssetsList" :fit="true" size="small" auto-resize border :stripe="true"
                 show-header-overflow="tooltip" show-overflow="tooltip"
                 highlight-hover-row max-height="85%">
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search @search="search" @clear="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>
            <div>
              <tiny-button type="primary" @click="openDataSecurityAssetsForm(null, 'add')">{{
                  $t('common.operations.add') }}
              </tiny-button>
            </div>
          </div>
        </template>

        <tiny-grid-column field="id" :title="$t('common.id')" width="50"></tiny-grid-column>

        <tiny-grid-column field="asset.code"
                          :title="$t('assets.asset.field.code')"></tiny-grid-column>

        <tiny-grid-column field="asset.name"
                          :title="$t('assets.asset.field.name')"></tiny-grid-column>

        <tiny-grid-column field="level.sensitiveName"
                          :title="$t('security.level.field.sensitiveLevel')"></tiny-grid-column>

        <tiny-grid-column field="crypto.name"
                          :title="$t('security.config.field.crypto.method')"></tiny-grid-column>

        <tiny-grid-column field="encryptionConditions"
                          :title="$t('security.asset.field.encryptionConditions')">
          <template v-slot="data">
            <span v-if="data.row.encryptionConditions === 1">{{ $t('security.asset.field.all.encrypted') }}</span>
            <span v-if="data.row.encryptionConditions === 2">{{ $t('security.asset.field.conditional.encryption')
              }}</span>
            <span v-else></span>
          </template>
        </tiny-grid-column>

        <tiny-grid-column field="remark"
                          :title="$t('security.asset.field.remark')"></tiny-grid-column>

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
            <a v-if="data.row.status === 0" @click="deleteDataSecurityAssetsData(data.row)">
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
            <a @click="openDataSecurityAssetsForm(data.row, 'update')">
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
    <tiny-drawer :title="dataSecurityAssetsFormTitle"
                 :visible="dataSecurityAssetsFormDrawer"
                 @update:visible="dataSecurityAssetsFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataSecurityAssetsForm(false)">
      <div>
        <suspense>
          <DataForm :dataSecurityAssetsFormData="dataSecurityAssetsFormData" :level-data="levelData"
                    :security-data="securityData"></DataForm>
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
import DataForm from '@/views/governance/data-security/components/scm-asset-encryption-form.vue'
import { DataSecurityAssetsService } from '@/services/governance/security-asset-encryption'
import { DataSecurityLevelService } from '@/services/governance/security-level'
import { SecurityService } from '@/services/spi/security'


const { t } = useI18n()
const searchValue = ref('')
const dataSecurityAssetsList = ref()

const dataSecurityAssetsFormDrawer = ref(false)
const dataSecurityAssetsFormTitle = ref('')
const dataSecurityAssetsFormData = ref()
const dataSecurityAssetsFormDataCopy = ref()

const levelData = ref()
const securityData = ref()

const search = async () => {
  const result = await DataSecurityAssetsService.getPage({
    model: {
      asset: {
        name: searchValue.value
      }
    },
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  dataSecurityAssetsList.value = result.list
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

const openDataSecurityAssetsForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    dataSecurityAssetsFormTitle.value = t('common.text.add.data')
    dataSecurityAssetsFormData.value = {
      id: 0, status: 0,
      asset: { id: 0, code: '', name: '', assetJson: '', categoryId: 0 },
      level: { id: 0, sensitiveName: '', sensitiveLevel: '' },
      crypto: { id: 0, name: '' }
    }
  } else {
    dataSecurityAssetsFormTitle.value = t('common.text.update.data')
    dataSecurityAssetsFormData.value = row
    dataSecurityAssetsFormDataCopy.value = cloneDeep(row)
  }
  dataSecurityAssetsFormDrawer.value = true
}

const handleStatus = (row: any, newStatus: number, message: string) => {
  Modal.confirm(message).then(async (res: string) => {
    if (res === 'confirm') {
      row.status = newStatus
      let asset:any = JSON.parse(row.asset.assetJson)
      if (newStatus === 2) {
        asset.cryptoId = row.cryptoId
      } else {
        asset.cryptoId = 0
      }
      row.asset.assetJson = JSON.stringify(asset)
      await DataSecurityAssetsService.save(row)
      await search()
    }
  })
}

const deleteDataSecurityAssetsData = (data: any) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      let asset:any = JSON.parse(data.asset.assetJson)
      asset.cryptoId = 0
      data.asset.assetJson = JSON.stringify(asset)
      await DataSecurityAssetsService.deleteData(data)
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      await search()
    }
  })
}

const closeDataSecurityAssetsForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(dataSecurityAssetsFormData.value, dataSecurityAssetsFormDataCopy.value)
  }
  dataSecurityAssetsFormDrawer.value = false
}

emitter.on('closeDataSecurityAssetsForm', (isUp) => {
  closeDataSecurityAssetsForm(isUp)
})

const initData = async () => {
  levelData.value = await DataSecurityLevelService.getList({ model: {} })
  securityData.value = await SecurityService.getSecuritySelect(t)
}

onMounted(() => {
  initData()
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
