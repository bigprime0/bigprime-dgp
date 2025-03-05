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
    <tiny-tree ref="treeRef"
               node-key="id"
               :data="treeData"
               :default-expand-all="true"
               :expand-on-click-node="true"
               :show-line=true
               indent="10px"
               :filter-node-method="filterNodeMethod"
               @node-click="nodeClick"
    >
      <template #prefix="{node}">
        <IconRichTextTable class="svg-child" v-if="node.data.id > 0" />
        <IconRichTextTaskList class="svg-dir" v-else-if="title === 'menu.governance.mdm.mdm-maintain'" />
        <IconAdd class="svg-dir" v-else />
      </template>
      <template #default="{node}">
        <div class="div-default">{{ node.data.tableName }}</div>
      </template>
    </tiny-tree>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Tree as TinyTree } from '@opentiny/vue'
import { iconRichTextTable, iconSearch, iconAdd, iconRichTextTaskList } from '@opentiny/vue-icon'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/evnetbus'
import { DataMasterConfigService } from '@/services/governance/master-config'

const IconRichTextTable = iconRichTextTable()
const IconRichTextTaskList = iconRichTextTaskList()
const IconAdd = iconAdd()
const IconSearch = iconSearch()
const filterText = ref()
const { t } = useI18n()

const tableName = ref()
const id = ref(0)
const status = ref(0)
const publishDate = ref()
const treeRef = ref()
const treeData = ref()
const title = defineModel('title', { default: 'governance.master.config.type' })
const param = defineModel('param', { default: {} })

const search = async () => {
  const result = await DataMasterConfigService.getList(param.value)
  treeData.value = [{
    id: 0,
    tableName: t(title.value),
    children: result
  }]
}

const inputChange = () => {
  treeRef.value.filter(filterText.value)
}
const filterNodeMethod = (text: any, data: any) => {
  return data.tableName.includes(text)
}

const nodeClick = (data: any) => {
  tableName.value = data.tableName
  id.value = data.id
  status.value = data.status
  publishDate.value = data.publishDate
  emitter.emit('masterConfigNodeClick')
}

onMounted(() => {
  search()
})

defineExpose({
  tableName,
  id,
  status,
  publishDate,
  search
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
  :deep(.tiny-tree-node .tiny-tree-node__content-left .tree-node-icon) {
    visibility: hidden;
  }

  :deep(.tiny-tree-node .tiny-tree-node__content-left .tree-node-icon svg) {
    margin-left: -60px;
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
}

.svg-child {
  fill: #1a78c4;
}

.svg-dir {
  fill: #66d256;
}
</style>
