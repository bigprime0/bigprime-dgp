<template>
  <div v-if="isEmpty(rowModel)" :class="showBreadcrumb ? 'container-list' : ''">
    <Breadcrumb v-if="showBreadcrumb" class="svg-dir"
                :items="[isEmpty(flinkTaskData.pidName) ? t('development.task.field.job') : flinkTaskData.pidName]"
                :IconLeft="IconFolderOpened" />
    <div class="grid-toolbar">
      <tiny-search @search="search" @clear="search" v-model="searchValue"
                   :placeholder="$t('common.search.placeholder')"
                   is-enter-search clearable></tiny-search>
      <tiny-date-picker
        v-model="executeDate"
        type="daterange"
        :start-placeholder="$t('common.text.begin.date')"
        :end-placeholder="$t('common.text.end.date')"
        :range-separator="$t('common.text.to')"
      />
      <div v-if="flinkTaskData.id > 0" class="tool">
        <tiny-button type="success" :icon="iconStartCircle()" size="mini" circle
                     v-loading.lock.fullscreen="saveLoading"
                     tiny-loading__background="rgba(0, 0, 0, 0.08)"
                     tiny-loading__size="large"
                     :title="$t('执行一次')"
                     @click="run(null,1, '确定执行一次'+flinkTaskData.name+'任务吗', '执行成功', '执行失败')" />

        <tiny-button type="warning" :icon="iconPauseCircle()" size="mini" circle
                     :title="$t('暂停任务')"
                     @click="run(null, 2, '确定暂停'+flinkTaskData.name+'任务吗', '暂停成功', '暂停失败')" />

        <tiny-button type="danger" :icon="iconHalfchecked()" size="mini" circle
                     :title="$t('停止任务')"
                     @click="run(null, 3, '确定停止'+flinkTaskData.name+'任务吗', '停止成功', '停止失败')" />

        <tiny-button type="primary" :icon="iconVersiontree()" size="mini" circle
                     :title="$t('查看版本')"
                     @click="handleVersion"/>

      </div>
    </div>
    <tiny-grid :data="tableData"
               height="100%"
               size="small"
               border
               :stripe="true"
               highlight-hover-row
               resizable
               show-header-overflow="tooltip" show-overflow="tooltip">
      <tiny-grid-column field="taskModel.name" :title="$t('development.task.field.job')"></tiny-grid-column>
      <tiny-grid-column field="jobId" title="Flink Job Id"></tiny-grid-column>
      <tiny-grid-column :title="$t('development.task.field.execute.type')">
        <template v-slot="data">
          <span v-if="data.row.executeType === 1">{{ $t('development.task.field.perform.manually') }}</span>
          <span v-if="data.row.executeType === 2">{{ $t('development.task.field.schedule.execution') }}</span>
          <span v-if="data.row.executeType === 3">{{ $t('development.task.field.plan.execution') }}</span>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="beginDate" :title="$t('common.text.begin.time')"></tiny-grid-column>
      <tiny-grid-column field="endDate" :title="$t('common.text.end.time')"></tiny-grid-column>

      <tiny-grid-column :title="$t('service.api.log.field.status')">
        <template v-slot="data">
          <span v-if="data.row.status === 1" style="color: #24DD7F;">{{ $t('common.text.success') }}</span>
          <span v-if="data.row.status === 2" style="color: red">{{ $t('common.text.fail') }}</span>
        </template>
      </tiny-grid-column>

      <tiny-grid-column :title="$t('common.text.result')">
        <template v-slot="data">
          <tiny-popover placement="left" width="600">
            <json-viewer style="height: 400px;overflow-y: auto;"
                         :preview-mode="false"
                         :expanded="false"
                         :copyable="true"
                         :value="isEmpty(data.row.logContent) ? data.row.errMessage : data.row.logContent" />
            <template #reference>
              <tiny-link :underline="false" style="color: #1ac456;font-size: 12px;">{{ t('查看执行日志') }}
              </tiny-link>
            </template>
          </tiny-popover>
        </template>
      </tiny-grid-column>

      <tiny-grid-column :title="$t('详情')" width="80" align="center">
        <template v-slot="data">
          <tiny-button type="success" :icon="iconEyeopen()" size="mini" circle
                       :title="$t('查看详情')"
                       @click="handleOpen(data.row)"/>
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
  </div>
  <div v-else>
    <div class="left-tool">
      <tiny-button type="warning" :icon="iconUndo()" size="mini" circle
                   :title="$t('返回')"
                   @click="back"/>
      <tiny-link style="margin-left: 10px" type="success" :underline="false"
                 :value="rowModel.jobId"/>
    </div>
    <div style="padding-top: 30px">
      <tiny-tabs v-model="activeTab">
        <tiny-tab-item :title="$t('作业信息')" lazy name="1">
          <table border="1" style="width: 100%;margin-top: 5px;border-collapse: collapse; border: 1px solid #fafafa;">
            <tbody >
            <tr>
              <td class="table-label">{{$t('状态')}}</td>
              <td class="table-co">
                <span v-if="rowModel.status === 1" style="color: #24DD7F;">{{ $t('common.text.success') }}</span>
                <span v-if="rowModel.status === 2" style="color: red">{{ $t('common.text.fail') }}</span>
              </td>
              <td class="table-label">{{$t('提交模式')}}</td>
              <td class="table-co">
                <span v-if="flinkTaskData.flinkType === 1" style="color: #24DD7F;">{{ $t('standalone') }}</span>
                <span v-if="flinkTaskData.flinkType === 2" style="color: #24DD7F;">{{ $t('yarn session') }}</span>
                <span v-if="flinkTaskData.flinkType === 3" style="color: #24DD7F;">{{ $t('yarn application') }}</span>
                <span v-if="flinkTaskData.flinkType === 4" style="color: #24DD7F;">{{ $t('kubernetes session') }}</span>
                <span v-if="flinkTaskData.flinkType === 5" style="color: #24DD7F;">{{ $t('kubernetes application') }}</span>
                <span v-if="flinkTaskData.flinkType === 6" style="color: #24DD7F;">{{ $t('kubernetes operator') }}</span>
              </td>
              <td class="table-label">{{$t('重启策略')}}</td>
              <td class="table-co">
                <span style="color: #24DD7F;">{{ $t('Cluster level default restart strategy') }}</span>
              </td>
            </tr>
            <tr style="margin-top: 10px">
              <td class="table-label">{{$t('作业并行度')}}</td>
              <td class="table-co">
                <span style="color: #24DD7F;">{{ flinkTaskData.configObject?.parallelism }}</span>
              </td>
              <td class="table-label">{{$t('执行模式')}}</td>
              <td class="table-co">
                <span v-if="flinkTaskData.configObject?.isBatch === 0" style="color: #24DD7F;">{{ $t('流模式') }}</span>
                <span v-if="flinkTaskData.configObject?.isBatch === 1" style="color: #24DD7F;">{{ $t('批模式') }}</span>
              </td>
              <td class="table-label">{{$t('语句集')}}</td>
              <td class="table-co">
                <span v-if="flinkTaskData.configObject?.insert === 0" style="color: #24DD7F;">{{ $t('禁用') }}</span>
                <span v-if="flinkTaskData.configObject?.insert === 1" style="color: #24DD7F;">{{ $t('启用') }}</span>
              </td>
            </tr>
            <tr>
              <td class="table-label">{{$t('全局变量')}}</td>
              <td class="table-co">
                <span v-if="flinkTaskData.configObject?.globalVariable === 0" style="color: #24DD7F;">{{ $t('禁用') }}</span>
                <span v-if="flinkTaskData.configObject?.globalVariable === 1" style="color: #24DD7F;">{{ $t('启用') }}</span>
              </td>
              <td class="table-label">{{$t('Savepoint启动')}}</td>
              <td class="table-co">
                <span v-if="flinkTaskData.configObject?.savepoint === 1" style="color: #24DD7F;">{{ $t('禁用') }}</span>
                <span v-if="flinkTaskData.configObject?.savepoint === 2" style="color: #24DD7F;">{{ $t('最近一次') }}</span>
                <span v-if="flinkTaskData.configObject?.savepoint === 3" style="color: #24DD7F;">{{ $t('最早一次') }}</span>
                <span v-if="flinkTaskData.configObject?.savepoint === 4" style="color: #24DD7F;">{{ $t('指定一次') }}</span>
              </td>
              <td class="table-label">{{$t('Savepoint路径')}}</td>
              <td class="table-co">
                <span style="color: #24DD7F;">{{ flinkTaskData.configObject?.savepointPath }}</span>
              </td>
            </tr>
            </tbody>
          </table>

          <div class="app-content" ref="container">
          </div>

          <tiny-grid :data="rowModel.logModel?.jobObject?.vertices"
                     height="200px"
                     size="small"
                     border
                     :stripe="true"
                     highlight-hover-row
                     resizable
                     show-header-overflow="tooltip" show-overflow="tooltip">
            <tiny-grid-column field="name" :title="$t('任务名称')"></tiny-grid-column>
            <tiny-grid-column field="status" :title="$t('状态')">
              <template v-slot="data">
                <span v-if="data.row.status === 'FINISHED'" style="color: #24DD7F;">{{data.row.status}}</span>
                <span v-else-if="data.row.status === 'RUNNING'" style="color: #faf07f;">{{data.row.status}}</span>
                <span v-else-if="data.row.status === 'FAILED'" style="color: red;">{{data.row.status}}</span>
                <span v-else style="color: #c4891a;">{{data.row.status}}</span>
              </template>
            </tiny-grid-column>
            <tiny-grid-column field="metrics.read-bytes" :title="$t('接收字节')"></tiny-grid-column>
            <tiny-grid-column field="metrics.read-records" :title="$t('接收记录')"></tiny-grid-column>
            <tiny-grid-column field="metrics.write-bytes" :title="$t('发送字节')"></tiny-grid-column>
            <tiny-grid-column field="metrics.write-records" :title="$t('发送记录')"></tiny-grid-column>
            <tiny-grid-column field="parallelism" :title="$t('并行度')"></tiny-grid-column>
            <tiny-grid-column field="start-time" :title="$t('开始时间')">
<!--              <template v-slot="data">
                <span v-if="data.row.start-time">{{dayjs(data.row.start-time).format('YYYY-MM-DD')}}</span>
                <span v-else>-</span>
              </template>-->
            </tiny-grid-column>
            <tiny-grid-column field="end-time" :title="$t('结束时间')"></tiny-grid-column>
            <tiny-grid-column field="duration" :title="$t('耗时')"></tiny-grid-column>
          </tiny-grid>
        </tiny-tab-item>
        <tiny-tab-item :title="$t('作业日志')" lazy name="2">
          <tiny-tabs v-model="logTab" position="left" overflow-title>
            <tiny-tab-item :title="$t('Log')" lazy name="1">
              <monacoEditor theme="vs"
                            height="600px"
                            v-model="rowModel.logModel.logs"
                            language="text">
              </monacoEditor>
            </tiny-tab-item>
            <tiny-tab-item :title="$t('Exception')" lazy name="2">
              <monacoEditor theme="vs"
                            height="600px"
                            v-model="rowModel.logModel.exceptionObject['root-exception']"
                            language="text">
              </monacoEditor>
            </tiny-tab-item>
            <tiny-tab-item :title="$t('Std Out')" lazy name="3">
              <monacoEditor theme="vs"
                            height="600px"
                            v-model="rowModel.logModel.stdout"
                            language="text">
              </monacoEditor>
            </tiny-tab-item>
            <tiny-tab-item :title="$t('Thread Dump')" lazy name="4">
              <monacoEditor theme="vs"
                            height="600px"
                            v-model="threadDump"
                            language="text">
              </monacoEditor>
            </tiny-tab-item>
          </tiny-tabs>
        </tiny-tab-item>
        <tiny-tab-item :title="$t('版本信息')" lazy name="3">
          <tiny-tabs v-model="versionTab" position="left" overflow-title>
            <tiny-tab-item :title="$t('当前版本')" lazy :name="'version'">
              <monacoEditor theme="vs"
                            height="600px"
                            v-model="flinkTaskData.executeSql"
                            language="sql">
              </monacoEditor>
            </tiny-tab-item>
            <tiny-tab-item v-for="(item, index) in recordData" :key="index" :title="'V ' + (recordData.length - index) + $t('版本')" lazy :name="item.id">
              <monacoEditor theme="vs"
                            height="600px"
                            v-model="item['beginSql']"
                            language="sql">
              </monacoEditor>
            </tiny-tab-item>
          </tiny-tabs>
        </tiny-tab-item>
        <tiny-tab-item :title="$t('作业快照')" lazy name="4">
          <table border="1" style="width: 100%;margin-top: 5px;border-collapse: collapse; border: 1px solid #fafafa;">
            <tbody >
            <tr>
              <td class="table-label-l">{{$t('Checkpoint Mode')}}</td>
              <td class="table-co-l">
                <span style="color: #24DD7F;">{{ rowModel.logModel.checkpointConfigObject['mode'] }}</span>
              </td>
              <td class="table-label-l">{{$t('Interval')}}</td>
              <td class="table-co-l">
                <span style="color: #24DD7F;">{{ rowModel.logModel.checkpointConfigObject['interval'] }}</span>
              </td>
              <td class="table-label-l">{{$t('Timeout')}}</td>
              <td class="table-co-l">
                <span style="color: #24DD7F;">{{ rowModel.logModel.checkpointConfigObject['timeout'] }}</span>
              </td>
            </tr>
            <tr style="margin-top: 10px">
              <td class="table-label-l">{{$t('Unaligned Checkpoints')}}</td>
              <td class="table-co-l">
                <span style="color: #24DD7F;">{{ rowModel.logModel.checkpointConfigObject['unaligned_checkpoints'] }}</span>
              </td>
              <td class="table-label-l">{{$t('Latest Restored')}}</td>
              <td class="table-co-l">
                <span v-if="!isEmpty(rowModel.logModel.checkpointObject.latest.restored)" style="color: #24DD7F;">{{ rowModel.logModel.checkpointObject.latest.restored }}</span>
                <span v-else style="color: #24DD7F;">None</span>
              </td>
              <td class="table-label-l">{{$t('Latest Failed CheckPoint')}}</td>
              <td class="table-co-l">
                <span v-if="!isEmpty(rowModel.logModel.checkpointObject.latest['failed'])" style="color: #24DD7F;">{{ rowModel.logModel.checkpointObject.latest['failed']  }}</span>
                <span v-else style="color: #24DD7F;">None</span>
              </td>
            </tr>
            <tr>
              <td class="table-label-l">{{$t('Latest Completed CheckPoint')}}</td>
              <td class="table-co-l">
                <span v-if="!isEmpty(rowModel.logModel.checkpointObject.latest['completed'])" style="color: #24DD7F;">{{ rowModel.logModel.checkpointObject.latest['completed'] }}</span>
                <span v-else style="color: #24DD7F;">None</span>
              </td>
              <td class="table-label-l">{{$t('Persist Checkpoints Externally Enabled')}}</td>
              <td class="table-co-l">
                <span style="color: #24DD7F;">{{ rowModel.logModel.checkpointConfigObject.externalization.enabled }}</span>
              </td>
              <td class="table-label-l">{{$t('Latest Savepoint')}}</td>
              <td class="table-co-l">
                <span v-if="!isEmpty(rowModel.logModel.checkpointObject.latest['savepoint'] )" style="color: #24DD7F;">{{ rowModel.logModel.checkpointObject.latest['savepoint'] }}</span>
                <span v-else style="color: #24DD7F;">None</span>
              </td>
            </tr>
            <tr>
              <td class="table-label-l">{{$t('CheckPoint Counts')}}</td>
              <td clospan="6">
                <div class="table-co-l-counts">
                  <span style="color: #1a78c4;"> {{ 'Total: ' + rowModel.logModel.checkpointObject.counts['total'] }}</span>
                  <span style="color: red;margin-left:15px;"> {{ 'Failed: ' + rowModel.logModel.checkpointObject.counts['failed'] }}</span>
                  <span style="color: #311ac4;margin-left:15px;"> {{ 'Restored: ' + rowModel.logModel.checkpointObject.counts['restored'] }}</span>
                  <span style="color: #24DD7F;margin-left:15px;"> {{ 'Completed: ' + rowModel.logModel.checkpointObject.counts['completed'] }}</span>
                  <span style="color: #c4891a;margin-left:15px;"> {{ 'In Progress: ' + rowModel.logModel.checkpointObject.counts['in_progress'] }}</span>
                </div>

              </td>
            </tr>
            </tbody>
          </table>

          <tiny-tabs v-model="checkTab">
            <tiny-tab-item :title="$t('History')" lazy name="1">
              <tiny-grid style="margin-top: 10px" :data="rowModel.logModel?.checkpointObject?.history"
                         size="small"
                         border
                         :stripe="true"
                         highlight-hover-row
                         resizable
                         show-header-overflow="tooltip" show-overflow="tooltip">
                <tiny-grid-column field="status" :title="$t('状态')">
                  <template v-slot="data">
                    <span v-if="data.row.status === 'FINISHED'" style="color: #24DD7F;">{{data.row.status}}</span>
                    <span v-if="data.row.status === 'RUNNING'" style="color: #faf07f;">{{data.row.status}}</span>
                    <span v-if="data.row.status === 'FAILED'" style="color: red;">{{data.row.status}}</span>
                    <span v-else style="color: #c4891a;">{{data.row.status}}</span>
                  </template>
                </tiny-grid-column>
                <tiny-grid-column field="metrics.read-bytes" :title="$t('耗时')"></tiny-grid-column>
                <tiny-grid-column field="metrics.read-records" :title="$t('类型')"></tiny-grid-column>
                <tiny-grid-column field="metrics.write-bytes" :title="$t('存储位置')"></tiny-grid-column>
                <tiny-grid-column field="metrics.write-records" :title="$t('最后响应时间')"></tiny-grid-column>
                <tiny-grid-column field="parallelism" :title="$t('状态大小')"></tiny-grid-column>
                <tiny-grid-column field="start-time" :title="$t('触发时间')">
                  <!--              <template v-slot="data">
                                  <span v-if="data.row.start-time">{{dayjs(data.row.start-time).format('YYYY-MM-DD')}}</span>
                                  <span v-else>-</span>
                                </template>-->
                </tiny-grid-column>
                <tiny-grid-column field="end-time" :title="$t('操作')"></tiny-grid-column>
              </tiny-grid>
            </tiny-tab-item>
            <tiny-tab-item :title="$t('SavePoint')" lazy name="2">
              <tiny-grid style="margin-top: 10px" :data="rowModel.logModel?.checkpointObject?.history"
                         size="small"
                         border
                         :stripe="true"
                         highlight-hover-row
                         resizable
                         show-header-overflow="tooltip" show-overflow="tooltip">
                <tiny-grid-column field="status" :title="$t('名称')">
                  <template v-slot="data">
                    <span v-if="data.row.status === 'FINISHED'" style="color: #24DD7F;">{{data.row.status}}</span>
                    <span v-if="data.row.status === 'RUNNING'" style="color: #faf07f;">{{data.row.status}}</span>
                    <span v-if="data.row.status === 'FAILED'" style="color: red;">{{data.row.status}}</span>
                    <span v-else style="color: #c4891a;">{{data.row.status}}</span>
                  </template>
                </tiny-grid-column>
                <tiny-grid-column field="metrics.read-records" :title="$t('类型')"></tiny-grid-column>
                <tiny-grid-column field="metrics.write-bytes" :title="$t('存储位置')"></tiny-grid-column>
                <tiny-grid-column field="start-time" :title="$t('触发时间')">
                  <!--              <template v-slot="data">
                                  <span v-if="data.row.start-time">{{dayjs(data.row.start-time).format('YYYY-MM-DD')}}</span>
                                  <span v-else>-</span>
                                </template>-->
                </tiny-grid-column>
                <tiny-grid-column field="end-time" :title="$t('操作')"></tiny-grid-column>
              </tiny-grid>
            </tiny-tab-item>
          </tiny-tabs>


        </tiny-tab-item>
        <tiny-tab-item :title="$t('SQL血缘')" lazy name="5">
          <tiny-tabs v-model="lineageName">
            <tiny-tab-item :title="$t('lineage.table')" lazy name="LineageTable">
              <LineageGraph :key="nanoid(8)" :level="'table'"
                            :graphData="lineageTableData"></LineageGraph>
            </tiny-tab-item>

            <tiny-tab-item :title="$t('lineage.column')" lazy name="LineageColumn">
              <LineageGraph :key="nanoid(8)" :level="'column'"
                            :graphData="lineageColumnData"></LineageGraph>
            </tiny-tab-item>
          </tiny-tabs>
        </tiny-tab-item>
        <tiny-tab-item :title="$t('告警记录')" style="height: 900px" lazy name="6">
          <IframeParent :data="data" server-name="das" component-path="/src/views/alarm/instance/components/alarm-instance.vue"></IframeParent>
        </tiny-tab-item>
      </tiny-tabs>
    </div>
  </div>

  <div>
    <tiny-drawer :title="$t('development.task.field.historical.records')"
                 :visible="recordDrawer"
                 @update:visible="recordDrawer = $event"
                 width="800px">
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
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Graph } from '@antv/x6'
import { useI18n } from 'vue-i18n'
import { formPage } from '@/utils/tool'
import { iconFolderOpened, iconHalfchecked, iconPauseCircle, iconStartCircle,iconVersiontree,iconEyeopen,iconUndo,iconChevronRight } from '@opentiny/vue-icon'
import { FlinkTaskTriggersService } from '@/services/development/task-triggers'
import { isEmpty } from 'lodash-es'
import { addTimeToDate, formatDateTime } from '@/utils/date'
import { Modal } from '@opentiny/vue'
import { FlinkSqlVersionService } from '@/services/development/sql-version'
import { FlinkTaskService } from '@/services/development/task'
import { CodeDiff } from 'v-code-diff'
import { nanoid } from 'nanoid'
import LineageGraph from '@/views/lineage/lineage-graph.vue'
import { LineageService } from '@/services/governance/lineage'
import IframeParent from '@/views/components/iframe-parent.vue'


const IconFolderOpened = iconFolderOpened()

const { t } = useI18n()
const data = ref({
  type: 2,
  title: false
})
const tableData = ref()
const lineageTableData = ref()
const lineageColumnData = ref()
const searchValue = ref('')
const executeDate = ref()
const recordDrawer = ref(false)
const recordData = ref()
const versionTab = ref('version')
const lineageName = ref('LineageTable')
const showBreadcrumb = defineModel('showBreadcrumb', { default: true })
const status = defineModel('status', { default: -1 })
const flinkTaskData = defineModel('flinkTaskData', {
  default: {
    id: 0,
    pid: 0,
    flinkType: 0,
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
})

const activeTab = ref('1')
const logTab = ref('1')
const checkTab = ref('1')
const rowModel = ref()
const threadDump = ref()
const container = ref<HTMLDivElement | null>(null)
const graph = ref<any>()

const handleOpen = async (data: any) => {
  rowModel.value = data
  if(data.logModel && data.logModel.threadDumpObject && data.logModel.threadDumpObject.threadInfos){
    let dump = '';
    data.logModel.threadDumpObject.threadInfos.forEach((item:any) => {
      dump += item.stringifiedThreadInfo
    })
    threadDump.value = dump
  }

  recordData.value = await FlinkSqlVersionService.getList({
    model: {
      taskId: flinkTaskData.value.id
    }
  })
  await lineageClick()
}


watchEffect(async () => {
  if (container.value) {
    graph.value = new Graph({
      container: container.value,
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
    if(rowModel.value && rowModel.value.logModel
      && rowModel.value.logModel.jobObject
      && rowModel.value.logModel.jobObject.vertices){
      let nodes:any = []
      let edges:any = []
      let startNodeId = ""
      let edgeLable = ""
      let x = 0
      rowModel.value.logModel.jobObject.vertices.forEach((item:any) => {
        if(x === 0){
          x = 150
        }else{
          x = x + 360
        }
        let name = item.name
        if(item.name.length > 30){
          name =  item.name.substring(0,30) + "..."
        }

        let busy = item.metrics['accumulated-busy-time']
        if(busy === 'NaN' || busy > item.duration){
          busy = 0
        }
        let backpressured = item.metrics['accumulated-backpressured-time']
        if(backpressured === 'NaN' || backpressured > item.duration){
          backpressured = 0
        }
        let idle = item.metrics['accumulated-idle-time']
        if(idle === 'NaN' || idle > item.duration){
          idle = 0
        }
        let total = busy + backpressured + idle
        if(total > 0){
          busy = (busy / total * 100).toFixed(2)
          backpressured = (backpressured / total * 100).toFixed(2)
          idle = (idle / total * 100).toFixed(2)
        }


        let lable = name + "\n\n"
          +t('并行度') +":" + item.parallelism +"   "+ t('状态') + ":" + item.status + "\n\n"
          + t('繁忙') + ":" + busy + "%   " + t('反压') + ":" + backpressured + "%   " + t('空闲') + ":" + idle + "%   "
        nodes.push({
          id: item.id,
          shape: 'rect',
          x: x,
          y: 100,
          width: 260,
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
        })
        if(startNodeId === ""){
          startNodeId = item.id
          edgeLable = "HASH"
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
          edgeLable = "FORWARD"
        }
      })
      graph.value.fromJSON({
        nodes: nodes,
        edges: edges
      })
    }

  }
})
const back = () => {
  rowModel.value = {}
}

const lineageClick = async () => {
  let param: any = {}
  param.sql = flinkTaskData.value.executeSql
  const result = await LineageService.parseScript(param)
  if (result.code == 0) {
    let json = JSON.parse(result.data)
    lineageTableData.value = json.dag
    lineageColumnData.value = json.column
  }
}

const saveLoading = ref(false)
const run = async (data: any, type: any, msg: string, successMsg: string, errorMsg: string) => {
  Modal.confirm(t(msg)).then(async (res: string) => {
    if (res === 'confirm') {
      saveLoading.value = true
      let result: boolean | void = true
      if (type == 1) {
        const res = await FlinkTaskService.execute({
          isExplain: false,
          model: flinkTaskData.value
        })
      } else if (type == 2) {

      } else if (type == 3) {

      }
      saveLoading.value = false
      if (result) {
        Modal.message({
          message: t(successMsg),
          status: 'success'
        })
      } else {
        Modal.message({
          message: t(errorMsg),
          status: 'error'
        })
      }
      await search()
    }
  })
}

const handleVersion = async () => {
  recordDrawer.value = true
  recordData.value = await FlinkSqlVersionService.getList({
    model: {
      taskId: flinkTaskData.value.id
    }
  })
}

const diffDrawer = ref(false)
const diffTitle = ref()
const oldText = ref(false)
const newText = ref(false)
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
        Modal.message({
          message: t('development.task.prompt.records.restore.success'),
          status: 'success'
        })
        recordDrawer.value = false
      }
    })
  }
}

const search = async () => {
  if (flinkTaskData.value.type > 0) {
    let begTime: any
    let endTime: any
    if (!isEmpty(executeDate.value)) {
      begTime = executeDate.value[0]
      endTime = addTimeToDate(executeDate.value[1], 23, 59, 59)
    }
    if (begTime && endTime) {
      begTime = formatDateTime(begTime)
      endTime = formatDateTime(endTime)
    }

    const result = await FlinkTaskTriggersService.getPage({
      page: formPage.value.page,
      limit: formPage.value.limit,
      beginDate: begTime,
      endDate: endTime,
      model: {
        taskId: flinkTaskData.value.id,
        jobId: searchValue.value,
        status: status.value
      }
    })
    tableData.value = result.list
    formPage.value.total = result.total
  } else {
    tableData.value = []
    formPage.value.total = 0
  }
}

watchEffect(async () => {
  if (flinkTaskData.value.id >= 0) {
    await search()
    rowModel.value = {}
  }
})

const pageChange = (page: number) => {
  formPage.value.page = page
  search()
}

const limitChange = (limit: number) => {
  formPage.value.limit = limit
  search()
}
</script>

<style scoped lang="less">
.span-font {
  color: #3ac295;
}

.container-list {
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.tiny-breadcrumb .tiny-breadcrumb__item:last-child .tiny-breadcrumb__inner) {
    font-weight: 500;
    color: #2c3e50;
    text-decoration: none;
  }

  :deep(.container-breadcrumb) {
    font-size: 12px;
    margin: 0 10px 10px 0;
  }
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
  width: calc(60vh + 100px);
  margin-bottom: 10px;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }
}

.svg-dir {
  fill: #ffcc41;
}

.svg-file {
  fill: #1ac456;
}

.tool {
  position: absolute;
  right: 2%;

  .link-exec {
    margin-left: 10px;
  }
}

.left-tool {
  position: absolute;
  padding-right: 10px;


  .tiny-link {
    font-size: 12px;
  }

  :deep(.tiny-link .tiny-link-svg) {
    margin-right: 3px;
    margin-left: 0;
  }

  .tiny-tag {
    margin-left: 10px;
  }

  .tiny-checkbox {
    position: absolute;
    margin: 5px 0 0 10px;
  }
}

.table-label{
  width: 10%;
  height: 40px;
  font-size: 12px;
  color:rgba(1,3,10,1);
  padding-left: 5px;
  background-color: #fafafa;
}
.table-co{
  width: 25%;
  font-size: 12px;
}

.table-label-l{
  width: 20%;
  height: 40px;
  font-size: 12px;
  color:rgba(1,3,10,1);
  padding-left: 5px;
  background-color: #fafafa;
}
.table-co-l{
  width: 15%;
  font-size: 12px;
}

.table-co-l-counts {
  position: absolute;
  font-size: 12px;
}

.app-content {
  flex: 1;
  height: 300px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
}
</style>
