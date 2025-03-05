<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-bloodline']" />
    <div class="contain">
      <tiny-tabs v-model="activeTab" @click="tabClickHandle">
        <!--sql脚本-->
        <tiny-tab-item :title="$t('lineage.sqlscript')" lazy name="SqlScript">
          <div class="tool-bar">
            <tiny-select v-model="selectDialect">
              <tiny-option
                v-for="item in dialects.sqlfluff"
                :key="item"
                :label="item"
                :value="item"
              >
              </tiny-option>
            </tiny-select>
            <tiny-button type="primary" :icon="TinyIconSave" @click="saveHandle"
              >{{ t('common.operations.save') }}
            </tiny-button>
            <tiny-button :icon="TinyIconCode" @click="parseHandle"
              >{{ t('common.operations.parse') }}
            </tiny-button>
          </div>
          <keep-alive>
            <div id="editArea" style="border: 1px solid green; margin-top: 5px">
              <monacoEditor
                ref="buildRef"
                v-model="scriptValue"
                overviewRulerBorder="false"
                cursorSmoothCaretAnimation="true"
                formatOnPaste="true"
                mouseWheelZoom="true"
                folding="true"
                automaticLayout="true"
                glyphMargin="true"
                theme="vs"
                language="sql"
              >
              </monacoEditor>
            </div>
          </keep-alive>
        </tiny-tab-item>

        <!--表级血缘-->
        <tiny-tab-item :title="$t('lineage.table')" lazy name="LineageTable">
          <LineageGraph :key="nanoid(8)" :level="level" :graphData="tableData"></LineageGraph>
        </tiny-tab-item>

        <!--字段血缘-->
        <tiny-tab-item :title="$t('lineage.column')" lazy name="LineageColumn">
          <LineageGraph :key="nanoid(8)" :level="level" :graphData="columnData"></LineageGraph>
        </tiny-tab-item>
      </tiny-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MonacoEditor from '@/components/monaco-editor/monaco-editor.vue'
import { useI18n } from 'vue-i18n'
import { iconCode, iconSave } from '@opentiny/vue-icon'
import { LineageService } from '@/services/governance/lineage'
import LineageGraph from '@/views/lineage/lineage-graph.vue'
import { Loading, Modal } from '@opentiny/vue'
import { nanoid } from 'nanoid'

const loadingInstance = ref<any>(null)
const TinyIconSave = iconSave()
const TinyIconCode = iconCode()
const { t } = useI18n()
const activeTab = ref('SqlScript')
const scriptValue = ref('')
const selectDialect = ref('ansi')
const dialects = ref({
  sqlfluff: [
    'ansi',
    'athena',
    'bigquery',
    'clickhouse',
    'databricks',
    'db2',
    'duckdb',
    'exasol',
    'greenplum',
    'hive',
    'materialize',
    'mysql',
    'oracle',
    'postgres',
    'redshift',
    'snowflake',
    'soql',
    'sparksql',
    'sqlite',
    'teradata',
    'trino',
    'tsql'
  ],
  sqlparse: ['non-validating']
})
const level = ref('table')
const tableData = ref([])
const columnData = ref([])
const tabClickHandle = (tabs: any) => {
  if (tabs.name == 'LineageTable' || tabs.name == 'LineageColumn') {
    level.value = tabs.name == 'LineageTable' ? 'table' : 'column'
  }
}

const closeLoading = () => {
  loadingInstance.value.close()
}

const openLoading = () => {
  loadingInstance.value = Loading.service({
    target: document.getElementById('editArea'),
    background: 'rgba(255,255,255,0.2)',
    size: 'large',
    text: t('common.loading.parse')
  })
}

//保存
const saveHandle = () => {}

//解析
const parseHandle = async () => {
  let param: any = {}
  param.dialect = selectDialect.value || 'ansi'
  param.sql = scriptValue.value
  if (scriptValue.value) {
    openLoading()
    const result = await LineageService.parseScript(param)
    if (result.code == 0) {
      let json = JSON.parse(result.data)
      tableData.value = json.dag
      columnData.value = json.column
      closeLoading()
    } else {
      closeLoading()
      Modal.message({
        message: result.message,
        status: 'error'
      })
    }
  }
}
</script>

<style scoped lang="less">
.container-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.tiny-select__tags .tiny-select__tags-text.is-disabled > span) {
    color: #000000;
    font-size: var(--ti-tag-font-size);
    margin: var(--ti-select-tags-margin-top) var(--ti-select-tags-margin-right)
      var(--ti-select-tags-margin-bottom) var(--ti-select-tags-margin-left);
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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

  :deep(.tool-bar) {
    text-align: right;
    margin-right: 5px;
  }

  :deep(.tool-bar .tiny-select) {
    width: auto;
    margin-right: 5px;
  }
}

.status {
  &-dot {
    position: relative;
    top: -1px;
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    vertical-align: middle;
    background-color: #1890ff;
    border-radius: 50%;
  }

  &-closed {
    .status-dot {
      background-color: #d9d9d9;
    }
  }

  &-finished {
    .status-dot {
      background-color: #52c41a;
    }
  }
}

.grid-toolbar {
  display: flex;
  justify-content: right;
  width: 400px;

  button {
    margin-left: 5px;
  }
}

.down-ds {
  width: 100%;
  margin-left: 5px;
}

.down-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}

.codeEditBox {
  margin-top: 15px;
  height: calc(100vh - 310px);
}
</style>
