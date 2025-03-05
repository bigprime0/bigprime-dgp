<template>
  <tiny-input v-if="item.fieldControl === 'STRING' || item.fieldControl === 'FIELDS'"
              v-model="data[item.key]"
              :title="data[item.key]"
              :size="size"
              :disabled="!item.canUpdate && update && data.operate !== 'I'"></tiny-input>

  <tiny-numeric v-if="item.fieldControl === 'NUMBER'"
                type="number"
                default="0"
                v-model="data[item.key]"
                :size="size"
                :disabled="!item.canUpdate && update && data.operate !== 'I'"
                mouse-wheel="true" min="0"></tiny-numeric>

  <tiny-switch v-if="item.fieldControl === 'BOOLEAN'"
               v-model="data[item.key]"
               :true-value=true :false-value=false
               :disabled="!item.canUpdate && update && data.operate !== 'I'"></tiny-switch>

  <tiny-select v-if="item.fieldControl === 'LIST'"
               v-model="data[item.key]"
               :size="size"
               :disabled="!item.canUpdate && update && data.operate !== 'I'">
    <tiny-option v-for="listKey in Object.keys(item.listValues)" :key="listKey" :label="item.listValues[listKey]" :value="listKey">
    </tiny-option>
  </tiny-select>
</template>

<script setup lang="ts">
const update = defineModel('update',{ default: true })
const size = defineModel('size',{ default: '' })
const item = defineModel('item',{ default: {} as any })
const data = defineModel('data', { default: {} as any })
</script>
