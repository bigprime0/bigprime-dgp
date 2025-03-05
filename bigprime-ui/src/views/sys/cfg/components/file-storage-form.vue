<template>
  <div class="ds-form">
    <tiny-form ref="sysFileStorageConfigFormRef" :model="sysFileStorageConfigFormData"
               overflow-title
               :rules="sysFileStorageConfigFormRules" label-width="100px">
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('file.storage.field.config.domainName')">
            <tiny-input v-model="sysFileStorageConfigFormData.config.domainName"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row v-if="sysFileStorageConfigFormData.storageType === 'QINIU'">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('file.storage.field.config.accessKey')">
            <tiny-input v-model="sysFileStorageConfigFormData.config.accessKey"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('file.storage.field.config.secretKey')">
            <tiny-input v-model="sysFileStorageConfigFormData.config.secretKey"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row v-if="sysFileStorageConfigFormData.storageType === 'QINIU'">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('file.storage.field.config.bucket')">
            <tiny-input v-model="sysFileStorageConfigFormData.config.bucket"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>


      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeSysFileStorageConfigForm(false)">
          {{ $t('common.operations.cancel') }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveSysFileStorageConfigData">
          {{ $t('common.operations.save') }}
        </tiny-button>
      </tiny-row>
    </tiny-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { type SysFileStorageConfigParam, SysFileStorageConfigService } from '@/services/sys/sys-file-storage'


const { t } = useI18n()
const sysFileStorageConfigFormRef = ref()
const sysFileStorageConfigFormData = defineModel('sysFileStorageConfigFormData', { default: {
   config: {}
  } as SysFileStorageConfigParam })

const sysFileStorageConfigFormRules = computed(() => {
  let ruleList = {}
  return ruleList
})

const saveSysFileStorageConfigData = () => {
  sysFileStorageConfigFormRef.value
    .validate()
    .then(async () => {
      sysFileStorageConfigFormData.value.configJson = JSON.stringify(sysFileStorageConfigFormData.value.config)
      await SysFileStorageConfigService.save(sysFileStorageConfigFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeSysFileStorageConfigForm(true)
    })
}

const closeSysFileStorageConfigForm = (isUp: boolean) => {
  emitter.emit('closeSysFileStorageConfigForm', isUp)
}
</script>

<style scoped lang="less">
.span-font {
  font-size: 12px;
  color: #000000;
}

.ds-form {
  padding: 10px;

  :deep(.container-form) {
    margin-top: 0;
    padding: 20px 15px 15px 15px;
    border-radius: 0;
    box-shadow: 0 0 2px 2px #eee;
    height: 100vh - 80px;
    height: calc(100vh - 130px);
  }
}
</style>
