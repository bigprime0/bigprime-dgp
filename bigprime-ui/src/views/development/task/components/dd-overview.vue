<template>
  <div class="div-card">
    <tiny-card class="card-two">
      <template #title>
        <tiny-link class="card-title" :underline="false">{{ t('development.task.field.job') }}
        </tiny-link>
      </template>
      <template #default>
        <tiny-card-group v-model="radioValue" check-type="radio" class="div-card">
          <tiny-card id="radioCard" label="1" check-mode="badge" class="card-two-info"
                     @click="listClick(-1)">
            <template #title>
              <tiny-link class="card-title-info" :underline="false" style="color: #1a78c4">
                {{ t('development.task.count')
                }}
              </tiny-link>
            </template>
            <template #default>
              <tiny-layout cols="3">
                <tiny-row class="card-row">
                  <tiny-col :span="1">
                    <IconEditorCode class="card-row-icon" style="fill: #1a78c4" />
                  </tiny-col>
                  <tiny-col :span="2">
                    <tiny-link class="card-col-value" :underline="false" style="color: #1a78c4">
                      {{ statisticData.taskCount }}
                    </tiny-link>
                  </tiny-col>
                </tiny-row>
              </tiny-layout>
            </template>
          </tiny-card>
          <tiny-card id="radioCard" label="2" check-mode="badge" class="card-two-info"
                     @click="listClick(0)">
            <template #title>
              <tiny-link class="card-title-info" :underline="false" style="color: #c4891a">
                {{ t('common.task.unPublish.Count') }}
              </tiny-link>
            </template>
            <template #default>
              <tiny-layout cols="3">
                <tiny-row class="card-row">
                  <tiny-col :span="1">
                    <IconRichTextTaskList class="card-row-icon" style="fill: #c4891a" />
                  </tiny-col>
                  <tiny-col :span="2">
                    <tiny-link class="card-col-value" :underline="false" style="color: #c4891a">
                      {{ statisticData.unPublishCount }}
                    </tiny-link>
                  </tiny-col>
                </tiny-row>
              </tiny-layout>
            </template>
          </tiny-card>
          <tiny-card id="radioCard" label="3" check-mode="badge" class="card-two-info" @click="listClick(2)">
            <template #title>
              <tiny-link class="card-title-info" :underline="false" style="color: #2c5048">
                {{ t('common.task.publish.count')
                }}
              </tiny-link>
            </template>
            <template #default>
              <tiny-layout cols="3">
                <tiny-row class="card-row">
                  <tiny-col :span="1">
                    <IconHalfchecked class="card-row-icon" style="fill: #2c5048" />
                  </tiny-col>
                  <tiny-col :span="2">
                    <tiny-link class="card-col-value" :underline="false" style="color: #2c5048">
                      {{ statisticData.publishCount }}
                    </tiny-link>
                  </tiny-col>
                </tiny-row>
              </tiny-layout>
            </template>
          </tiny-card>
          <tiny-card id="radioCard" label="4" check-mode="badge" class="card-two-info"
                     @click="instanceClick(1)">
            <template #title>
              <tiny-link class="card-title-info" :underline="false" style="color: #1ac456">
                {{ t('common.task.success.count') }}
              </tiny-link>
            </template>
            <template #default>
              <tiny-layout cols="3">
                <tiny-row class="card-row">
                  <tiny-col :span="1">
                    <IconSuccessful class="card-row-icon" style="fill: #1ac456" />
                  </tiny-col>
                  <tiny-col :span="2">
                    <tiny-link class="card-col-value" :underline="false" style="color: #1ac456">
                      {{ statisticData.successCount }}
                    </tiny-link>
                  </tiny-col>
                </tiny-row>
              </tiny-layout>
            </template>
          </tiny-card>
          <tiny-card id="radioCard" label="5" check-mode="badge" class="card-two-info"
                     @click="instanceClick(0)">
            <template #title>
              <tiny-link class="card-title-info" :underline="false" style="color: #002FA7">
                {{ t('common.task.running.count') }}
              </tiny-link>
            </template>
            <template #default>
              <tiny-layout cols="3">
                <tiny-row class="card-row">
                  <tiny-col :span="1">
                    <IconStart class="card-row-icon" style="fill: #002FA7" />
                  </tiny-col>
                  <tiny-col :span="2">
                    <tiny-link class="card-col-value" :underline="false" style="color: #002FA7">
                      {{ statisticData.runningCount }}
                    </tiny-link>
                  </tiny-col>
                </tiny-row>
              </tiny-layout>
            </template>
          </tiny-card>
          <tiny-card id="radioCard" label="6" check-mode="badge" class="card-two-info"
                     @click="instanceClick(2)">
            <template #title>
              <tiny-link class="card-title-info" :underline="false" style="color: red">
                {{ t('common.task.error.count') }}
              </tiny-link>
            </template>
            <template #default>
              <tiny-layout cols="3">
                <tiny-row class="card-row">
                  <tiny-col :span="1">
                    <IconOperationfaild class="card-row-icon" style="fill: red" />
                  </tiny-col>
                  <tiny-col :span="2">
                    <tiny-link class="card-col-value" :underline="false" style="color: red">
                      {{ statisticData.errorCount }}
                    </tiny-link>
                  </tiny-col>
                </tiny-row>
              </tiny-layout>
            </template>
          </tiny-card>
        </tiny-card-group>
      </template>
    </tiny-card>
  </div>
  <div class="contain">
    <DdTaskList v-if="listShow" :status="listStatus"/>
    <DdTaskInstanceList v-else :show-breadcrumb=false :flink-task-data="flinkTaskData" :status="status" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  iconEditorCode,
  iconHalfchecked,
  iconOperationfaild,
  iconRichTextTaskList,
  iconStart,
  iconSuccessful
} from '@opentiny/vue-icon'
import DdTaskInstanceList from '@/views/development/task/components/dd-task-instance-list.vue'
import DdTaskList from '@/views/development/task/components/dd-task-list.vue'
import { FlinkTaskService } from '@/services/development/task'

const IconRichTextTaskList = iconRichTextTaskList()
const IconHalfchecked = iconHalfchecked()
const IconStart = iconStart()
const IconSuccessful = iconSuccessful()
const IconOperationfaild = iconOperationfaild()
const IconEditorCode = iconEditorCode()
const { t } = useI18n()

const radioValue = ref("1")
const flinkTaskData = ref({
  id: 0,
  pid: 0,
  configId: 0,
  schedulerJobId: 0,
  name: '',
  type: 0,
  pidName: '',
  executeSql: '',
  configMap: {},
  status: 0,
  executeStatus: 0,
  executeDate: '',
  summary: ''
} as any)
const status = ref(-1)
const statisticData = ref({
  taskCount: 0,
  publishCount: 0,
  unPublishCount: 0,
  successCount: 0,
  runningCount: 0,
  errorCount: 0
})

const listShow = ref(true)
const listStatus = ref(-1)

const instanceClick = (value: number) => {
  listShow.value = false
  status.value = value
  flinkTaskData.value.type = 1
}

const listClick = (value: number) => {
  listShow.value = true
  listStatus.value = value
}

onMounted(async () => {
  statisticData.value = await FlinkTaskService.getStatistic()
})

</script>
<style scoped lang="less">

.div-card {
  display: flex;
  margin: 10px 0 0 10px;
}

.card-chart {
  width: 50%;
  margin-right: 10px;
}

.card-two {
  width: 100%;
  height: 190px;
  margin-right: 10px;
}

.card-two-info {
  border-radius: 8px;
  cursor: pointer;
  width: 25%;
  height: 100px;
  margin: 10px 10px 0 0;
}

.card-two-info:hover {
  box-shadow: 0 2px 8px 0 rgba(26, 196, 137, 0.66);
}

.card-title {
  font-size: 15px;
  color: #3ac295;
}

.card-title-info {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-row {
  margin-top: 10px;
  text-align: left;
  padding-left: 0px;
}

.card-row-icon {
  float: right;
  margin-top: 2px;
  width: 2em;
  height: 2em;
  vertical-align: middle;
  overflow: auto;
  display: inline-block;
}

.card-col-value {
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-col-label {
  font-size: 18px;
  //color: #002FA7;
}

.container-list {
  display: flex;
  flex-direction: column;
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

</style>

