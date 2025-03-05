<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-mdm','menu.dg.dg-mdm.dg-mdm-maintenance']" />
    <div class="contain">
      <div class="split-v-model">
        <tiny-split v-model="ratio" trigger-simple disabled>
          <template #left>
            <div class="demo-split-pane">
              <MdmConfig ref="masterConfigRef" title="menu.dg.dg-mdm.dg-mdm-maintenance" :param="param"/>
            </div>
          </template>
          <template #right>
            <div class="demo-split-pane">
              <MdmMaintenanceForm :tableValue="tableValue" />
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
import MdmMaintenanceForm from '@/views/governance/data-master/components/mdm-maintenance-form.vue'
import emitter from '@/utils/evnetbus'

const tableValue = ref({ label: '', id: 0, databaseId: -1, status: 0 } as any)
const ratio = ref(0.2)
const masterConfigRef = ref()
const param = ref({
  types: [2]
})

const masterConfigNodeClick = () => {
  tableValue.value.databaseId = -1
  tableValue.value.id = masterConfigRef.value?.id
  if (tableValue.value.id > 0) {
    tableValue.value.label = masterConfigRef.value?.tableName
    tableValue.value.publishDate = masterConfigRef.value?.publishDate
    tableValue.value.status = masterConfigRef.value?.status
  } else {
    tableValue.value.label = ''
    tableValue.value.status = 0
  }
}

emitter.on('masterConfigNodeClick', masterConfigNodeClick)
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
