<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dd','menu.dd.dd-task']" />
    <div class="contain">
      <tiny-split v-model="split1" mode="vertical" trigger-simple>
        <template #top>
          <tiny-split v-model="split2" trigger-simple disabled>
            <template #left>
              <div class="split-left">
                <tiny-tabs v-model="tabsLeft" size="small" stretch>
                  <tiny-tab-item size="small" name="dir">
                    <template #title>
                      <div class="tabs-left">
                        <IconFolderOpened class="svg-dir" />
                        <span>{{ $t('development.task.field.job') }}</span>
                      </div>
                    </template>
                    <DdDirectory />
                  </tiny-tab-item>
                  <tiny-tab-item size="small" name="db">
                    <template #title>
                      <div class="tabs-left">
                        <IconDataSource class="svg-db" />
                        <span>{{ $t('development.task.field.data.source') }}</span>
                      </div>
                    </template>
                    <DsmQueryTree />
                  </tiny-tab-item>
                </tiny-tabs>
              </div>
            </template>
            <template #right>
              <tiny-split v-model="split3" trigger-simple disabled>
                <template #left>
                  <div class="split-top">
                    <div class="split-top-left">
                      <Breadcrumb :items="[flinkTaskData.pidName]" :IconLeft="iconMarkOn()" />
                    </div>
                    <div class="split-top-right">
                      <tiny-button plain type="primary" v-if="flinkTaskData.executeStatus === 0"
                                   :icon="iconRichTextListOrdered()" size="mini"
                                   :disabled="flinkTaskData.type === 0"
                                   @click="execute(true,2)">
                        {{ $t('DAG') }}
                      </tiny-button>

                      <tiny-button plain type="primary" v-if="flinkTaskData.executeStatus === 0"
                                   :icon="iconRichTextListOrdered()" size="mini"
                                   :disabled="flinkTaskData.type === 0"
                                   @click="execute(true,1)">
                        {{ $t('检查') }}
                      </tiny-button>

                      <tiny-button plain type="primary" v-if="flinkTaskData.executeStatus === 0"
                                   :icon="iconRichTextListOrdered()" size="mini"
                                   :disabled="flinkTaskData.type === 0"
                                   @click="execute(true,0)">
                        {{ $t('common.operations.execute.plan') }}
                      </tiny-button>

                      <tiny-button plain type="primary" v-if="flinkTaskData.executeStatus === 0" :icon="iconStart()"
                                   size="mini"
                                   :disabled="flinkTaskData.type === 0"
                                   @click="execute(false, 0)">
                        {{ $t('common.operations.execute') }}
                      </tiny-button>

                      <tiny-button v-if="flinkTaskData.executeStatus === 1" type="success" :icon="iconLoading()"
                                   size="mini"
                                   :disabled="flinkTaskData.type === 0"
                                   v-loading.lock.fullscreen="saveLoading"
                                   tiny-loading__background="rgba(0, 0, 0, 0.2)"
                                   tiny-loading__size="large"
                                   @click="execute(false, 0)">
                        {{ $t('common.operations.execute.in.operation') }}
                      </tiny-button>

                      <tiny-button type="warning" v-if="flinkTaskData.status === 0" :icon="iconLock()" size="mini"
                                   :disabled="flinkTaskData.type === 0"
                                   @click="openPublish">
                        {{ $t('common.operations.status.publish') }}
                      </tiny-button>

                      <tiny-button v-if="flinkTaskData.status === 2" type="warning" :icon="iconUnlock()" size="mini"
                                   :disabled="flinkTaskData.type === 0"
                                   @click="unPublish">
                        {{ $t('common.operations.status.unpublish') }}
                      </tiny-button>

                      <tiny-button type="primary" :icon="iconDone()" size="mini"
                                   :disabled="flinkTaskData.type === 0 || flinkTaskData.status > 0"
                                   @click="saveFlinkTaskData">
                        {{ $t('common.operations.save') }}
                      </tiny-button>
                    </div>
                  </div>
                  <div class="split-body">
                    <monacoEditor v-if="flinkTaskData.type === 1 && isEmpty(dagPlan) && isEmpty(dagErrorMsg)" style="margin-top: 10px;"
                                  theme="vs"
                                  :options="editorOptions"
                                  v-model="flinkTaskData.executeSql"
                                  language="sql">
                    </monacoEditor>
                    <tiny-form v-if="flinkTaskData.type === 2 && isEmpty(dagPlan) && isEmpty(dagErrorMsg)" ref="jarParamsRef" label-width="0px" :model="jarParams"
                               :rules="jarParamsRules"
                               overflow-title>
                      <tiny-row>
                        <tiny-col :span="12">
                          <tiny-form-item>
                            <Attachment ref="attachmentRef" :attachment-uuid="jarParams.attachmentUuid" :limit="1"
                                        :is-delete="flinkTaskData.status === 0" />
                          </tiny-form-item>
                        </tiny-col>
                      </tiny-row>
                      <tiny-row>
                        <tiny-col :span="6">
                          <tiny-form-item prop="entryClass" :show-message="false">
                            <tiny-input v-model="jarParams.entryClass"
                                        placeholder="Entry Class (com.test.MyFlinkJob)"></tiny-input>
                          </tiny-form-item>
                        </tiny-col>
                        <tiny-col :span="6">
                          <tiny-form-item>
                            <tiny-input v-model="jarParams.parallelism" placeholder="Parallelism"></tiny-input>
                          </tiny-form-item>
                        </tiny-col>
                      </tiny-row>
                      <tiny-row>
                        <tiny-col :span="6">
                          <tiny-form-item>
                            <tiny-input v-model="jarParams.programArgs" placeholder="Program Arguments"></tiny-input>
                          </tiny-form-item>
                        </tiny-col>
                        <tiny-col :span="6">
                          <tiny-form-item>
                            <tiny-input v-model="jarParams.savepointPath" placeholder="Savepoint Path"></tiny-input>
                          </tiny-form-item>
                        </tiny-col>
                      </tiny-row>
                      <tiny-row>
                        <tiny-col :span="12">
                          <tiny-form-item>
                            <tiny-checkbox v-model="jarParams.allowNonRestoredState" :true-label="true"
                                           :false-label="false">
                              Allow Non Restored State
                            </tiny-checkbox>
                          </tiny-form-item>
                        </tiny-col>
                      </tiny-row>
                    </tiny-form>
                    <tiny-button style="margin-left: 10px" v-if="!isEmpty(dagPlan) || !isEmpty(dagErrorMsg)" type="warning" :icon="iconUndo()" size="mini" circle
                                 :title="$t('返回')"
                                 @click="dagPlan = {};dagErrorMsg = ''"/>
                    <div v-if="!isEmpty(dagPlan)" class="app-content" ref="dagContainer">
                    </div>
                    <div v-if="!isEmpty(dagErrorMsg)" style="margin-top: 10px;width: 100%;text-align: center;">
                      <tiny-link  type="danger" :underline="false">{{ dagErrorMsg }}</tiny-link>
                    </div>
                  </div>
                </template>
                <template #right>
                  <div v-if="flinkTaskData.type > 0" class="split-right" disabled="true">
                    <tiny-link :underline="false" :icon="iconSetting()"
                               @click="envDrawer = true"
                               :title="$t('development.task.field.env')" />
                    <tiny-link v-if="flinkTaskData.status > 0" :underline="false" :icon="iconClockWork()"
                               @click="openPublish"
                               :title="$t('development.task.field.scheduler')" />
                    <tiny-link v-if="flinkTaskData.type === 1" :underline="false" :icon="iconHistoryRecord()"
                               @click="openRecord"
                               :title="$t('development.task.field.historical.records')" />

                  </div>
                </template>
              </tiny-split>
            </template>
          </tiny-split>
        </template>
        <template #bottom>
          <div class="split-bottom">
            <tiny-tabs v-model="tabsBottom" size="small">
              <tiny-tab-item size="small" name="flinkDDL">
                <template #title>
                  <div class="tabs-bottom-flink-ddl">
                    <img :src="flinkDdlImg" />
                    <span>Flink DDL</span>
                  </div>
                </template>
                <div class="split-bottom-layout-setting">
                  <tiny-button v-if="flinkTaskData.type === 1" :icon="iconDone()" size="mini"
                               @click="flinkTaskData.executeSql = flinkTaskData.executeSql + '\n' + flinkDdl"
                               :disabled="isEmpty(flinkDdl) || flinkTaskData.type === 0 || flinkTaskData.status > 0">
                    {{ $t('development.task.field.write.operation') }}
                  </tiny-button>
                </div>
                <div class="split-bottom-layout-body">
                  <monacoEditor width="100%" height="900px" theme="vs"
                                :options="editorOptions"
                                v-model="flinkDdl"
                                language="sql">
                  </monacoEditor>
                </div>

              </tiny-tab-item>
              <tiny-tab-item size="small" name="sqlDDL">
                <template #title>
                  <div class="tabs-bottom">
                    <IconDataSource />
                    <span>Sql DDL</span>
                  </div>
                </template>
                <monacoEditor width="95%" height="900px"
                              theme="vs"
                              :options="editorOptions"
                              v-model="sqlDdl"
                              language="sql">
                </monacoEditor>
              </tiny-tab-item>
              <tiny-tab-item size="small" name="query">
                <template #title>
                  <div class="tabs-bottom">
                    <IconRichTextListUnordered />
                    <span>{{ $t('development.task.field.data') }}</span>
                  </div>
                </template>
                <DsmOperateQuery :table-data="tableData" :data-base-id="dataBaseId"
                                 :table-name="tableName" />
              </tiny-tab-item>
              <tiny-tab-item size="small" name="log">
                <template #title>
                  <div class="tabs-bottom">
                    <IconDialog2 />
                    <span>{{ $t('development.task.field.console') }}</span>
                  </div>
                </template>
                <monacoEditor width="95%" height="900px"
                              theme="vs"
                              :options="editorOptions"
                              v-model="logContent"
                              language="text">
                </monacoEditor>
              </tiny-tab-item>
            </tiny-tabs>
          </div>
        </template>
      </tiny-split>
    </div>
  </div>

  <div>
    <tiny-drawer :title="$t('development.task.field.env')"
                 :visible="envDrawer"
                 @update:visible="envDrawer = $event"
                 width="600px"
                 @close="envClose">
      <div class="ds-form">
        <tiny-form overflow-title labelWidth="120px">
          <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
          </tiny-divider>
          <tiny-row>
            <tiny-form-item :label="$t('执行模式')">
              <tiny-select clearable v-model="flinkTaskData.flinkType" :show-alloption="false"
                           @change="flinkTypeChange">
                <tiny-option :key=1 :value="1" label="standalone" />
                <tiny-option :key=2 :value="2" label="yarn session" />
                <tiny-option :key=3 :value="3" label="yarn application" />
                <tiny-option :key=4 :value="4" label="kubernetes session" />
                <tiny-option :key=5 :value="5" label="kubernetes application" />
                <tiny-option :key=6 :value="6" label="kubernetes operator" />
              </tiny-select>
            </tiny-form-item>
          </tiny-row>
          <tiny-row>
            <tiny-form-item :label="$t('development.task.field.configId')">
              <tiny-select clearable v-model="flinkTaskData.configId" :show-alloption="false">
                <tiny-option v-for="item in flinkConfig" :key="item.id" :value="item.id" :label="item.name" />
              </tiny-select>
            </tiny-form-item>
          </tiny-row>
          <tiny-row>
            <tiny-form-item :label="$t('FlinkSql环境')">
              <tiny-select clearable v-model="flinkTaskData.configObject.sqlEnv">
                <tiny-option :key=1 :value="1" label="禁用" />
                <tiny-option :key=2 :value="2" label="启用" />
              </tiny-select>
            </tiny-form-item>
          </tiny-row>
          <tiny-row>
            <tiny-form-item :label="$t('任务并行度')">
              <tiny-input v-model="flinkTaskData.configObject.parallelism"></tiny-input>
            </tiny-form-item>
          </tiny-row>
          <tiny-row>
            <tiny-col :span="4">
              <tiny-form-item :label="$t('Insert语句集')">
                <tiny-switch v-model="flinkTaskData.configObject.insert" :true-value=1
                             :false-value=0></tiny-switch>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="4">
              <tiny-form-item :label="$t('全局变量')">
                <tiny-switch v-model="flinkTaskData.configObject.globalVariable" :true-value=1
                             :false-value=0></tiny-switch>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="4">
              <tiny-form-item :label="$t('批模式')">
                <tiny-switch v-model="flinkTaskData.configObject.isBatch" :true-value=1
                             :false-value=0></tiny-switch>
              </tiny-form-item>
            </tiny-col>
          </tiny-row>

          <tiny-row>
            <tiny-form-item :label="$t('Savepoint策略')">
              <tiny-select clearable v-model="flinkTaskData.configObject.savepoint" :show-alloption="false">
                <tiny-option :key=1 :value="1" :label="$t('禁用')" />
                <tiny-option :key=1 :value="2" :label="$t('最近一次')" />
                <tiny-option :key=1 :value="3" :label="$t('最早一次')" />
                <tiny-option :key=1 :value="4" :label="$t('指定一次')" />
              </tiny-select>
            </tiny-form-item>
          </tiny-row>

          <tiny-row v-if="flinkTaskData.configObject.savepoint === 4">
            <tiny-form-item :label="$t('Savepoint路径')">
              <tiny-input v-model="flinkTaskData.configObject.savepointPath"></tiny-input>
            </tiny-form-item>
          </tiny-row>

          <tiny-row>
            <tiny-col :span="12">
              <tiny-form-item :label="$t('报警类型')">
                <tiny-radio-group v-model="flinkTaskData.alarmType">
                  <tiny-radio :label=1>{{ $t('单个') }}</tiny-radio>
                  <tiny-radio :label=2>{{ $t('组') }}</tiny-radio>
                </tiny-radio-group>
              </tiny-form-item>
            </tiny-col>
          </tiny-row>

          <tiny-row>
            <tiny-col :span="12">
              <tiny-form-item :label="$t('报警信息')">
                <tiny-select v-if="!flinkTaskData.alarmType || flinkTaskData.alarmType === 1"
                             v-model="flinkTaskData.alarmId"
                             :placeholder="$t('选择告警信息')"
                             filterable
                             reserve-keyword>
                  <tiny-option v-for="item in alarmData"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"></tiny-option>
                </tiny-select>
                <tiny-select v-if="flinkTaskData.alarmType === 2"
                             v-model="flinkTaskData.alarmId"
                             :placeholder="$t('选择告警组信息')"
                             filterable
                             reserve-keyword>
                  <tiny-option v-for="item in alarmGroupData"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"></tiny-option>
                </tiny-select>
              </tiny-form-item>
            </tiny-col>
          </tiny-row>

          <tiny-divider content-position="left" content-color="#7693f5">{{ $t('development.task.field.custom.task') }}
          </tiny-divider>
          <ConditionConfig disabled="true" ref="conditionConfigRef" :data="flinkTaskData.configMap"></ConditionConfig>

          <br />
          <br />
          <tiny-row style="text-align: center">
            <tiny-button plain type="primary" @click="envDrawer = false"> {{ $t('common.operations.cancel') }}
            </tiny-button>
            <tiny-button type="primary" :icon="iconDone()" size="mini"
                         :disabled="flinkTaskData.type === 0 || flinkTaskData.status > 0"
                         @click="saveFlinkTaskData">
              {{ $t('common.operations.save') }}
            </tiny-button>
          </tiny-row>
        </tiny-form>
      </div>
    </tiny-drawer>

    <tiny-drawer :title="$t('development.task.field.historical.records')"
                 :visible="recordDrawer"
                 @update:visible="recordDrawer = $event"
                 width="600px">
      <div class="ds-form">
        <tiny-grid :data="recordData" :fit="true" size="medium" auto-resize border :stripe="true">

          <tiny-grid-column field="createTime" :title="$t('common.field.updateTime')" align="center"></tiny-grid-column>

          <tiny-grid-column :title="$t('development.task.field.records.data.modified')" align="center">
            <template v-slot="data">
              <a @click="recordsOperations(1, data.row)">
                {{ t('common.operations.look') }}
              </a>
            </template>
          </tiny-grid-column>

          <tiny-grid-column :title="$t('development.task.field.records.data.current')" align="center">
            <template v-slot="data">
              <a @click="recordsOperations(2, data.row)">
                {{ t('common.operations.look') }}
              </a>
            </template>
          </tiny-grid-column>

          <tiny-grid-column :title="$t('common.operations')" width="100" align="center">
            <template v-slot="data">
              <a @click="recordsOperations(3, data.row)">
                {{ t('development.task.field.records.restore') }}
              </a>
            </template>
          </tiny-grid-column>
        </tiny-grid>
      </div>
    </tiny-drawer>

    <tiny-drawer :title="diffTitle"
                 :visible="diffDrawer"
                 @update:visible="diffDrawer = $event"
                 width="60%">
      <div class="ds-form">
        <div>
          <CodeDiff :old-string="oldText" :new-string="newText" output-format="side-by-side" language="sql" />
        </div>
      </div>
    </tiny-drawer>

    <tiny-drawer :title="$t('common.operations.status.publish')"
                 :visible="schedulerDrawer"
                 @update:visible="schedulerDrawer = $event"
                 width="600px">
      <div class="ds-form">
        <tiny-form ref="schedulerDataRef" :model="schedulerData" :rules="schedulerDataRules"
                   overflow-title>

          <tiny-row>
            <tiny-form-item :label="$t('scheduler.job.field.concurrent')">
              <tiny-switch v-model="schedulerData.concurrent" :true-value="1" :false-value="0"></tiny-switch>
            </tiny-form-item>
          </tiny-row>

          <tiny-row>
            <tiny-form-item :label="$t('scheduler.job.field.cron')" :show-message="false" prop="cron">
              <tiny-input v-model="schedulerData.cron">
                <template #append>
                  <tiny-button :reset-time="500" type="primary" @click="openCron">
                    {{ $t('common.operations.generate') }}
                  </tiny-button>
                </template>
              </tiny-input>
            </tiny-form-item>
          </tiny-row>

          <br />
          <tiny-row style="text-align: center">
            <tiny-button plain type="primary" @click="closePublish"> {{ $t('common.operations.cancel') }}
            </tiny-button>
            <tiny-button :reset-time="500" type="primary" @click="publish"
                         v-loading.lock.fullscreen="saveLoading"
                         tiny-loading__background="rgba(0, 0, 0, 0.2)"
                         tiny-loading__size="large"> {{ $t('common.operations.status.publish') }}
            </tiny-button>
          </tiny-row>
        </tiny-form>
      </div>
    </tiny-drawer>

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

    <tiny-drawer
      :title="checkPlanTitle"
      :visible="checkPlan"
      @update:visible="checkPlan = $event"
      :show-header="true"
      :mask-closable="true"
      width="60%"
      @close="checkPlan = false"
    >
      <div v-if="!isEmpty(sqlErrorPlan)">
        <tiny-layout>
          <div style="margin-bottom: 15px;" v-for="(value, key) in sqlErrorPlan" :key="key">
            <tiny-row>
              <tiny-col :span="12">
                <div class="resource-title">
                  <tiny-link type="warning" :underline="false">{{ $t('语法有误') }}</tiny-link>
                  <tiny-link style="margin-left: 10px;" type="warning" :underline="false">{{ $t('逻辑错误') }}</tiny-link>
                  <tiny-popover trigger="hover" placement="right-start"
                                popper-class="popover-cls"
                                width="800"
                                title="Plan">
                    <monacoEditor theme="vs"
                                  height="300px"
                                  :options="editorOptions"
                                  :model-value="sqlErrorPlan[key]"
                                  language="text">
                    </monacoEditor>
                    <template #reference>
                      <tiny-link style="margin-left: 10px" type="danger" value="Show error"></tiny-link>
                    </template>
                  </tiny-popover>
                </div>
                <div class="resource-des">
                  <monacoEditor style="margin-top: 10px;"
                                theme="vs"
                                height="150px"
                                :options="editorOptions"
                                :model-value="key"
                                language="sql">
                  </monacoEditor>
                </div>
              </tiny-col>
            </tiny-row>
          </div>
        </tiny-layout>
      </div>
      <div v-else-if="!isEmpty(sqlPlan)">
        <tiny-layout>
          <div style="margin-bottom: 15px;" v-for="(value, key) in sqlPlan" :key="key">
            <tiny-row>
              <tiny-col :span="12">
                <div class="resource-title">
                  <tiny-link type="success" :underline="false">{{ $t('语法正确') }}</tiny-link>
                  <tiny-link style="margin-left: 10px;" type="primary" :underline="false">{{ $t('逻辑正确') }}</tiny-link>
                  <tiny-popover trigger="hover" placement="right-start"
                                popper-class="popover-cls"
                                width="800"
                                title="Plan">
                    <monacoEditor theme="vs"
                                  height="300px"
                                  :options="editorOptions"
                                  :model-value="sqlPlan[key]"
                                  language="text">
                    </monacoEditor>
                    <template #reference>
                      <tiny-link style="margin-left: 10px" type="success" value="Show Plan"></tiny-link>
                    </template>
                  </tiny-popover>
                </div>
                <div class="resource-des">
                  <monacoEditor style="margin-top: 10px;"
                                theme="vs"
                                height="150px"
                                :options="editorOptions"
                                :model-value="key"
                                language="sql">
                  </monacoEditor>
                </div>
              </tiny-col>
            </tiny-row>
          </div>
        </tiny-layout>
      </div>
      <div v-if="!isEmpty(sqlErrorMsg)" style="margin-top: 10px;width: 100%;text-align: center;">
        <tiny-link type="danger" :underline="false">{{ sqlErrorMsg }}</tiny-link>
      </div>

    </tiny-drawer>

    <tiny-drawer
      :title="$t('DAG详情')"
      :visible="clickPlan"
      @update:visible="clickPlan = $event"
      :show-header="true"
      :mask-closable="true"
      width="60%"
      @close="clickPlan = false"
    >
      <tiny-layout>
        <tiny-row style="margin-top: 15px;">
          <tiny-col :span="1">
            <tiny-link type="info" :underline="false">id</tiny-link>
          </tiny-col>
          <tiny-col :span="11">
            <tiny-link style="margin-left: 20px;" type="info" :underline="false">{{clickPlanData.id}}</tiny-link>
          </tiny-col>
        </tiny-row>
        <tiny-row style="margin-top: 15px;">
          <tiny-col :span="1">
            <tiny-link type="info" :underline="false">{{t('并行度')}}</tiny-link>
          </tiny-col>
          <tiny-col :span="11">
            <tiny-link style="margin-left: 20px;" type="info" :underline="false">{{clickPlanData.parallelism}}</tiny-link>
          </tiny-col>
        </tiny-row>
        <tiny-row style="margin-top: 15px;">
          <tiny-col :span="1">
            <tiny-link type="info" :underline="false">{{t('描述')}}</tiny-link>
          </tiny-col>
          <tiny-col :span="11">
            <monacoEditor theme="vs"
                          height="300px"
                          :options="editorOptions"
                          :model-value="clickPlanData?.description"
                          language="text">
            </monacoEditor>
          </tiny-col>
        </tiny-row>
      </tiny-layout>
    </tiny-drawer>
  </div>

</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { CodeDiff } from 'v-code-diff'
import {
  iconClockWork,
  iconDataSource,
  iconDialog2,
  iconDone,
  iconFolderOpened,
  iconHistoryRecord,
  iconLoading,
  iconLock,
  iconMarkOn,
  iconRichTextListOrdered,
  iconRichTextListUnordered,
  iconSetting,
  iconStart, iconUndo,
  iconUnlock
} from '@opentiny/vue-icon'
import DsmQueryTree from '@/views/data-source/components/dsm-query-tree.vue'
import DsmOperateQuery from '@/views/data-source/components/dsm-operate-query.vue'
import { SourceService } from '@/services/spi/source'
import DdDirectory from '@/views/development/task/components/dd-directory.vue'
import { FlinkTaskService } from '@/services/development/task'
import { Modal } from '@opentiny/vue'
import { isEmpty } from 'lodash-es'
import { FlinkConfigService } from '@/services/development/config'
import ConditionConfig from '@/views/components/conditionConfig.vue'
import { FlinkTaskTriggersService } from '@/services/development/task-triggers'
import { FlinkSqlVersionService } from '@/services/development/sql-version'
import Attachment from '@/views/components/attachment/attachment.vue'
import { AlarmService } from '@/services/development/alarm'
import { Graph } from '@antv/x6'

const { t } = useI18n()
const IconDataSource = iconDataSource()
const IconFolderOpened = iconFolderOpened()
const IconRichTextListUnordered = iconRichTextListUnordered()
const IconDialog2 = iconDialog2()

const checkPlan = ref(false)
const checkPlanTitle = ref('')
const tabsLeft = ref('dir')
const tabsBottom = ref('')
const flinkDdlImg = ref('svgs/Flink.svg')

const split1 = ref(0.7)
const split2 = ref(0.2)
const split3 = ref(0.97)

const sqlPlan:any = ref({})
const sqlErrorPlan:any = ref({})
const dagPlan:any = ref({})
const clickPlanData = ref<any>({
  id:'',
  parallelism:undefined,
  description:undefined
})
const clickPlan = ref(false)
const sqlErrorMsg:any = ref('')
const dagErrorMsg:any = ref('')

const flinkDdl = ref()
const sqlDdl = ref()
const logContent = ref()
const editorOptions = ref({
  automaticLayout: true,
  foldingStrategy: 'indentation',
  renderLineHighlight: 'all',
  selectOnLineNumbers: true,
  minimap: {
    enabled: true
  },
  readOnly: false,
  fontSize: 13,
  scrollBeyondLastLine: false,
  overviewRulerBorder: false
})
const flinkConfig = ref()

const tableData = ref()
const dataBaseId = ref()
const tableName = ref()
emitter.on('query-tree-data-click', async (data: any) => {
  tableData.value = data.tableData
  dataBaseId.value = data.dataBaseId
  tableName.value = data.tableData.name
  let sqlResult = await SourceService.getCreateStatement(dataBaseId.value, tableName.value)
  if (!isEmpty(sqlResult)) {
    sqlDdl.value = sqlResult
  } else {
    sqlDdl.value = ''
  }
  let flinkResult = await FlinkTaskService.getFlinkDdl({
    dataBaseId: dataBaseId.value,
    tableName: tableName.value
  })
  if (!isEmpty(flinkResult)) {
    flinkDdl.value = flinkResult
  } else {
    flinkDdl.value = ''
  }
  if (isEmpty(tabsBottom.value)) {
    tabsBottom.value = 'flinkDDL'
  }

})

const attachmentRef = ref()
const jarParamsRef = ref()
const jarParams = ref<any>({})
const jarParamsRules = computed(() => {
  let ruleList = {
    entryClass: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})
const initTaskData = () => {
  return {
    id: 0,
    pid: 0,
    flinkType: 0,
    configId: 0,
    schedulerJobId: 0,
    name: '',
    type: 0,
    pidName: t('development.task.field.job'),
    executeSql: '',
    configMap: {},
    status: 0,
    executeStatus: 0,
    executeDate: '',
    summary: '',
    alarmType: 1,
    alarmId: undefined,
    configObject: {
      sqlEnv:1,
      parallelism: undefined,
      insert:0,
      globalVariable:0,
      isBatch:0,
      savepoint:1,
      savepointPath:''
    } as any
  } as any
}
const flinkTaskData = ref(initTaskData())
const getLogContent = async () => {
  const triggersLogs = await FlinkTaskTriggersService.getPage({
    page: 1,
    limit: 1,
    model: {
      taskId: flinkTaskData.value.id
    }
  })
  if (!isEmpty(triggersLogs.list)) {
    let triggersLog: any = triggersLogs.list[0]
    if (!isEmpty(triggersLog) && !isEmpty(triggersLog.logContent)) {
      logContent.value = triggersLog.logContent
    } else if (!isEmpty(triggersLog) && !isEmpty(triggersLog.errMessage)) {
      logContent.value = triggersLog.errMessage
    } else {
      logContent.value = ''
    }
  } else {
    logContent.value = ''
  }
}
const getTaskData = async (id: number, pidName: string) => {
  sqlPlan.value = {}
  sqlErrorPlan.value = {}
  dagPlan.value = {}
  sqlErrorMsg.value = {}
  dagErrorMsg.value = {}

  flinkTaskData.value = await FlinkTaskService.getById(id)
  if (!flinkTaskData.value) {
    flinkTaskData.value = initTaskData()
  }
  if(isEmpty(flinkTaskData.value.configObject)){
    flinkTaskData.value.configObject = {
      sqlEnv:1,
      parallelism: undefined,
      insert:0,
      globalVariable:0,
      isBatch:0,
      savepoint:1,
      savepointPath:''
    }
  }
  if (isEmpty(flinkTaskData.value.executeSql)) {
    flinkTaskData.value.executeSql = ''
  }
  flinkTaskData.value.pidName = pidName

  if (flinkTaskData.value.type > 0 && isEmpty(tabsBottom.value)) {
    tabsBottom.value = 'flinkDDL'
  }

  if (flinkTaskData.value.type == 2 && !isEmpty(flinkTaskData.value.executeSql)) {
    jarParams.value = JSON.parse(flinkTaskData.value.executeSql)
  } else {
    jarParams.value = {}
  }
  flinkConfig.value = await FlinkConfigService.getList({
    model: {
      type: flinkTaskData.value.flinkType
    }
  })
}
emitter.on('dd-directory-data-click', async (data: any) => {
  await getTaskData(data.data.id, data.data.pidName)
  await getLogContent()
})

const paramValidate = () => {
  if (!flinkTaskData.value.configId) {
    envDrawer.value = true
    Modal.message({
      message: t('development.task.prompt.configId'),
      status: 'error'
    })
    return false
  }

  if (isEmpty(flinkTaskData.value.executeSql)) {
    Modal.message({
      message: t('development.task.prompt.executeSql'),
      status: 'error'
    })
    return false
  }
  return true
}

const validate = () => {
  if (flinkTaskData.value.type == 2) {
    jarParamsRef.value.validate()
    if (isEmpty(jarParams.value.entryClass)) {
      return false
    }
    if (isEmpty(attachmentRef.value.attachmentUuid) || isEmpty(attachmentRef.value.fileList)) {
      Modal.message({
        message: t('development.task.prompt.executeJar'),
        status: 'error'
      })
      return false
    }
    jarParams.value.attachmentUuid = attachmentRef.value.attachmentUuid
    flinkTaskData.value.executeSql = JSON.stringify(jarParams.value)
    return paramValidate()
  } else {
    return paramValidate()
  }
}

const saveFlinkTaskData = async () => {
  if (validate()) {
    flinkTaskData.value.configMap = conditionConfigRef.value.resultData
    await FlinkTaskService.save(flinkTaskData.value)
    Modal.message({
      message: t('common.prompt.save.success'),
      status: 'success'
    })
    envDrawer.value = false
  }
}

const envDrawer = ref(false)
const conditionConfigRef = ref()
const envClose = async () => {
  await getTaskData(flinkTaskData.value.id, flinkTaskData.value.pidName)
  envDrawer.value = false
}

const recordData = ref()
const recordDrawer = ref(false)
const diffDrawer = ref(false)
const diffTitle = ref()
const oldText = ref(false)
const newText = ref(false)
const openRecord = async () => {
  recordDrawer.value = true
  recordData.value = await FlinkSqlVersionService.getList({
    model: {
      taskId: flinkTaskData.value.id
    }
  })
}
const recordsOperations = async (type: number, data: any) => {
  if (type === 1) {
    oldText.value = data.beginSql
    newText.value = data.executeSql
    diffTitle.value = t('development.task.field.records.data.modified')
    diffDrawer.value = true
  } else if (type === 2) {
    oldText.value = data.executeSql
    newText.value = flinkTaskData.value.executeSql
    diffTitle.value = t('development.task.field.records.data.current')
    diffDrawer.value = true
  } else if (type === 3) {
    Modal.confirm(t('development.task.prompt.records.restore')).then(async (res: string) => {
      if (res === 'confirm') {
        flinkTaskData.value.executeSql = data.executeSql
        await FlinkTaskService.save(flinkTaskData.value)
        await getTaskData(flinkTaskData.value.id, flinkTaskData.value.pidName)
        Modal.message({
          message: t('development.task.prompt.records.restore.success'),
          status: 'success'
        })
        recordDrawer.value = false
      }
    })
  }
}

const execute = async (isExplain: boolean,type: number) => {
  if (validate()) {
    saveLoading.value = true
    flinkTaskData.value.executeStatus = 1
    const result: any = await FlinkTaskService.execute({
      isExplain: isExplain,
      model: flinkTaskData.value
    }).catch(error => {
      saveLoading.value = false
    })
    saveLoading.value = false

    if (isExplain === true) {
      flinkTaskData.value.executeStatus = 0
      sqlPlan.value = {}
      sqlErrorPlan.value = {}
      dagPlan.value = {}
      sqlErrorMsg.value = ''
      dagErrorMsg.value = ''
      if(type === 1){
        //检查
        if(result.isSuccess){
          sqlPlan.value = result.sqlPlan
          sqlErrorPlan.value = result.sqlErrorPlan
          if(isEmpty(sqlPlan.value) && isEmpty(sqlErrorPlan.value)){
            sqlErrorMsg.value = t('暂无检查结果')
          }
        }else{
          sqlErrorMsg.value = t('development.task.connection.fail')
        }

        checkPlanTitle.value = t('FlinkSQL语法和逻辑检查')
        checkPlan.value = true
      }else if(type === 2){
        //dag
        if(result.isSuccess){
          dagPlan.value = result.plan
          if(isEmpty(dagPlan.value)){
            dagErrorMsg.value = t('暂无DAG图')
          }
        }else{
          dagErrorMsg.value = t('development.task.connection.fail')
        }
      }else{
        if (result.logContent) {
          logContent.value = result.logContent
        }
        tabsBottom.value = 'log'
      }
    } else {
      tabsBottom.value = 'log'
      await getLogContent()
    }
  }
}

const dagContainer = ref<HTMLDivElement | null>(null)
const graph = ref<any>()
watchEffect(async () => {
  if (dagContainer.value) {
    graph.value = new Graph({
      container: dagContainer.value,
      height: 300,
      background: {
        color: '#fff'
      },
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1 // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1, // 次网格线宽度
            factor: 4 // 主次网格线间隔
          }
        ]
      },
      panning: true,
      mousewheel: true
    })

    if(!isEmpty(dagPlan.value)){
      let nodes:any = []
      let edges:any = []
      let startNodeId = ""
      let edgeLable = ""
      let x = 0
      dagPlan.value.nodes.forEach((item:any) => {
        if(x === 0){
          x = 150
        }else{
          x = x + 300
        }
        let name = item.description
        if(item.description.length > 30){
          name =  item.description.substring(0,30) + "..."
        }
        let lable = ""
        for (let i = 0; i < item.description.length; i += 25) {
          if(i === 0){
            lable = item.description.substring(i, i + 25)
          }else if(i < 4 * 25){
            lable = lable + "\n" + item.description.substring(i, i + 25)
          }else{
            break;
          }
        }
        lable = name + "\n\n" +lable+ "..."
        nodes.push({
          id: item.id,
          shape: 'rect',
          x: x,
          y: 100,
          width: 200,
          height: 100,
          label: lable,
          attrs: {
            body: {
              stroke: '#24DD7F',
              strokeWidth: 1,
              fill: '#24DD7F',
              rx: 6,
              ry: 6,
            },
            label: {
              fill: '#333',
              fontSize: 12,
              textAnchor: 'middle',
              whiteSpace: 'pre'
            },
          },
          data: item
        })
        if(startNodeId === ""){
          startNodeId = item.id
        }else{
          edges.push({
            source: startNodeId,
            target: item.id,
            attrs: {
              line: {
                stroke: '#1890ff',
                strokeWidth: 1,
              },
            },
            label: edgeLable
          })
          startNodeId = item.id
        }
        if(!isEmpty(item.inputs)){
          item.inputs.forEach((input:any) => {
            edgeLable = input['ship_strategy']
          })
        }
      })
      graph.value.fromJSON({
        nodes: nodes,
        edges: edges
      })
      graph.value.on('node:click', ({node, index, options}) => {
        clickPlanData.value = node.getData()
        clickPlanData.value.description = clickPlanData.value.description.replace(/<br\/>/gi, '\n')
        clickPlan.value = true
      })
    }
  }

})

const schedulerDrawer = ref(false)
const initSchedulerData = () => {
  return {
    id: 0,
    schedulerId: 1,
    name: flinkTaskData.value.name,
    group: 'FLINK',
    actuator: 'CUSTOM',
    actuatorData: '{"flinkTaskId": ' + flinkTaskData.value.id + '}',
    cron: '',
    concurrent: 0,
    status: 1,
    dataJson: ''
  }
}
const schedulerData = ref(initSchedulerData())
const schedulerDataRef = ref()
const schedulerDataRules = computed(() => {
  let ruleList = {
    cron: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const saveLoading = ref(false)
const publish = async () => {
  schedulerDataRef.value
    .validate()
    .then(async () => {
      saveLoading.value = true
      flinkTaskData.value.jobModel = schedulerData.value
      const result = await FlinkTaskService.publish({ model: flinkTaskData.value }).catch(error => {
        saveLoading.value = false
      })
      saveLoading.value = false
      if (result) {
        closePublish()
        Modal.message({
          message: t('common.operations.status.publish.success'),
          status: 'success'
        })
      }
    })
}
const openPublish = () => {
  if (validate()) {
    schedulerDrawer.value = true
    if (!isEmpty(flinkTaskData.value.jobModel)) {
      schedulerData.value = flinkTaskData.value.jobModel
    } else {
      schedulerData.value = initSchedulerData()
    }
  }
}
const closePublish = () => {
  schedulerDrawer.value = false
  getTaskData(flinkTaskData.value.id, flinkTaskData.value.pidName)
}

const unPublish = async () => {
  Modal.confirm(t('common.operations.status.unpublish.prompt')).then(async (res: string) => {
    if (res === 'confirm') {
      saveLoading.value = true
      await FlinkTaskService.unPublish({ model: flinkTaskData.value }).catch(error => {
        saveLoading.value = false
      })
      saveLoading.value = false
      await getTaskData(flinkTaskData.value.id, flinkTaskData.value.pidName)
    }
  })
}

const cronExpression = ref()
const cronDrawer = ref(false)
const openCron = () => {
  cronExpression.value = schedulerData.value.cron
  cronDrawer.value = true
}
emitter.on('closeCron', (cronValue: any) => {
  schedulerData.value.cron = cronValue
  cronDrawer.value = false
})

const alarmData = ref<any>([])
const alarmGroupData = ref<any>([])
onMounted(async () => {
  initTaskData()
  alarmData.value = await AlarmService.getDefinitionList({
    model: {
      type: 2
    }
  })
  alarmGroupData.value = await AlarmService.getGroupList({
    model: {
      type: 2,
    }
  })
})
const flinkTypeChange = async () => {
  flinkConfig.value = await FlinkConfigService.getList({
    model: {
      type: flinkTaskData.value.flinkType
    }
  })
  flinkTaskData.value.configId = undefined
}

</script>

<style scoped lang="less">
.split-left {
  width: 100%;
  height: 100%;

  :deep(.tiny-tabs__content) {
    position: absolute;
    box-sizing: border-box;
    margin: 8px 0 0 2%;
    font-size: var(--ti-tabs-content-font-size);
    width: 96%;
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}

.tabs-left {
  font-size: 13px;

  .svg-dir {
    fill: #ffcc41;
    width: 1.2em;
    height: 1.2em;
    margin-right: 7px;
  }

  .svg-db {
    fill: #1ac456;
    width: 1.2em;
    height: 1.2em;
    margin-right: 7px;
  }
}

.tabs-bottom {
  width: 100%;
  height: 100%;
  font-size: 13px;

  :deep(.tiny-svg) {
    width: 1.2em;
    height: 1.2em;
    margin-right: 7px;
    margin-left: 7px;
    fill: #1ac456;
  }
}

.tabs-bottom-flink-ddl {
  width: 100%;
  height: 100%;
  font-size: 13px;

  img {
    width: 1.2em;
    height: 1.2em;
    margin-right: 7px;
    margin-left: 7px;
    fill: #1ac456;
  }
}

.split-bottom {
  width: 100%;
  height: 100%;

  :deep(.tiny-tabs__content) {
    position: absolute;
    box-sizing: border-box;
    font-size: var(--ti-tabs-content-font-size);
    width: 100%;
    margin: 0;
    height: calc(100% - 50px);
    overflow-y: auto;
  }

  .split-bottom-layout {
    display: flex;
  }

  .split-bottom-layout-body {
    width: 95%;
  }

  .split-bottom-layout-setting {
    margin: 10px;
    width: 100%;
    position: sticky;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 1;
  }
}

.split-top {
  display: flex;
  margin: 10px;
}

.split-top-left {
  display: flex;
  gap: 20px;
  width: 40%;
  fill: #1ac456;

  :deep(.tiny-breadcrumb .tiny-breadcrumb__item:last-child .tiny-breadcrumb__inner) {
    font-weight: 500;
    color: #2c3e50;
    text-decoration: none;
  }

  :deep(.container-breadcrumb) {
    font-size: 12px;
    margin: 5px;
  }
}

.split-top-right {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 58%;
  margin-top: 3px;

  :deep(.tiny-button.tiny-button--success) {
    color: var(--ti-button-info-text-color);
    fill: var(--ti-button-info-text-color);
    border-color: #24DD7F;
    background-color: #24DD7F;
  }
}

.split-body {
  width: 100%;
  height: 98%;
}

.split-right {
  :deep(.tiny-link .tiny-svg) {
    width: 1.2em;
    height: 1.2em;
    margin: 20px 0 0 20%;
  }
}

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
  //height: 99%;
}

.ds-form {
  padding: 10px;
}

.resource-title {
  margin-top: 10px;
}

.resource-des {
  margin-top: 10px;
  font-size: 12px;
  color: #2c3e50;
}

.resource-info {
  margin-top: 22px;
}

.app-content {
  flex: 1;
  margin: 10px;
  border-radius: 5px;
  box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
}
</style>
