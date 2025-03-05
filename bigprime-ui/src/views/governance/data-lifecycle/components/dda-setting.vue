<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dlc', 'menu.dg.dg-dlc.dg-dlc-dda', 'menu.dg.dg-dlc.dg-dlc-dda.dg-dlc-dda-setting']" />
    <div class="contain">
      <LifeCycleFiling :type=3 />
    </div>
  </div>
</template>

<script setup lang="ts">
import LifeCycleFiling from '@/views/governance/data-lifecycle/components/life-cycle-filing.vue'
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
}
</style>
