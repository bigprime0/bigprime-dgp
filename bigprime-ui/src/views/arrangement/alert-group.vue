<template>
  <IframeParent :data="data" server-name="dsp" component-path="/src/views/alarm/alarm-group.vue"></IframeParent>
</template>

<script setup lang="ts">
import IframeParent from "@/views/components/iframe-parent.vue"

const data = {}
</script>
<style scoped lang="less">

</style>
