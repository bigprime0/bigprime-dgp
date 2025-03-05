<template>
  <div class="ds-form">
    <tiny-form ref="dataLifeCycleTaskFormRef" :model="dataLifeCycleTaskFormData" :rules="dataLifeCycleTaskFormRules"
               label-width="100px" overflow-title :disabled="dataLifeCycleTaskFormData.status !== 0">
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>


      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="dataLifeCycleTaskFormData.type === 1 ? $t('lifecycle.filing.field.nearline.name') :
                                  dataLifeCycleTaskFormData.type === 2 ? $t('lifecycle.filing.field.offline.name') : $t('lifecycle.filing.field.destruction.name')"
                          :show-message="false" prop="lifeCycleId" >
            <tiny-select v-model="dataLifeCycleTaskFormData.lifeCycleId" filterable @change="lifeCycleChange">
              <tiny-option v-for="item in lifeCycleTree" :key="item.id" :label="item.name"
                           :value="item.id"></tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="dataLifeCycleTaskFormData.type === 1 ? $t('lifecycle.task.field.nearline.name') :
                                  dataLifeCycleTaskFormData.type === 2 ? $t('lifecycle.task.field.offline.name') : $t('lifecycle.task.field.destruction.name')"
                          :show-message="false" prop="name" >
            <tiny-input v-model="dataLifeCycleTaskFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-row>
          <tiny-col :span="6">
            <tiny-form-item :label="$t('lifecycle.task.field.taskType')">
              <tiny-radio v-model='dataLifeCycleTaskFormData.taskType' :label=1>
                {{ $t('lifecycle.task.field.taskType.disposable') }}
              </tiny-radio>
              <tiny-radio v-model='dataLifeCycleTaskFormData.taskType' :label=2>
                {{ $t('lifecycle.task.field.taskType.periodicity') }}
              </tiny-radio>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('lifecycle.filing.field.sourceId')">
            <tiny-select v-model="dataLifeCycleTaskFormData.sourceId" disabled>
              <tiny-option v-for="item in sourceTree" :key="item.id" :label="item.name" :value="item.id"></tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('lifecycle.filing.field.tableName')">
            <tiny-input v-model="dataLifeCycleTaskFormData.tableName" disabled></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="dataLifeCycleTaskFormData.type === 1 ? $t('lifecycle.filing.field.nearline.condition') :
                                  dataLifeCycleTaskFormData.type === 2 ? $t('lifecycle.filing.field.offline.condition') : $t('lifecycle.filing.field.destruction.condition')">
            <tiny-input type="textarea" v-model="dataLifeCycleTaskFormData.condition" :rows=3 show-word-limit
                        disabled></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('common.summary')">
            <tiny-input type="textarea" v-model="dataLifeCycleTaskFormData.remark" :rows=3 show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeDataLifeCycleTaskForm(false)"> {{ $t('common.operations.cancel')
          }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveDataLifeCycleTaskData">
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
import { DataLifeCycleTaskService } from '@/services/lifecycle/life-cycle-task'
import { find, isEmpty } from 'lodash-es'


const { t } = useI18n()
const dataLifeCycleTaskFormRef = ref()
const dataLifeCycleTaskFormData = defineModel('dataLifeCycleTaskFormData', { default: {} as any })
const sourceTree = defineModel('sourceTree', { default: [] as any })
const lifeCycleTree = defineModel('lifeCycleTree', { default: [] as any })

const dataLifeCycleTaskFormRules = computed(() => {
  if (dataLifeCycleTaskFormData.value.status === 0) {
    return {
      name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
      lifeCycleId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
    }
  }
  return {}
})

const lifeCycleChange = (id: any) => {
  let data = find(lifeCycleTree.value, { id: id })
  if (data) {
    if(isEmpty(dataLifeCycleTaskFormData.value.name)){
      dataLifeCycleTaskFormData.value.name = data.tableName
    }
    dataLifeCycleTaskFormData.value.tableName = data.tableName
    dataLifeCycleTaskFormData.value.sourceId = data.sourceId
    dataLifeCycleTaskFormData.value.condition = data.condition
  }
}

const saveDataLifeCycleTaskData = () => {
  dataLifeCycleTaskFormRef.value
    .validate()
    .then(async () => {
      await DataLifeCycleTaskService.save(dataLifeCycleTaskFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataLifeCycleTaskForm(true)
    })
}

const closeDataLifeCycleTaskForm = (isUp: boolean) => {
  emitter.emit('closeDataLifeCycleTaskForm', isUp)
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
