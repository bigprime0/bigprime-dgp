<template>
  <div class="card-wrap" v-for="item in sysFileStorageConfigList" :key="item.id">
    <tiny-card size="small"
               :status="item.isDefaultStorage === 1 ? 'success' : ''"
               :title="$t(findDescribe(fileStorageEnums, item.storageType))"
               type="image"
               :src="getImgSrc(item.storageType)">
      <template #title-left>
        <IconFileCloudUpload class="left-icon" v-if="item.storageType === 'LOCAL'" />
        <IconFileUpload class="left-icon" v-else />
      </template>

      <template #footer>
        <div class="tool">
          <tiny-link type="success" :underline="false" :icon="IconEdit" @click="openSysFileStorageConfigForm(item)">
            {{ t('common.operations.update')
            }}
          </tiny-link>

          <tiny-popover trigger="hover"
                        :title="$t('file.storage.field.isDefaultStorage')"
                        :content="$t('file.storage.field.isDefaultStorage.content')">
            <template #reference>
              <tiny-switch v-model="item.isDefaultStorage"
                           :true-value=1
                           :false-value=0
                           show-text
                           :before-change="defaultStorageBeforeChange"
                           @change="defaultStorageChange(item)"
                           :disabled="item.isDefaultStorage === 1">
                <template #open>
                  <span>{{ $t('common.prompt.yes') }}</span>
                </template>
                <template #close>
                  <span>{{ $t('common.prompt.no') }}</span>
                </template>
              </tiny-switch>
            </template>
          </tiny-popover>
        </div>
      </template>
    </tiny-card>
  </div>

  <div>
    <tiny-drawer :title="$t('common.text.update.data')"
                 :visible="sysFileStorageConfigFormDrawer"
                 @update:visible="sysFileStorageConfigFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeSysFileStorageConfigForm(false)">
      <div>
        <suspense>
          <DataForm :sysFileStorageConfigFormData="sysFileStorageConfigFormData"></DataForm>
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
import { findDescribe, type SelectModel } from '@/utils/tool'
import DataForm from '@/views/sys/cfg/components/file-storage-form.vue'
import { type SysFileStorageConfigParam, SysFileStorageConfigService } from '@/services/sys/sys-file-storage'
import { iconEdit, iconFileCloudupload, iconFileupload } from '@opentiny/vue-icon'
import { CurrencyService } from '@/services/currency/currency'

const IconEdit = iconEdit()
const IconFileCloudUpload = iconFileCloudupload()
const IconFileUpload = iconFileupload()

const { t } = useI18n()
const sysFileStorageConfigList = ref<SysFileStorageConfigParam[]>()

const sysFileStorageConfigFormDrawer = ref(false)
const sysFileStorageConfigFormData = ref<SysFileStorageConfigParam>()
const sysFileStorageConfigFormDataCopy = ref()
const fileStorageEnums = ref<SelectModel[]>()

onMounted(async () => {
  fileStorageEnums.value = await CurrencyService.getEnum('FileStorageEnum')
  await search()
})

//搜索查询
const search = async () => {
  sysFileStorageConfigList.value = await SysFileStorageConfigService.getList({})
}

//打开form表单
const openSysFileStorageConfigForm = (row: any) => {
  sysFileStorageConfigFormData.value = row
  sysFileStorageConfigFormDataCopy.value = cloneDeep(row)
  sysFileStorageConfigFormDrawer.value = true
}

const defaultStorageChange = async (data: any) => {
  await SysFileStorageConfigService.save(data)
  await search()
}

const defaultStorageBeforeChange = (done: any) => {
  Modal.confirm(t('common.prompt.open.default')).then(async (res: string) => {
    if (res === 'confirm') {
      done()
    }
  })
}

//抽屉关闭操作
const closeSysFileStorageConfigForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    //还原数据
    assign(sysFileStorageConfigFormData.value, sysFileStorageConfigFormDataCopy.value)
  }
  sysFileStorageConfigFormDrawer.value = false
}

//监听抽屉子组件的取消
emitter.on('closeSysFileStorageConfigForm', (isUp) => {
  closeSysFileStorageConfigForm(isUp)
})

const getImgSrc = (storageType : any) => {
  if(storageType === 'LOCAL'){
    return "/svgs/Local.jpeg";
  }
  if(storageType === 'QINIU'){
    return "/svgs/Qiniu.jpg";
  }
}

</script>

<style scoped lang="less">

.card-wrap {
  float: left;
  margin: 20px 0 0 20px;

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
}
.left-icon {
  margin-right: 5px;
  margin-top: 3px;
  //fill: hsla(160, 100%, 37%, 1);
}


.tool {
  float: right;
  font-size: var(--ti-card-title-font-size);
  margin: auto 10px 10px auto;

  :deep(.tiny-switch) {
    margin-left: 15px;
  }

  :deep(.tiny-link) {
    margin-left: 10px;
  }

  :deep(.tiny-link .tiny-link-svg) {
    margin-right: 1px;
    margin-top: 2px;
  }

  :deep(.tiny-link.tiny-link--success:hover) {
    color: hsla(160, 100%, 37%, 1);
    fill: hsla(160, 100%, 37%, 1);
  }

  //:deep(.tiny-link.tiny-link--warning:hover) {
  //  color: var(--ti-link-danger-text-color);
  //  fill: var(--ti-link-danger-text-color);
  //}



}
</style>
