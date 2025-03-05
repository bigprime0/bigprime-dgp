<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dd', 'menu.dd.dd-task-instance']" />
    <div class="contain">
      <div class="split-v-model">
        <tiny-split v-model="ratio" trigger-simple disabled>
          <template #left>
            <div class="demo-split-pane">
              <DdDirectory :edit="false" />
            </div>
          </template>
          <template #right>
            <div class="demo-split-pane">
              <DdTaskInstanceList :flink-task-data="flinkTaskData" />
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
import { useI18n } from 'vue-i18n'
import DdDirectory from '@/views/development/task/components/dd-directory.vue'
import DdTaskInstanceList from '@/views/development/task/components/dd-task-instance-list.vue'
import emitter from '@/utils/evnetbus'

const { t } = useI18n()
const ratio = ref(0.2)
const flinkTaskData = ref()
emitter.on('dd-directory-data-click', async (data: any) => {
  flinkTaskData.value = data.data
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
