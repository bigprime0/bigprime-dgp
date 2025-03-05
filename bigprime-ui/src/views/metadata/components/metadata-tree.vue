<template>
  <div class="container-list">
    <div class="option-row">
      <tiny-input
        v-model="filterText"
        :prefix-icon="IconSearch"
        @input="Method.searchChange"
        clearable
        @clear="Method.searchChange"
        :placeholder="$t('common.search.placeholder')"
      >
      </tiny-input>
      <tiny-button :icon="IconPlus" @click="Method.handleCollection"></tiny-button>
    </div>
    <div class="metadata-tree">
      <tiny-tree
        ref="treeRef"
        node-key="name"
        :data="treeData"
        :show-line="true"
        indent="12px"
        size="medium"
        :default-expanded-keys="expandKeys"
        current-node-key="0"
        expand-on-click-node="false"
        @node-click="Method.nodeClick"
        @mouseleave="mouseoverEvent('-1')"
      >
        <template #prefix="{ node }">
          <IconFolderOpened class="svg-dir" v-if="!node.data.isLeaf" />
          <IconFiletext class="svg-file" v-else />
        </template>
        <template #default="{ node }">
          <div class="div-default" @mouseover="mouseoverEvent(node.data.id)">
            {{ node.data.name }}
          </div>
        </template>
        <template #operation="{ node }">
          <div v-if="showId === node.data.id">
            <span
              v-if="node.data.treeLevel != 'Category'"
              @click.stop="Method.showDataElement(node)"
              :title="$t('common.operations.query')"
            >
              <IconInfoCircle></IconInfoCircle>
            </span>
          </div>
        </template>
      </tiny-tree>
    </div>
  </div>

  <!--抽屉-->
  <tiny-drawer
    :title="drawConfig.title"
    :visible="drawConfig.visible"
    @update:visible="drawConfig.visible = $event"
    :show-header="true"
    :mask-closable="false"
    :width="drawConfig.width"
    @close="drawConfig.handleDrawerClose"
  >
    <div>
      <suspense>
        <metadata-collection :key="nanoid(8)"></metadata-collection>
      </suspense>
    </div>
  </tiny-drawer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  iconFiletext,
  iconFolderOpened,
  iconInfoCircle,
  iconPlus,
  iconSearch
} from '@opentiny/vue-icon'
import { nanoid } from 'nanoid'
import MetadataCollection from '@/views/metadata/components/metadata-collection.vue'
import emitter from '@/utils/evnetbus'
import {
  type metadataModel,
  MetadataService,
  type metadataTreeModel
} from '@/services/metadata/metadata'

const selectNode = defineModel('selectNode', { default: {} as metadataModel })
const { t } = useI18n()
const treeRef = ref()
const treeData = ref<metadataTreeModel[]>()
const filterText = ref()
const showId = ref('-1')

const IconSearch = iconSearch()
const IconPlus = iconPlus()
const IconFolderOpened = iconFolderOpened()
const IconFiletext = iconFiletext()
const IconInfoCircle = iconInfoCircle()

const expandKeys = ref<number[]>([0])
const drawConfig = ref({
  title: t('metadata.collect.title'),
  visible: false,
  width: '55%',
  handleDrawerClose: () => {
    drawConfig.value.visible = false
  }
})

emitter.on('drawerCancel', drawConfig.value.handleDrawerClose)

onMounted(() => {
  Method.getTree()
  emitter.on('getTree', Method.getTree)
})

const mouseoverEvent = (id: any) => {
  showId.value = id
}

const Method = {
  nodeClick: (data: any) => {
    //console.log(data)
  },

  searchChange: () => {
    treeRef.value.filter(filterText.value)
  },

  handleCollection: () => {
    drawConfig.value.visible = true
  },

  //获取元数据树
  getTree: async () => {
    treeData.value = await MetadataService.getTree()
  },

  showDataElement: (node: any) => {
    selectNode.value = node.data
    emitter.emit('queryDataElements', selectNode.value)
  }
}
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

.container-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: auto;
}

.metadata-tree {
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

  :deep(.tiny-tree-node .tiny-tree-node__children) {
    overflow-y: scroll;
    height: calc(100vh - 270px);
  }
}

.svg-dir {
  fill: #ffcc41;
}

.svg-file {
  fill: #1ac456;
}
</style>
