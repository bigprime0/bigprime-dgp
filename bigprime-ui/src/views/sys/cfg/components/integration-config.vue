<template>
  <div class="container-list">
    <tiny-grid :data="configData" ref="configGridRef" :fit="true"
               show-header-overflow="tooltip" show-overflow="tooltip"
               size="small" border :stripe="true" highlight-hover-row>
      <template #toolbar>
        <div class="grid-toolbar">
          <tiny-form :inline="true" label-suffix="：" ref="condFormRef"
                     overflow-title
                     :model="condFormData" :rules="condFormRules" label-width="100px">
            <!--选择产品-->
            <tiny-form-item :label="$t('sys.cfg.integration.gridCol.product')" :show-message="false" prop="product">
              <tiny-select v-model="condFormData.cProduct" @change="productChange">
                <tiny-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value">
                </tiny-option>
              </tiny-select>
            </tiny-form-item>

            <!--适用数据库产品-->
            <tiny-form-item :label="$t('sys.cfg.integration.qdb')" :show-message="false" prop="cDatabase">
              <tiny-select v-model="condFormData.cDatabase" clearable>
                <tiny-option v-for="item in DatabaseOptions" :key="item.value" :label="item.label" :value="item.value">
                </tiny-option>
              </tiny-select>
            </tiny-form-item>

            <!--过滤产品适用版本-->
            <tiny-form-item :label="$t('sys.cfg.integration.gridCol.category')" :show-message="false" prop="cCategory">
              <tiny-select v-model="condFormData.cCategory" clearable :show-alloption="false">
                <tiny-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
                </tiny-option>
              </tiny-select>
            </tiny-form-item>

            <tiny-form-item>
              <tiny-button type="primary" @click="handleQuery">{{ $t('common.operations.query') }}</tiny-button>
              <tiny-button type="primary" @click="handleAddConfig">{{ $t('common.operations.add') }}</tiny-button>
              <tiny-button type="primary" @click="handleCloneConfig">{{ $t('common.operations.clone') }}</tiny-button>
            </tiny-form-item>
          </tiny-form>
        </div>
      </template>
      <tiny-grid-column field="id" :title="$t('common.id')" width="50"></tiny-grid-column>
      <tiny-grid-column field="product" :title="$t('sys.cfg.integration.gridCol.product')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="dbType" :title="$t('sys.cfg.integration.qdb')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="category" :title="$t('sys.cfg.integration.gridCol.category')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="subCategory" :title="$t('sys.cfg.integration.gridCol.subCategory')" show-overflow></tiny-grid-column>
<!--      <tiny-grid-column field="applicableVersion" :title="$t('sys.cfg.integration.gridCol.applicableVersion')" show-overflow></tiny-grid-column>-->
      <tiny-grid-column field="label" :title="$t('sys.cfg.integration.gridCol.label')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="realLabel" :title="$t('sys.cfg.integration.gridCol.key')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="title" :title="$t('sys.cfg.integration.gridCol.title')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="valueType" :title="$t('sys.cfg.integration.gridCol.ValueType')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="defaultValue" :title="$t('sys.cfg.integration.gridCol.defaultValue')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="isRequired" :title="$t('sys.cfg.integration.gridCol.isRequired')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="compType" :title="$t('sys.cfg.integration.gridCol.compType')" show-overflow></tiny-grid-column>
      <tiny-grid-column field="compConfig" :title="$t('sys.cfg.integration.gridCol.compConfig')" show-overflow></tiny-grid-column>
      <tiny-grid-column :title="$t('common.operations')" width="100" align="center">
        <template v-slot="data">
          <a @click="handleRowDelete(data.row.id)">
            {{ t('common.operations.delete') }}
          </a>
          <a @click="handleRowUpdate(data.row)">
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

    <!--抽屉-->
    <tiny-drawer :title="drawConfig.title"
                 :visible="drawConfig.visible"
                 @update:visible="drawConfig.visible = $event"
                 :show-header="true"
                 :mask-closable="false"
                 :width="drawConfig.width"
                 @close="drawConfig.handleDrawerClose">
      <div>
        <suspense>
          <IntegrationForm :key="nanoid(8)" ref="drawFormRef" :drawFormData="drawFormData" :DatabaseOptions="DatabaseOptions"></IntegrationForm>
        </suspense>
      </div>
    </tiny-drawer>

    <tiny-dialog-box
      :visible="boxConfig.visible"
      @update:visible="boxConfig.visible = $event"
      resize
      max-height="300"
      :title="boxConfig.title"
      width="30%"
      :is-form-reset="false"
    >
      <tiny-form :model="boxFormData" label-width="100px" overflow-title label-position="top">
        <tiny-form-item :label="$t('sys.cfg.integration.qdb')" :show-message="false" prop="cDatabase">
          <tiny-select v-model="boxFormData.nDatabase">
            <tiny-option v-for="item in DatabaseOptions" :key="item.value" :label="item.label" :value="item.value">
            </tiny-option>
          </tiny-select>
        </tiny-form-item>
        <tiny-form-item>
          <tiny-checkbox v-model="boxFormData.isOverlay" disabled="true" name="tiny-checkbox">{{ t('sys.cfg.integration.box.isOverlay') }}</tiny-checkbox>
        </tiny-form-item>
      </tiny-form>
      <template #footer>
        <tiny-button type="primary"
                     :loading="btnSubmit.loading"
                     @click="handleCloneSubmit">
          {{ btnSubmit.text[btnSubmit.loading] }}
        </tiny-button>
      </template>
    </tiny-dialog-box>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formPage } from '@/utils/tool'
import IntegrationForm from '@/views/sys/cfg/components/integration-form.vue'
import { CompTypeEnum, type IntegrationConfigType, ValueTypeEnum } from '@/views/sys/cfg/types/integrationType'
import { nanoid } from 'nanoid'
import { SysCfgService } from '@/services/sys/sys-config'
import { Modal, Notify } from '@opentiny/vue'
import emitter from '@/utils/evnetbus'
import { isEmpty } from 'lodash-es'

const { t } = useI18n()
const configData = ref({})
const categoryOptions = ref([
  { label: 'global', value: 'global', group: 'seatunnel' },
  { label: 'env', value: 'env', group: 'seatunnel' },
  { label: 'source', value: 'source', group: 'seatunnel' },
  { label: 'transform', value: 'transform', group: 'seatunnel' },
  { label: 'sink', value: 'sink', group: 'seatunnel' }
])
const categoryList = ref([
  { label: 'global', value: 'global', group: 'seatunnel' },
  { label: 'env', value: 'env', group: 'seatunnel' },
  { label: 'source', value: 'source', group: 'seatunnel' },
  { label: 'transform', value: 'transform', group: 'seatunnel' },
  { label: 'sink', value: 'sink', group: 'seatunnel' },
  { label: 'global', value: 'global', group: 'datax' },
  { label: 'setting', value: 'setting', group: 'datax' },
  { label: 'reader', value: 'reader', group: 'datax' },
  { label: 'writer', value: 'writer', group: 'datax' }
])
const productChange = () => {
  categoryOptions.value = categoryList.value.filter(item => item.group === condFormData.value.cProduct)
  DatabaseOptions.value = DatabaseAllOptions.value.filter(item => item.product == condFormData.value.cProduct)
  drawFormData.value.category = ''
}
const condFormRef = ref()
const condFormRules = ref({})
const condFormData = ref({
  cProduct: 'seatunnel',
  cDatabase: '',
  cCategory: ''
})
const boxFormData = ref({
  nDatabase: '',
  isOverlay: true
})
const drawConfig = ref({
  title: '',
  visible: false,
  width: '55%',
  handleDrawerClose: () => {
    drawConfig.value.visible = false
  }
})
const boxConfig = ref({
  title: '',
  visible: false
})
const btnSubmit:any = ref({
  loading: false,
  text: {
    true: t('common.operations.submiting'),
    false: t('common.operations.confirm')
  }
})
const drawFormRef = ref()
const drawFormData = ref<IntegrationConfigType>({
  id: 0,
  product: 'seatunnel',
  category: '',
  subCategory: '',
  applicableVersion: '',
  dbType: '',
  label: '',
  realLabel: '',
  title: '',
  descr: '',
  valueType: ValueTypeEnum.text,
  defaultValue: '',
  isRequired: 0,
  compType: CompTypeEnum.textInput,
  compConfig: '',
  compConfigJson: null,
  seq: 0,
  isAdvanced: 0
})

onMounted(() => {
  handleQuery()
})

const pageChange = (page: number) => {
  formPage.value.page = page
  handleQuery()
}

const limitChange = (limit: number) => {
  formPage.value.limit = limit
  handleQuery()
}

const productOptions = ref([
  { label: 'seatunnel', value: 'seatunnel' },
  { label: 'datax', value: 'datax' }
])

const DatabaseOptions = ref([
  { label: 'jdbc', value: 'jdbc', product: 'seatunnel' },
  { label: 'mysql-cdc', value: 'mysql-cdc', product: 'seatunnel' }
])

const DatabaseAllOptions = ref([
  { label: 'rdbms', value: 'rdbms', product: 'datax' },
  { label: 'jdbc', value: 'jdbc', product: 'seatunnel' },
  { label: 'mysql-cdc', value: 'mysql-cdc', product: 'seatunnel' }
])


const handleQuery = async () => {
  const result = await SysCfgService.pageList({
    product: condFormData.value.cProduct,
    dbType: condFormData.value.cDatabase,
    category: condFormData.value.cCategory,
    page: formPage.value.page,
    limit: formPage.value.limit
  })
  configData.value = result.list
  formPage.value.total = result.total
}

const handleAddConfig = () => {
  drawConfig.value.title = t('sys.cfg.integration.draw.add')
  drawConfig.value.visible = true
  drawFormData.value = {
    id: 0,
    product: condFormData.value.cProduct,
    dbType: condFormData.value.cDatabase,
    category: condFormData.value.cCategory,
    subCategory: '',
    applicableVersion: '',
    label: '',
    realLabel: '',
    title: '',
    descr: '',
    valueType: ValueTypeEnum.text,
    defaultValue: '',
    compType: CompTypeEnum.textInput,
    compConfig: '',
    compConfigJson: null,
    seq: 0,
    isRequired: 0,
    isAdvanced: 0
  }
}

const handleRowDelete = async (id: number) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await SysCfgService.deleteById(id)
      Notify({
        type: 'success',
        message: t('common.prompt.delete.success'),
        position: 'top-right',
        duration: 1000
      })
      await handleQuery()
    }
  })
}

const handleRowUpdate = (row: any) => {
  drawConfig.value.title = t('sys.cfg.integration.draw.update')
  drawConfig.value.visible = true
  drawFormData.value = row
}

const handleDrawerClose = () => {
  drawConfig.value.visible = false
}

const handleCloneConfig = () => {
  if (isEmpty(condFormData.value.cProduct)) {
    Modal.message({
      message: t('sys.cfg.integration.clone.valid.miss.product'),
      status: 'error'
    })
    return
  } else if (isEmpty(condFormData.value.cDatabase)) {
    Modal.message({
      message: t('sys.cfg.integration.clone.valid.miss.dbType'),
      status: 'error'
    })
    return
  } else if (isEmpty(condFormData.value.cCategory)) {
    Modal.message({
      message: t('sys.cfg.integration.clone.valid.miss.category'),
      status: 'error'
    })
    return
  } else {
    boxConfig.value.title = t('sys.cfg.integration.box.title')
    boxConfig.value.visible = true
  }


}

const handleCloneSubmit = async () => {
  btnSubmit.value.loading = true
  const result = await SysCfgService.cloneIntegration({
    product: condFormData.value.cProduct,
    dbType: condFormData.value.cDatabase,
    category: condFormData.value.cCategory,
    newType: boxFormData.value.nDatabase,
    isOverlay: boxFormData.value.isOverlay
  })
  if (result.key) {
    Modal.message({
      message: t('common.prompt.clone.success'),
      status: 'success'
    })
    btnSubmit.value.loading = false
    boxConfig.value.visible = false
    condFormData.value.cDatabase = ''
  } else {
    Modal.message({
      message: t('common.prompt.clone.fail'),
      status: 'error'
    })
  }
}

emitter.on('drawerCancel', handleDrawerClose)
emitter.on('handleQuery', handleQuery)

</script>

<style scoped lang="less">
.grid-toolbar {
  //:deep(.tiny-select) {
  //  width: 300px;
  //}
}
</style>

