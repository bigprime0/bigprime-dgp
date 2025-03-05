<template>
  <IframeParent :data="data" server-name="das" component-path="/src/views/resource/components/udf-manage.vue"></IframeParent>
</template>

<script setup lang="ts">
import IframeParent from "@/views/components/iframe-parent.vue"

const data = {
type: 2
}
</script>
<style scoped lang="less">
</style>
