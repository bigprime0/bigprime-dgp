<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-mdm','menu.dg.dg-mdm.dg-mdm-modeling']" />
    <div class="contain">
      <div class="split-v-model">
        <tiny-split v-model="ratio" trigger-simple disabled>
          <template #left>
            <div class="demo-split-pane">
              <MdmConfig ref="masterConfigRef" title="menu.dg.dg-mdm.dg-mdm-modeling"/>
            </div>
          </template>
          <template #right>
            <div class="demo-split-pane">
              <MdmModelingForm :structValue="structValue" :tableValue="tableValue" />
            </div>
          </template>
        </tiny-split>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Split as TinySplit } from '@opentiny/vue'
import MdmConfig from '@/views/governance/data-master/components/mdm-config.vue'
import MdmModelingForm from '@/views/governance/data-master/components/mdm-modeling-form.vue'
import emitter from '@/utils/evnetbus'
import { DataSourceDDLService } from '@/services/warehouse/data-source'

const structValue = ref({ tableStruct: [], columnsStruct: [], indexesStruct: [] } as any)
const tableValue = ref({ label: '', id: 0, databaseId: -1, status: 0 } as any)
const ratio = ref(0.2)
const masterConfigRef = ref()
const masterConfigNodeClick = () => {
  tableValue.value.databaseId = -1
  tableValue.value.id = masterConfigRef.value?.id
  if (tableValue.value.id > 0) {
    tableValue.value.label = masterConfigRef.value?.tableName
    tableValue.value.publishDate  = masterConfigRef.value?.publishDate
    tableValue.value.status = masterConfigRef.value?.status
  } else {
    tableValue.value.label = ''
    tableValue.value.status = 0
  }
}

const masterConfigSave = async () => {
  await masterConfigRef.value?.search()
}

onMounted(async () => {
  const result = await DataSourceDDLService.getSourceTableStruct(-1)
  structValue.value.tableStruct = result.tableStruct
  structValue.value.columnsStruct = result.columnsStruct
  structValue.value.indexesStruct = result.indexesStruct
})

emitter.on('masterConfigNodeClick', masterConfigNodeClick)
emitter.on('masterConfigSave', masterConfigSave)
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
}
</style>
