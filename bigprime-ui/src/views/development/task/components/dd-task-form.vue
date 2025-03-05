<template>
  <div class="ds-form">
    <tiny-form ref="flinkTaskFormRef" :model="flinkTaskFormData" :rules="flinkTaskFormRules" label-width="150px"
               overflow-title>
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('development.task.field.pidName')">
            <span style="color:#2c3e50;font-size: 13px;">{{ flinkTaskFormData.pidName }}</span>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('development.task.field.type')" prop="type" :show-message="false">
            <tiny-radio v-model='flinkTaskFormData.type' :label=0 :disabled="flinkTaskFormData.id > 0  || !isEmpty(flinkTaskFormData.children)">{{ $t('development.task.field.type.directory') }}</tiny-radio>
            <tiny-radio v-model='flinkTaskFormData.type' :label=1 :disabled="flinkTaskFormData.id > 0  || !isEmpty(flinkTaskFormData.children)">{{ $t('development.task.field.type.sql') }}</tiny-radio>
            <tiny-radio v-model='flinkTaskFormData.type' :label=2 :disabled="flinkTaskFormData.id > 0  || !isEmpty(flinkTaskFormData.children)">{{ $t('development.task.field.type.jar') }}</tiny-radio>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('development.task.field.name')" prop="name" :show-message="false">
            <tiny-input v-model="flinkTaskFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('development.task.field.summary')">
            <tiny-input type="textarea" v-model="flinkTaskFormData.summary" :rows=3 :maxlength="300"
            :autosize="{ minRows: 2, maxRows: 5 }" show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeFlinkTaskForm(false)"> {{ $t('common.operations.cancel') }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveFlinkTaskData"> {{ $t('common.operations.save') }}
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
import { FlinkTaskService } from '@/services/development/task'
import { isEmpty } from 'lodash-es'


const { t } = useI18n()
const flinkTaskFormRef = ref()
const flinkTaskFormData = defineModel('flinkTaskFormData', { default: {} as any })

const flinkTaskFormRules = computed(() => {
  let ruleList = {
    type: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const saveFlinkTaskData = () => {
  flinkTaskFormRef.value
    .validate()
    .then(async () => {
      await FlinkTaskService.save(flinkTaskFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeFlinkTaskForm(true)
    })
}

const closeFlinkTaskForm = (isUp: boolean) => {
  emitter.emit('closeFlinkTaskForm', isUp)
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
