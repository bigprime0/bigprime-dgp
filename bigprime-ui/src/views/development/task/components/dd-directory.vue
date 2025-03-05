<template>
  <div class="div-icon">
    <div class="option-row">
      <tiny-input v-model="filterText"
                  :prefix-icon="IconSearch"
                  @input="inputChange"
                  clearable @clear="inputChange"
                  :placeholder="$t('common.search.placeholder')">

      </tiny-input>
    </div>
    <tiny-tree
      ref="flinkTaskTreeRef"
      node-key="id"
      :data="flinkTaskTreeList"
      :default-expand-all=true
      :expand-on-click-node=false
      :show-line=true
      indent="10px"
      :filter-node-method="filterNodeMethod"
      @node-click="nodeClick"
      @mouseleave="mouseoverEvent(-2)"
    >
      <template #prefix="{node}">
        <IconEditorCode v-if="node.data.type === 1" class="svg-code" />
        <IconZipType v-else-if="node.data.type === 2" class="svg-jar" />
        <IconFolderOpened v-else class="svg-dir" />
      </template>
      <template #default="{node}">
        <div class="div-default" @mouseover="mouseoverEvent(node.data.id)">{{ node.data.name }}</div>
      </template>
      <template #operation="{node}">
        <div v-if="showId === node.data.id && edit === true">
          <span v-if="node.data.id > 0" @click.stop="editNode(node)"
                :title="$t('common.operations.update')">
            <IconWriting></IconWriting>
          </span>
          <span v-if="node.data.type === 0" @click.stop="addNode(node)"
                :title="$t('common.operations.add')">
            <IconPlusSquare></IconPlusSquare>
          </span>
          <span v-if="node.data.id > 0 && isEmpty(node.data.children) && node.data.status === 0"
                @click.stop="deleteNode(node)"
                :title="$t('common.operations.delete')">
            <IconMinusSquare></IconMinusSquare>
          </span>
        </div>
      </template>
    </tiny-tree>
  </div>

  <div>
    <tiny-drawer :title="flinkTaskFormTitle"
                 :visible="flinkTaskFormDrawer"
                 @update:visible="flinkTaskFormDrawer = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="closeFlinkTaskForm(false)">
      <div>
        <suspense>
          <DdTaskForm :flink-task-form-data="flinkTaskFormData"></DdTaskForm>
        </suspense>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Modal, Tree as TinyTree } from '@opentiny/vue'
import {
  iconEditorCode,
  iconFolderOpened,
  iconMinusSquare,
  iconPlusSquare,
  iconSearch,
  iconWriting,
  iconZipType
} from '@opentiny/vue-icon'
import { useI18n } from 'vue-i18n'
import { assign, cloneDeep, isEmpty } from 'lodash-es'
import { FlinkTaskService } from '@/services/development/task'
import emitter from '@/utils/evnetbus'
import DdTaskForm from '@/views/development/task/components/dd-task-form.vue'

const IconFolderOpened = iconFolderOpened()
const IconPlusSquare = iconPlusSquare()
const IconMinusSquare = iconMinusSquare()
const IconWriting = iconWriting()
const IconSearch = iconSearch()
const IconEditorCode = iconEditorCode()
const IconZipType = iconZipType()

const edit = defineModel('edit', { default: true })
const showId = ref(-2)
const filterText = ref()

const { t } = useI18n()
const flinkTaskTreeList = ref([{
  id: 0,
  pid: 0,
  configId: 0,
  schedulerJobId: 0,
  name: t('development.task.field.job'),
  type: 0,
  pidName: t('development.task.field.job'),
  executeSql: '',
  configMap: {},
  status: 0,
  executeStatus: 0,
  executeDate: '',
  summary: '',
  children: []
}])
const flinkTaskTreeRef = ref()

const search = async () => {
  let result = await FlinkTaskService.getTreeList()
  result.forEach(o => {
    setParentName(o, t('development.task.field.job'))
  })
  flinkTaskTreeList.value[0].children = result
}

const inputChange = () => {
  flinkTaskTreeRef.value.filter(filterText.value)
}
const filterNodeMethod = (text: any, data: any) => {
  return data.name.includes(text)
}

const flinkTaskFormDrawer = ref(false)
const flinkTaskFormTitle = ref('')
const flinkTaskFormData = ref()
const flinkTaskFormDataCopy = ref()
const addNode = (node: any) => {
  flinkTaskFormTitle.value = t('common.text.add.data')
  flinkTaskFormData.value = {
    id: 0,
    pid: node.data.id,
    configId: 0,
    schedulerJobId: 0,
    name: '',
    type: 0,
    pidName: node.data.pidName,
    executeSql: '',
    configMap: {},
    status: 0,
    executeStatus: 0,
    executeDate: '',
    summary: ''
  }
  flinkTaskFormDrawer.value = true
}
const editNode = (node: any) => {
  flinkTaskFormTitle.value = t('common.text.update.data')
  flinkTaskFormData.value = node.data
  flinkTaskFormDataCopy.value = cloneDeep(node.data)
  flinkTaskFormDrawer.value = true
}

const deleteNode = (node: any) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      const result = await FlinkTaskService.deleteById(node.data.id)
      if (result) {
        flinkTaskTreeRef.value.remove(node)
      }
    }
  })
}

const closeFlinkTaskForm = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(flinkTaskFormData.value, flinkTaskFormDataCopy.value)
  }
  flinkTaskFormDrawer.value = false
}

emitter.on('closeFlinkTaskForm', (isUp) => {
  closeFlinkTaskForm(isUp)
})

const mouseoverEvent = (id: any) => {
  showId.value = id
}
const nodeClick = (data: any) => {
  emitter.emit('dd-directory-data-click', {
    data: data
  })
}

const setParentName = (data: any, parentName: string) => {
  if (!isEmpty(data.children)) {
    data.children.forEach((c: any) => {
      setParentName(c, parentName + ' / ' + data.name)
    })
  }
  data.pidName = parentName + ' / ' + data.name
}

onMounted(() => {
  search()
})

</script>

<style scoped lang="less">
.option-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.div-default {
  width: 100%;
  font-size: var(--ti-tree-small-node-font-size);
}

.div-icon {

  :deep(.tiny-tree-node .tiny-tree-node__content-right) {
    display: flex;
    -webkit-box-align: center;
    align-items: baseline;
    height: 100%;
    text-align: right;
  }

  :deep(.tiny-tree-node .tiny-tree-node__content-right svg) {
    fill: #5e7ce0;
    font-size: var(--ti-tree-node-operate-icon-font-size);
    margin-right: var(--ti-tree-node-operate-icon-margin-left);
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  :deep(.tiny-tree-node .tiny-tree-node__content-right svg:hover) {
    fill: #52c41a;
    font-size: var(--ti-tree-node-operate-icon-font-size);
    margin-right: var(--ti-tree-node-operate-icon-margin-left);
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  :deep(.tiny-tree-node__expand-icon.is-leaf) {
    visibility: hidden;
    margin-left: -50px;
  }

  :deep(.tiny-tree-node .tiny-tree-node__content-left svg) {
    font-size: var(--ti-tree-node-operate-icon-font-size);
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  :deep(.tiny-tree-node .tiny-tree-node__content-left .tree-node-icon) {
    visibility: hidden;
  }

  :deep(.tiny-tree-node .tiny-tree-node__content-left .tree-node-icon svg) {
    margin-left: -60px;
  }
}

.svg-dir {
  fill: #ffcc41;
}

.svg-code {
  fill: #1ac456;
}

.svg-jar {
  fill: #1ac456;
}
</style>
