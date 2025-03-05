<template>
  <div class="container-list">
    <slot name="breadcrumb"></slot>
    <div class="contain">
      <tiny-grid :data="dataSecurityConfigList" :fit="true" size="small" auto-resize border :stripe="true"
                 show-header-overflow="tooltip" show-overflow="tooltip"
                 highlight-hover-row max-height="85%">
        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search @search="search" @clear="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>
            <div>
              <tiny-button type="primary" @click="openDataSecurityConfigForm(null, 'add')">{{
                  $t('common.operations.add') }}
              </tiny-button>
            </div>
          </div>
        </template>

        <tiny-grid-column field="id" :title="$t('common.id')" width="50"></tiny-grid-column>
        <tiny-grid-column field="name"
                          :title="type === 'Crypto' ? t('security.config.field.crypto.name') : t('security.config.field.desensitize.name')">
        </tiny-grid-column>

        <tiny-grid-column :title="$t('security.level.field.sensitiveLevel')">
          <template v-slot="data">
            {{ findValue(levelData, data.row.levelId, 'id', 'sensitiveName') }}
          </template>
        </tiny-grid-column>

        <tiny-grid-column field="support.supportName"
                          :title="type === 'Crypto' ? t('security.config.field.crypto.method') : t('security.config.field.desensitize.method')"></tiny-grid-column>

        <tiny-grid-column field="describe"
                          :title="type === 'Crypto' ? t('security.config.field.crypto.describe') : t('security.config.field.desensitize.describe')"></tiny-grid-column>

        <tiny-grid-column field="remark"
                          :title="$t('security.config.field.remark')"></tiny-grid-column>

        <tiny-grid-column :title="$t('common.operations.status')">
          <template v-slot="data">
            <span v-if="data.row.status === 0">{{ $t('common.operations.status.new') }}</span>
            <span v-if="data.row.status === 1">{{ $t('common.operations.status.underReview') }}</span>
            <span v-if="data.row.status === 2">{{ $t('common.operations.status.published') }}</span>
            <span v-else></span>
          </template>
        </tiny-grid-column>

        <tiny-grid-column :title="$t('common.operations')" width="200" align="center">
          <template v-slot="data">
            <a v-if="data.row.status === 0" @click="deleteDataSecurityConfigData(data.row.id)">
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
            <a @click="openDataSecurityConfigForm(data.row, 'update')">
              {{ data.row.status === 0 ? t('common.operations.update') : t('common.operations.look') }}
            </a>
          </template>
        </tiny-grid-column>
      </tiny-grid>
    </div>
  </div>

  <div>
    <tiny-drawer :title="dataSecurityConfigFormTitle"
                 :visible="dataSecurityConfigFormDrawer"
                 @update:visible="dataSecurityConfigFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeDataSecurityConfigForm(false)">
      <div>
        <suspense>
          <ScmConfigForm :dataSecurityConfigFormData="dataSecurityConfigFormData"
                         :support="support"
                         :level-data="levelData"
                         :security-supports="supportModels"
                         :support-models="supportModel"></ScmConfigForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { assign, cloneDeep, find } from 'lodash-es'
import { Modal } from '@opentiny/vue'
import ScmConfigForm from '@/views/governance/data-security/components/scm-config-form.vue'
import { SecurityService } from '@/services/spi/security'
import { DataSecurityLevelService } from '@/services/governance/security-level'
import { findValue } from '@/utils/tool'


const { t } = useI18n()
const searchValue = ref('')
const dataSecurityConfigList = ref()
const type = defineModel('type', { default: 'Crypto' })
const levelData = ref()
const securityData = ref()
const supportModels = ref()
const supportModel = ref()
const support = ref()

const dataSecurityConfigFormDrawer = ref(false)
const dataSecurityConfigFormTitle = ref('')
const dataSecurityConfigFormData = ref()
const dataSecurityConfigFormDataCopy = ref()

const search = async () => {
  dataSecurityConfigList.value = await SecurityService.getBySecurityType({
    securityType: type.value,
    name: searchValue.value
  })
}

const openDataSecurityConfigForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    dataSecurityConfigFormTitle.value = t('common.text.add.data')
    dataSecurityConfigFormData.value = {
      id: 0,
      status: 0,
      securityType: type.value,
      support: {
        supportType: '',
        supportName: '',
        description: '',
        supportFieldModels: []
      }
    }
  } else {
    dataSecurityConfigFormTitle.value = t('common.text.update.data')
    dataSecurityConfigFormData.value = row
    dataSecurityConfigFormDataCopy.value = cloneDeep(row)
  }
  support.value = dataSecurityConfigFormData.value.support
  supportModel.value = dataSecurityConfigFormData.value.support.supportFieldModels
  dataSecurityConfigFormDrawer.value = true
}

const deleteDataSecurityConfigData = (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await SecurityService.deleteById(id)
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      await search()
    }
  })
}

const handleStatus = (row: any, newStatus: number, message: string) => {
  Modal.confirm(message).then(async (res: string) => {
    if (res === 'confirm') {
      row.status = newStatus
      await SecurityService.save(row)
      await search()
    }
  })
}

const closeDataSecurityConfigForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(dataSecurityConfigFormData.value, dataSecurityConfigFormDataCopy.value)
  }
  dataSecurityConfigFormDrawer.value = false
}

emitter.on('closeDataSecurityConfigForm', (isUp) => {
  closeDataSecurityConfigForm(isUp)
})

onMounted(async () => {
  levelData.value = await DataSecurityLevelService.getList({ model: {} })
  securityData.value = await SecurityService.getPlugin()
  let f:any = find(securityData.value, { securityType: type.value })
  supportModels.value = f.supportModels
  await search()
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
