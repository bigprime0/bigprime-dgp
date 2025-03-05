<template>
  <div class="ds-form">
    <tiny-form ref="schedulerJobFormRef" :model="schedulerJobFormData" :rules="schedulerJobFormRules"
               overflow-title
               label-width="100px" :disabled="fromDisabled">
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('scheduler.form.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('scheduler.job.field.group')">
            <tiny-select v-model="schedulerJobFormData.group" :placeholder="$t('scheduler.job.field.group')"
                         disabled>
              <tiny-option v-for="item in schedulerGroupEnums" :key="item.value" :label="$t(item.describe)"
                           :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>

        <tiny-col :span="6">
          <tiny-form-item :label="$t('scheduler.job.field.schedulerId')" :show-message="false" prop="schedulerId">
            <tiny-select v-model="schedulerJobFormData.schedulerId" clearable
                         :disabled="checkFieldDisabled('schedulerId')">
              <tiny-option v-for="item in schedulerList" :key="item.id" :label="$t(item.name)"
                           :value="item.id">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('scheduler.job.field.name')" :show-message="false" prop="name">
            <tiny-input v-model="schedulerJobFormData.name" :disabled="checkFieldDisabled('name')"></tiny-input>
          </tiny-form-item>
        </tiny-col>

        <tiny-col :span="3">
          <tiny-form-item :label="$t('scheduler.job.field.concurrent')">
            <tiny-switch v-model="schedulerJobFormData.concurrent" :true-value="1" :false-value="0"
                         :disabled="checkFieldDisabled('concurrent')"></tiny-switch>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="3">
          <tiny-form-item :label="$t('scheduler.job.field.status')">
            <tiny-switch v-model="schedulerJobFormData.status" :true-value="1" :false-value="0"
                         :disabled="checkFieldDisabled('status')"></tiny-switch>
          </tiny-form-item>
        </tiny-col>

      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('scheduler.job.field.actuator')" :show-message="false" prop="actuator">
            <tiny-select v-model="schedulerJobFormData.actuator"
                         :placeholder="$t('scheduler.job.field.group')"
                         :disabled="checkFieldDisabled('actuator')"
                         @change="changeRules"
                         clearable>
              <tiny-option v-for="item in schedulerActuatorEnums" :key="item.value" :label="$t(item.describe)"
                           :value="item.value">
              </tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('scheduler.job.field.cron')" :show-message="false" prop="cron">
            <tiny-input v-model="schedulerJobFormData.cron" :disabled="checkFieldDisabled('cron')">
              <template #append>
                <tiny-button :reset-time="500" type="primary" @click="openCron" :disabled="checkFieldDisabled('cron')">
                  {{ $t('common.operations.generate') }}
                </tiny-button>
              </template>
            </tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row v-if="schedulerJobFormData.actuator === 'DB'">
        <tiny-col :span="12">
          <tiny-form-item>
            <ActuatorDb ref="actuatorDbRef" :db-actuator-param-json="schedulerJobFormData.actuatorData" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <ActuatorSql v-if="schedulerJobFormData.actuator === 'SQL'"
                   ref="actuatorSqlRef"
                   :sql-actuator-param-json="schedulerJobFormData.actuatorData" />

      <tiny-row v-if="schedulerJobFormData.actuator === 'JAR' || schedulerJobFormData.actuator === 'PYTHON'">
        <tiny-col :span="12">
          <tiny-form-item>
            <ActuatorFile ref="actuatorFileRef" :file-actuator-param-json="schedulerJobFormData.actuatorData" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <ActuatorApi v-if="schedulerJobFormData.actuator === 'API'"
                   ref="actuatorApiRef"
                   :api-actuator-param-json="schedulerJobFormData.actuatorData" />

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('scheduler.job.field.executeClass')" :show-message="false" prop="executeClass">
            <tiny-input v-model="schedulerJobFormData.executeClass"
                        :disabled="checkFieldDisabled('executeClass')"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('scheduler.job.field.dataJson')">
            <monacoEditor height="200px"
                          v-model="schedulerJobFormData.dataJson"
                          language="json">
            </monacoEditor>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <br />
      <tiny-row style="text-align: center" v-if="!fromDisabled && showButton">
        <tiny-button plain type="primary" @click="closeSchedulerJobForm(false)"> {{ $t('common.operations.cancel') }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveSchedulerJobData"
                     v-loading.lock.fullscreen="saveLoading"
                     tiny-loading__background="rgba(0, 0, 0, 0.2)"
                     tiny-loading__size="large"> {{ $t('common.operations.save') }}
        </tiny-button>
      </tiny-row>
    </tiny-form>
  </div>
  <div>
    <tiny-drawer title="cron"
                 :visible="cronDrawer"
                 @update:visible="cronDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="cronDrawer = false">
      <div>
        <Cron :cronExpression="cronExpression" />
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watchEffect } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { type SchedulerJob, SchedulerJobService } from '@/services/scheduler/scheduler-job'
import { indexOf, isEmpty } from 'lodash-es'
import { type SchedulerParam, SchedulerService } from '@/services/scheduler/scheduler-config'
import { CurrencyService } from '@/services/currency/currency'
import type { SelectModel } from '@/utils/tool'
import ActuatorDb from '@/views/components/actuator/components/actuator-db.vue'
import ActuatorSql from '@/views/components/actuator/components/actuator-sql.vue'
import ActuatorApi from '@/views/components/actuator/components/actuator-api.vue'
import ActuatorFile from '@/views/components/actuator/components/actuator-file.vue'

const Cron = defineAsyncComponent(() => import('@/components/cron/index.vue'))

const { t } = useI18n()
const schedulerJobFormRef = ref()
const schedulerJobFormData = defineModel('schedulerJobFormData', { default: {} as SchedulerJob })
const schedulerGroupEnums = defineModel('schedulerGroupEnums', { default: [] as SelectModel[] })
const schedulerActuatorEnums = defineModel('schedulerActuatorEnums', { default: [] as SelectModel[] })
const schedulerList = defineModel('schedulerList', { default: [] as SchedulerParam[] })
const fieldDisabledList = defineModel('fieldDisabledList', { default: [] as string[] })
const fromDisabled = defineModel('fromDisabled', { default: false })
const showButton = defineModel('showButton', { default: true })
const cronDrawer = ref(false)
const cronExpression = ref()

const defaultRules = ref({
  name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
  schedulerId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
  actuator: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
  cron: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
  executeClass: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
})
const schedulerJobFormRules = ref(defaultRules.value)
const defaultExecuteClass = ref([
  'com.bigprime.quartz.task.actuator.impl.ApiActuatorImpl',
  'com.bigprime.quartz.task.actuator.impl.DbActuatorImpl',
  'com.bigprime.quartz.task.actuator.impl.JarActuatorImpl',
  'com.bigprime.quartz.task.actuator.impl.PythonActuatorImpl',
  'com.bigprime.quartz.task.actuator.impl.SqlActuatorImpl'
])

const changeRules = () => {
  //let rules = defaultRules.value as any
  if (schedulerJobFormData.value.actuator === 'API') {
    // rules['requestMethod'] = [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
    // rules['url'] = [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
    if (isEmpty(schedulerJobFormData.value.executeClass) || defaultExecuteClass.value.includes(schedulerJobFormData.value.executeClass)) {
      schedulerJobFormData.value.executeClass = 'com.bigprime.quartz.task.actuator.impl.ApiActuatorImpl'
    }

  } else if (schedulerJobFormData.value.actuator === 'DB') {
    if (isEmpty(schedulerJobFormData.value.executeClass) || defaultExecuteClass.value.includes(schedulerJobFormData.value.executeClass)) {
      schedulerJobFormData.value.executeClass = 'com.bigprime.quartz.task.actuator.impl.DbActuatorImpl'
    }
  } else if (schedulerJobFormData.value.actuator === 'SQL') {
    if (isEmpty(schedulerJobFormData.value.executeClass) || defaultExecuteClass.value.includes(schedulerJobFormData.value.executeClass)) {
      schedulerJobFormData.value.executeClass = 'com.bigprime.quartz.task.actuator.impl.SqlActuatorImpl'
    }
  } else if (schedulerJobFormData.value.actuator === 'JAR') {
    if (isEmpty(schedulerJobFormData.value.executeClass) || defaultExecuteClass.value.includes(schedulerJobFormData.value.executeClass)) {
      schedulerJobFormData.value.executeClass = 'com.bigprime.quartz.task.actuator.impl.JarActuatorImpl'
    }
  } else if (schedulerJobFormData.value.actuator === 'PYTHON') {
    if (isEmpty(schedulerJobFormData.value.executeClass) || defaultExecuteClass.value.includes(schedulerJobFormData.value.executeClass)) {
      schedulerJobFormData.value.executeClass = 'com.bigprime.quartz.task.actuator.impl.PythonActuatorImpl'
    }
  } else {
    schedulerJobFormData.value.executeClass = ''
  }

  //schedulerJobFormRules.value = rules
}


onMounted(async () => {
  if (isEmpty(schedulerGroupEnums.value)) {
    schedulerGroupEnums.value = await CurrencyService.getEnum('SchedulerGroupEnum')
  }

  if (isEmpty(schedulerActuatorEnums.value)) {
    schedulerActuatorEnums.value = await CurrencyService.getEnum('SchedulerActuatorEnum')
  }

  if (isEmpty(schedulerList.value)) {
    schedulerList.value = await SchedulerService.getList({})
  }
})

watchEffect(() => {
  if ((isEmpty(schedulerJobFormData.value.schedulerId) || schedulerJobFormData.value.schedulerId <= 0)
    && schedulerList.value.length > 0) {
    schedulerJobFormData.value.schedulerId = schedulerList.value[0].id
  }

  if (isEmpty(schedulerJobFormData.value.dataJson)) {
    schedulerJobFormData.value.dataJson = ''
  }
})

const checkFieldDisabled = (fieldName: string) => {
  return indexOf(fieldDisabledList.value, fieldName) != -1
}


const actuatorDbRef = ref()
const actuatorSqlRef = ref()
const actuatorApiRef = ref()
const actuatorFileRef = ref()
const saveLoading = ref(false)

const setActuatorData = () => {
  if (schedulerJobFormData.value.actuator === 'DB') {
    schedulerJobFormData.value.actuatorData = actuatorDbRef.value.dataJson
  } else if (schedulerJobFormData.value.actuator === 'SQL') {
    schedulerJobFormData.value.actuatorData = actuatorSqlRef.value.dataJson
  } else if (schedulerJobFormData.value.actuator === 'JAR' || schedulerJobFormData.value.actuator === 'PYTHON') {
    schedulerJobFormData.value.actuatorData = actuatorFileRef.value.dataJson
  } else if (schedulerJobFormData.value.actuator === 'API') {
    schedulerJobFormData.value.actuatorData = actuatorApiRef.value.dataJson
  } else {
    schedulerJobFormData.value.actuatorData = '{}'
  }
}
const saveSchedulerJobData = () => {
  schedulerJobFormRef.value
    .validate()
    .then(async () => {
      setActuatorData()
      saveLoading.value = true
      const result = await SchedulerJobService.save(schedulerJobFormData.value).catch(error => {
        saveLoading.value = false
      })
      saveLoading.value = false
      if (result) {
        Modal.message({
          message: t('common.prompt.save.success'),
          status: 'success'
        })
        closeSchedulerJobForm(true)
      }
    })
}

const closeSchedulerJobForm = (isUp: any) => {
  emitter.emit('closeSchedulerJobForm', isUp)
}

const openCron = () => {
  cronExpression.value = schedulerJobFormData.value.cron
  cronDrawer.value = true
}
emitter.on('closeCron', (cronValue: any) => {
  schedulerJobFormData.value.cron = cronValue
  cronDrawer.value = false
})

defineExpose({
  schedulerJobFormRef,
  setActuatorData
})
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
