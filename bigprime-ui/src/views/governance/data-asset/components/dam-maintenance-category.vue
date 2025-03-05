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
      ref="dataAssetsCategoryTreeRef"
      node-key="id"
      :data="dataAssetsCategoryList"
      :default-expand-all=true
      :expand-on-click-node=false
      :show-line=true
      indent="10px"
      :filter-node-method="filterNodeMethod"
      @node-click="nodeClick"
      @mouseleave="mouseoverEvent(-2)"
      @add-node="saveEvent"
      @edit-node="editEvent"
    >
      <template #prefix="{node}">
        <IconFolderOpened class="svg-dir"/>
      </template>
      <template #default="{node}">
        <div class="div-default" @mouseover="mouseoverEvent(node.data.id)">{{ node.data.name }}</div>
      </template>
      <template #operation="{node}">
        <div v-if="showId === node.data.id">
          <span v-if="node.data.id > 0" @click.stop="editNode(node)"
                :title="$t('common.operations.update')">
            <IconWriting></IconWriting>
          </span>
          <span @click.stop="addNode(node)"
                :title="$t('common.operations.add')">
            <IconPlusSquare></IconPlusSquare>
          </span>
          <span v-if="node.data.id > 0 && isEmpty(node.data.children)"
                @click.stop="deleteNode(node)"
                :title="$t('common.operations.delete')">
            <IconMinusSquare></IconMinusSquare>
          </span>
        </div>
      </template>

    </tiny-tree>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Modal, Tree as TinyTree } from '@opentiny/vue'
import { iconFolderOpened, iconMinusSquare, iconPlusSquare, iconSearch, iconWriting } from '@opentiny/vue-icon'
import { useI18n } from 'vue-i18n'
import { type DataAssetsCategoryParam, DataAssetsCategoryService } from '@/services/assets/asset-category'
import { isEmpty } from 'lodash-es'

const IconFolderOpened = iconFolderOpened()
const IconPlusSquare = iconPlusSquare()
const IconMinusSquare = iconMinusSquare()
const IconWriting = iconWriting()
const IconSearch = iconSearch()

const changeType = defineModel('changeType', { default: {} as DataAssetsCategoryParam })
const showId = ref(-2)
const filterText = ref()
const editId = ref(-2)

const { t } = useI18n()
const dataAssetsCategoryList = ref<DataAssetsCategoryParam[]>([{
  id: -1,
  pid: 0,
  pidName: '',
  name: t('assets.asset.category'),
  children: []
}])
const dataAssetsCategoryTreeRef = ref()

const search = async () => {
  const result = await DataAssetsCategoryService.getList({})
  result.forEach(o => {
    setParentName(o, t('assets.asset.category'))
  })
  dataAssetsCategoryList.value[0].children = result
}

const inputChange = () => {
  dataAssetsCategoryTreeRef.value.filter(filterText.value)
}
const filterNodeMethod = (text: any, data: any) => {
  return data.name.includes(text)
}

const parent = ref<DataAssetsCategoryParam>({} as DataAssetsCategoryParam)
const saveEvent = async (node: any) => {
  node.data.name = node.data.label
  node.data.id = editId.value
  if (node.data.id > 0) {
    await DataAssetsCategoryService.save(node.data)
  } else {
    node.data.pid = parent.value.id
    node.data.children = []
    const id = await DataAssetsCategoryService.save(node.data)
    await search()
    dataAssetsCategoryTreeRef.value.setCurrentKey(id)
  }
}

const editEvent = async (node: any) => {
  node.data.name = node.data.label
  await DataAssetsCategoryService.save(node.data)
}

const addNode = (node: any) => {
  dataAssetsCategoryTreeRef.value.saveNode()
  editId.value = 0
  parent.value = node.data
  dataAssetsCategoryTreeRef.value.addNode(node)
}
const editNode = (node: any) => {
  if(node.data.id !== editId.value){
    dataAssetsCategoryTreeRef.value.saveNode()
  }
  editId.value = node.data.id
  node.data.label = node.data.name
  dataAssetsCategoryTreeRef.value.editNode(node)
}

const deleteNode = (node: any) => {
  if(node.data.id !== editId.value){
    dataAssetsCategoryTreeRef.value.saveNode()
  }
  editId.value = -2
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      const result = await DataAssetsCategoryService.deleteById(node.data.id)
      if (result) {
        dataAssetsCategoryTreeRef.value.remove(node)
      }
    }
  })
}

const mouseoverEvent = (id: any) => {
  showId.value = id
}

const nodeClick = (data: any) => {
  if(data.id !== editId.value){
    dataAssetsCategoryTreeRef.value.saveNode()
  }
  changeType.value.id = data.id
  changeType.value.name = data.name
  changeType.value.pidName = data.pidName
}

const setParentName = (data: DataAssetsCategoryParam, parentName: string) => {
  data.pidName = parentName
  if (!isEmpty(data.children)) {
    data.children.forEach(c => {
      setParentName(c, data.pidName + ' / ' + data.name)
    })
  }
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
</style>
