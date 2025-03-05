<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-mdm','menu.dg.dg-mdm.dg-mdm-sync']" />
    <div class="contain">
      <div class="split-v-model">
        <tiny-split v-model="ratio" trigger-simple disabled>
          <template #left>
            <div class="demo-split-pane">
              <MdmConfig ref="masterConfigRef" title="menu.dg.dg-mdm.dg-mdm-sync" :param="param"/>
            </div>
          </template>
          <template #right>
            <div class="demo-split-pane-right">
              <div>
                <tiny-tabs v-model="activeName">
                  <tiny-tab-item :title="$t('menu.integration.define')" lazy name="define">
                    <JobDefineList :query-model="queryModel"/>
                  </tiny-tab-item>

                  <tiny-tab-item :title="$t('menu.integration.instance')" lazy name="instance">
                    <JobInstanceList :query-model="queryModel"/>
                  </tiny-tab-item>
                </tiny-tabs>
              </div>
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
import MdmConfig from '@/views/governance/data-master/components/mdm-config.vue'
import emitter from '@/utils/evnetbus'
import JobInstanceList from '@/views/integration/job/job-instance-list.vue'
import JobDefineList from '@/views/integration/job/job-define-list.vue'

const activeName = ref('define')
const tableValue = ref({ label: '', id: 0, databaseId: -1, status: 0 } as any)
const ratio = ref(0.2)
const masterConfigRef = ref()
const param = ref({
  types: [2]
})
const queryModel = ref({
  type: 1,
  writeSourceId: -1,
  writeSourceTable: ''
})

const masterConfigNodeClick = () => {
  tableValue.value.id = masterConfigRef.value?.id
  if (tableValue.value.id > 0) {
    queryModel.value.writeSourceTable = masterConfigRef.value?.tableName
  }else{
    queryModel.value.writeSourceTable = ''
  }
}

emitter.on('masterConfigNodeClick', masterConfigNodeClick)
emitter.on('masterSyncEmitter',() => {
  activeName.value = 'instance'
  emitter.emit('instanceSearch')
})
</script>

<style scoped lang="less">
.split-v-model {
  height: 100%;
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

.demo-split-pane-right {
  padding: 0 10px 10px 10px;

}

.container-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: auto;
}

.contain {
  flex: 1 1 auto;
  margin: 8px 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px 8px rgba(169, 174, 184, 0.05);
  padding: 10px;

  :deep(.tiny-tabs__content) {
    position: relative;
    margin: 5px 1px;
    font-size: var(--ti-tabs-content-font-size);
  }
}
</style>
