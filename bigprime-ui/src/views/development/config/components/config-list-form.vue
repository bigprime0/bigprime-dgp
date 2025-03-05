<template>
  <div class="ds-form">
    <tiny-form ref="flinkConfigFormRef" :model="flinkConfigFormData" :rules="flinkConfigFormRules" label-width="150px"
               overflow-title>
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('development.config.field.name')" prop="name" :show-message="false">
            <tiny-input v-model="flinkConfigFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>

        <tiny-col :span="6">
          <tiny-form-item :label="$t('development.config.field.flinkVersion')" prop="flinkVersion"
                          :show-message="false">
            <tiny-select clearable v-model="flinkConfigFormData.flinkVersion" :show-alloption="false">
              <tiny-option v-for="item in flinkPlugin" :key="item" :value="item">{{ item }}</tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('development.config.field.jobManagerAddress')" prop="jobManagerAddress" :show-message="false">
            <tiny-input v-model="flinkConfigFormData.jobManagerAddress"></tiny-input>
          </tiny-form-item>
        </tiny-col>

        <tiny-col :span="6">
          <tiny-form-item :label="$t('development.config.field.jobManagerPort')" prop="jobManagerPort" :show-message="false">
            <tiny-input type="number" v-model="flinkConfigFormData.jobManagerPort"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('development.config.field.summary')">
            <tiny-input type="textarea" v-model="flinkConfigFormData.summary" :rows=3 :maxlength="300"
                        :autosize="{ minRows: 2, maxRows: 5 }" show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('development.task.field.custom.config') }}
      </tiny-divider>
      <tiny-link class="link-add" @click="addCondition('','')" :underline="false" :icon="iconNode()"></tiny-link>
      <div v-if="!isEmpty(flinkConfigFormData.configs)" style="max-height: 260px;overflow: auto;">
        <div style="display: flex; margin: 10px 0 0 30px;" v-for="(item,index) in flinkConfigFormData.configs" :key="index">
          <span class="span-font">{{ $t('datasource.custom.attribute') }}</span>
          <tiny-input style="width: 40%;margin-left: 5px;" v-model="item.key"></tiny-input>
          <span class="span-font">{{ $t('datasource.custom.value') }}</span>
          <tiny-input style="width: 30%;margin-left: 5px;" v-model="item.value"></tiny-input>
          <tiny-link class="link-delete" @click="deleteCondition(item.key)" :underline="false"
                     :icon="iconNodeOpen()"></tiny-link>
          <br />
        </div>
      </div>

      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeFlinkConfigForm(false)"> {{ $t('common.operations.cancel') }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary"
                     v-loading.lock.fullscreen="saveLoading"
                     tiny-loading__background="rgba(0, 0, 0, 0.08)"
                     tiny-loading__size="large"
                     @click="saveFlinkConfigData"> {{ $t('common.operations.save') }}
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
import { FlinkConfigService } from '@/services/development/config'
import { iconNode, iconNodeOpen } from '@opentiny/vue-icon'
import { isEmpty, trim } from 'lodash-es'


const { t } = useI18n()
const flinkConfigFormRef = ref()
const flinkConfigFormData = defineModel('flinkConfigFormData', { default: {} as any })
const flinkPlugin = defineModel('flinkPlugin', { default: [] as any })

const flinkConfigFormRules = computed(() => {
  let ruleList = {
    jobManagerPort: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    jobManagerAddress: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    flinkVersion: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const addCondition = (key: any, value: any) => {
  flinkConfigFormData.value.configs.push({ key: key, value: value })
}

const deleteCondition = (key: any) => {
  flinkConfigFormData.value.configs = flinkConfigFormData.value.configs.filter(item => item.key !== key)
}

const convertConfigures = () => {
  let json: any = {}
  if (flinkConfigFormData.value.configs) {
    flinkConfigFormData.value.configs.forEach(o => {
      if (trim(o.key).length > 0 && trim(o.value).length > 0) {
        json[o.key] = o.value
      }
    })
  }
  flinkConfigFormData.value.configMap = json
}

const saveLoading = ref(false)
const saveFlinkConfigData = () => {
  flinkConfigFormRef.value
    .validate()
    .then(async () => {
      saveLoading.value = true
      convertConfigures()
      const result = await FlinkConfigService.save(flinkConfigFormData.value).catch(error => {
        saveLoading.value = false
      })
      saveLoading.value = false
      if (result) {
        Modal.message({
          message: t('common.prompt.save.success'),
          status: 'success'
        })
        closeFlinkConfigForm(true)
      } else {
        Modal.message({
          message: t('common.prompt.save.fail'),
          status: 'error'
        })
      }
    })
}

const closeFlinkConfigForm = (isUp: boolean) => {
  emitter.emit('closeFlinkConfigForm', isUp)
}
</script>

<style scoped lang="less">
.span-font {
  font-size: 13px;
  color: #2c3e50;
  margin-top: 2px;
  margin-left: 20px;
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

.link-add {
  margin-left: 50px;

  :deep(.tiny-link-svg) {
    --ti-link-svg-width: 1.4em;
    --ti-link-svg-height: 1.4em;
    fill: #1ac456;
  }
}

.link-delete {
  margin-left: 5px;

  :deep(.tiny-link-svg) {
    --ti-link-svg-width: 1.4em;
    --ti-link-svg-height: 1.4em;
    fill: #ee0808;
  }
}
</style>
