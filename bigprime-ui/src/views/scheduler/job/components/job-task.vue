<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.scheduler', 'menu.scheduler.task']" />
    <div class="contain">
      <Trigger/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Trigger from '@/views/scheduler/trigger/index.vue'
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
