<template>
  <IframeParent :data="data" server-name="das" component-path="/src/views/resource/components/resource-config.vue"></IframeParent>
</template>

<script setup lang="ts">
import IframeParent from "@/views/components/iframe-parent.vue"
import {ref} from "vue";

const data = ref({
  type: 2
})
</script>
<style scoped lang="less">
</style>
