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
      ref="treeRef"
      node-key="id"
      :data="data"
      :default-expand-all=true
      :expand-on-click-node="false"
      :show-line=true
      indent="10px"
      :filter-node-method="filterNodeMethod"
      @node-click="nodeClick"
    >
      <template #prefix="{node}">
        <IconFolderOpened class="svg-dir" v-if="node.data.dataType === 0"/>
        <IconFiletext class="svg-file" v-else/>
      </template>
      <template #default="{node}">
        <div class="div-default">{{ node.data.name }}</div>
      </template>
    </tiny-tree>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Tree as TinyTree } from '@opentiny/vue'
import { iconFiletext, iconFolderOpened, iconSearch } from '@opentiny/vue-icon'
import { isEmpty } from 'lodash-es'
import { type StandardTypeInfo, StandardTypeService } from '@/services/governance/standard'
import { useI18n } from 'vue-i18n'

const IconFolderOpened = iconFolderOpened()
const IconFiletext = iconFiletext()
const IconSearch = iconSearch()

const changeType = defineModel('changeType', { default: {} as StandardTypeInfo })
const filterText = ref()

const { t } = useI18n()
const data = ref<StandardTypeInfo[]>()
const treeRef = ref()


const search = async () => {
  const result = await StandardTypeService.getList()
  result.forEach(o => {
    setParentName(o, t('governance.standard.type'))
  })
  data.value = [{
    id: 0,
    pid: 0,
    pidName: '',
    code: '',
    name: t('governance.standard.type'),
    dataType: 0,
    children: result
  }]
}

const setParentName = (data: StandardTypeInfo, parentName: string) => {
  data.pidName = parentName
  if (!isEmpty(data.children)) {
    data.children.forEach(c => {
      setParentName(c, data.pidName + ' / ' + data.name)
    })
  }
}

const inputChange = () => {
  treeRef.value.filter(filterText.value)
}
const filterNodeMethod = (text: any, data: any) => {
  return data.name.includes(text)
}

const nodeClick = (data: any) => {
  changeType.value.id = data.id
  changeType.value.pidName = data.pidName
  changeType.value.name = data.name
  changeType.value.dataType = data.dataType
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
  :deep(.tiny-tree-node .tiny-tree-node__content-left svg){
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

.svg-dir{
  fill: #ffcc41;
}

.svg-file{
  fill: #1ac456;
}
</style>
