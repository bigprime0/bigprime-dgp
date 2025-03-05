<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dqm', 'menu.dg.dg-dqm.dg-dqm-configuration']" />
    <div class="contain">
      <div class="split-v-model">
        <tiny-split v-model="ratio" trigger-simple disabled>
          <template #left>
            <div class="split-left">
              <tiny-tree
                node-key="id"
                :data="dataQualityRuleList"
                :default-expand-all=true
                :expand-on-click-node="false"
                :show-line=true
                indent="10px"
                @node-click="nodeClick"
              >
                <template #prefix="{node}">
                  <IconFolderOpened class="svg-dir"/>
                </template>
                <template #default="{node}">
                  <div class="div-default">{{ node.data.name }}</div>
                </template>
              </tiny-tree>
            </div>
          </template>
          <template #right>
            <div class="demo-split-pane">
              <suspense>
                <DqmConfigurationInfo :changeType="changeType" />
              </suspense>
            </div>
          </template>
        </tiny-split>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Split as TinySplit } from '@opentiny/vue'
import DqmConfigurationInfo from '@/views/governance/data-quality/components/dqm-configuration-info.vue'
import { useI18n } from 'vue-i18n'
import { iconFolderOpened } from '@opentiny/vue-icon'

const IconFolderOpened = iconFolderOpened()
const { t } = useI18n()
const ratio = ref(0.2)

const dataQualityRuleList = [{
  id: 1,
  type: '',
  name: t('governance.quality.detection.type'),
  children: [{
    id: 2,
    type: 'uniqueness',
    name: t('governance.quality.uniqueness.detection'),
    children: []
  }, {
    id: 3,
    type: 'integrity',
    name: t('governance.quality.integrity.testing'),
    children: []
  }, {
    id: 4,
    type: 'standard',
    name: t('governance.quality.standard.testing'),
    children: []
  }, {
    id: 5,
    type: 'custom',
    name: t('governance.quality.custom.detection'),
    children: []
  }]
}]

const changeType = ref<any>({
  id: 1,
  type: '',
  name: t('governance.quality.detection.type')
})

const nodeClick = (data: any) => {
  changeType.value = data
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
}

.contain {
  flex: 1 1 auto;
  margin: 8px 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px 8px rgba(169, 174, 184, 0.05);
  padding: 10px;
}

.split-v-model {
  height:100%;
  border: 1px solid #d9d9d9;

  :deep(.tiny-split-pane.left-pane, .tiny-split-pane.right-pane) {
    top: 0;
    bottom: 0;
    overflow: auto;
  }
}

.demo-split-pane {
  padding: 10px;
}

.div-default {
  width: 100%;
  font-size: var(--ti-tree-small-node-font-size);
}

.split-left {
  margin-top: 10px;

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
