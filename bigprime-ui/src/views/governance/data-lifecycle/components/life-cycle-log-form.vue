<template>
  <div class="split-v-model">
    <tiny-split v-model="ratio" trigger-simple disabled>
      <template #left>
        <div class="demo-split-pane">
          <span class="span-font">{{ $t('common.operations.log.begData') }}</span>
          <LifeCycleFilingLogForm v-if="logType === 1" :log-form-data="beginData" :source="source"
                                  :color-changes="colorChanges" />
          <LifeCycleTaskLogForm v-else :log-form-data="beginData" :source="source"
          :color-changes="colorChanges" />
        </div>
      </template>
      <template #right>
        <div class="demo-split-pane">
          <span class="span-font">{{ $t('common.operations.log.endData') }}</span>
          <LifeCycleFilingLogForm v-if="logType === 1" :log-form-data="endData" :source="source"
                                  :color-changes="colorChanges" />
          <LifeCycleTaskLogForm v-else :log-form-data="endData" :source="source"
          :color-changes="colorChanges" />
        </div>
      </template>
    </tiny-split>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Split as TinySplit } from '@opentiny/vue'
import LifeCycleFilingLogForm from '@/views/governance/data-lifecycle/components/life-cycle-filing-log-form.vue'
import LifeCycleTaskLogForm from '@/views/governance/data-lifecycle/components/life-cycle-task-log-form.vue'

const logType = defineModel('logType', { default: 0 })
const beginData = defineModel('beginData', {})
const endData = defineModel('endData', {})
const source = defineModel('source', { default: [] as any })
const colorChanges = defineModel('colorChanges', { default: [] })
const ratio = ref(0.5)
</script>

<style scoped lang="less">
.split-v-model {
  height: 100%;
  border: 1px solid #d9d9d9;
}

.demo-split-pane {
  padding: 10px;
}

.span-font {
  font-size: 12px;
  color: #e08331;
  font-weight: bold;
}

</style>
