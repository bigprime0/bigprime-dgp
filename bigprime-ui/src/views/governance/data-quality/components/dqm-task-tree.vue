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
      :expand-on-click-node="true"
      :show-line=true
      indent="10px"
      :filter-node-method="filterNodeMethod"
      @node-click="nodeClick"
    >
      <template #prefix="{node}">
        <IconFolderOpened class="svg-dir" v-if="node.data.id < 0" />
        <IconFiles class="svg-file" v-else />
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
import { iconFiles, iconFiletext, iconFolderOpened, iconSearch } from '@opentiny/vue-icon'
import { useI18n } from 'vue-i18n'
import { DataQualityConfigService } from '@/services/governance/quality-config'

const IconFolderOpened = iconFolderOpened()
const IconFiles = iconFiles()
const IconSearch = iconSearch()

const changeType = defineModel('changeType', {
  default: {
    id: -1,
    name: '',
    jobId: 0,
    path: ''
  }
})
const filterText = ref()
const { t } = useI18n()
const treeRef = ref()

const data = ref([{
  id: -1,
  type: 'uniqueness',
  name: t('governance.quality.uniqueness.detection'),
  children: []
}, {
  id: -2,
  type: 'integrity',
  name: t('governance.quality.integrity.testing'),
  children: []
}, {
  id: -3,
  type: 'standard',
  name: t('governance.quality.standard.testing'),
  children: []
}, {
  id: -4,
  type: 'custom',
  name: t('governance.quality.custom.detection'),
  children: []
}])


const search = async () => {
  const result = await DataQualityConfigService.getList({})
  let uniqueness: any = []
  let integrity: any = []
  let standard: any = []
  let custom: any = []
  result.forEach(o => {
    if (o.ruleType === 'uniqueness') {
      o.pidName = t('governance.quality.uniqueness.detection')
      uniqueness.push(o)
    } else if (o.ruleType === 'integrity') {
      o.pidName = t('governance.quality.integrity.testing')
      integrity.push(o)
    } else if (o.ruleType === 'standard') {
      o.pidName = t('governance.quality.standard.testing')
      standard.push(o)
    } else if (o.ruleType === 'custom') {
      o.pidName = t('governance.quality.custom.detection')
      custom.push(o)
    }
  })
  data.value = [{
    id: -1,
    type: 'uniqueness',
    name: t('governance.quality.uniqueness.detection'),
    children: uniqueness
  }, {
    id: -2,
    type: 'integrity',
    name: t('governance.quality.integrity.testing'),
    children: integrity
  }, {
    id: -3,
    type: 'standard',
    name: t('governance.quality.standard.testing'),
    children: standard
  }, {
    id: -4,
    type: 'custom',
    name: t('governance.quality.custom.detection'),
    children: custom
  }]
}


const inputChange = () => {
  treeRef.value.filter(filterText.value)
}
const filterNodeMethod = (text: any, data: any) => {
  return data.name.includes(text)
}

const nodeClick = (data: any) => {
  if (data.id < 0) return
  changeType.value.id = data.id
  changeType.value.name = data.name
  changeType.value.jobId = data.jobId
  changeType.value.path = data.pidName + ' / ' + data.name
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

.svg-file {
  fill: #1ac456;
  width: 0.8em;
  height: 0.8em;
}
</style>
