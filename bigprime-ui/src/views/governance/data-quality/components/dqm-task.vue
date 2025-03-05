<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dqm', 'menu.dg.dg-dqm.dg-dqm-task']" />
    <div class="contain">
      <div class="split-v-model">
        <tiny-split v-model="ratio" trigger-simple disabled>
          <template #left>
            <div class="demo-split-pane">
              <DqmTaskTree :changeType="changeType" />
            </div>
          </template>
          <template #right>
            <div class="demo-split-pane">
              <Breadcrumb class="svg-file" :items="[changeType.path]" :IconLeft="IconFiles"/>
              <SchedulerTrigger :jobId="changeType.jobId" lazy />
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
import DqmTaskTree from '@/views/governance/data-quality/components/dqm-task-tree.vue'
import { useI18n } from 'vue-i18n'
import SchedulerTrigger from '@/views/scheduler/trigger/index.vue'
import { iconFiles, iconFiletext } from '@opentiny/vue-icon'
const IconFiles = iconFiles()
const ratio = ref(0.2)
const changeType = ref({
  id: -1,
  name: '',
  jobId: 0,
  path:''
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

  :deep(.container-breadcrumb) {
    font-size: 12px;
    margin: 0;
  }

  :deep(.tiny-breadcrumb .tiny-breadcrumb__item:last-child .tiny-breadcrumb__inner) {
    font-weight: 500;
    color: #2c3e50;
    text-decoration: none;
  }
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

.svg-file{
  fill: #1ac456;
}
</style>
