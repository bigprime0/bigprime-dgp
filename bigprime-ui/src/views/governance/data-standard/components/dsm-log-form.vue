<template>
  <div class="split-v-model">
    <tiny-split v-model="ratio" trigger-simple disabled>
      <template #left>
        <div class="demo-split-pane">
          <span class="span-font">{{$t('common.operations.log.begData')}}</span>
          <DsmMaintenanceListForm :disabled="true" :formData="beginData" :fields="fields" :codes="codes"/>
        </div>
      </template>
      <template #right>
        <div class="demo-split-pane">
          <span class="span-font">{{$t('common.operations.log.endData')}}</span>
          <DsmMaintenanceListForm :disabled="true" :formData="endData" :fields="fields" :codes="codes" :colorChanges="colorChanges"/>
        </div>
      </template>
    </tiny-split>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Split as TinySplit } from '@opentiny/vue'
import DsmMaintenanceListForm from '@/views/governance/data-standard/components/dsm-maintenance-list-form.vue'
import type { StandardSelect } from '@/services/governance/standard'
const beginData = defineModel('beginData',{})
const endData = defineModel('endData',{})
const fields = defineModel<StandardSelect[]>('fields', { default: [] })
const codes = defineModel<StandardSelect[]>('codes', { default: [] })
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
