<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dam', 'menu.dg.dg-dam.dg-dam-maintenance']" />
    <div class="contain">
      <div class="split-v-model">
        <tiny-split v-model="ratio" trigger-simple disabled>
          <template #left>
            <div class="demo-split-pane">
              <suspense>
                <DamMaintenanceCategory :change-type="changeType" />
              </suspense>
            </div>
          </template>
          <template #right>
            <div class="demo-split-pane">
              <suspense>
                <DamMaintenanceList :change-type="changeType" />
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
import DamMaintenanceList from '@/views/governance/data-asset/components/dam-maintenance-list.vue'
import DamMaintenanceCategory from '@/views/governance/data-asset/components/dam-maintenance-category.vue'
import { useI18n } from 'vue-i18n'
import type { DataAssetsCategoryParam } from '@/services/assets/asset-category'

const { t } = useI18n()
const ratio = ref(0.2)
const changeType = ref<DataAssetsCategoryParam>({
  children: [],
  id: -1,
  name: t('assets.asset.category'),
  pid: 0,
  pidName: ''
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

.grid-toolbar {
  display: flex;
  justify-content: right;
  width: 400px;

  button {
    margin-left: 5px;
  }
}
</style>
