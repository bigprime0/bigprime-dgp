<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dlc', 'menu.dg.dg-dlc.dg-dlc-nla', 'menu.dg.dg-dlc.dg-dlc-nla.dg-dlc-nla-log']" />
    <div class="contain">
      <tiny-tabs v-model="activeName">
        <tiny-tab-item :title="$t('lifecycle.setting.tabs')" lazy name="setting">
          <LifeCycleLog :type=1 :log-type=1 />
        </tiny-tab-item>
        <tiny-tab-item :title="$t('lifecycle.task.tabs')" lazy name="task">
          <LifeCycleLog :type=1 :log-type=2 />
        </tiny-tab-item>
      </tiny-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import LifeCycleLog from '@/views/governance/data-lifecycle/components/life-cycle-log.vue'
import { ref } from 'vue'
const activeName = ref('setting')
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
  height: 99%;

  :deep(.tiny-tabs__content) {
    position: relative;
    margin: 5px 1px;
    font-size: var(--ti-tabs-content-font-size);
  }
}
</style>
