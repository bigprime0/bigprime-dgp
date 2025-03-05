<template>
  <GlobalConfig :breadcrumb="['menu.dd.dd-global.dd-global-flink']" :type="2"
                :title="'menu.dd.dd-global.dd-global-flink'"
                :des="'对于Flink相关环境的配置，避免因为配置变更而重启服务，可以在页面上修改配置，修改后会自动生效，无需重启服务'"/>
</template>

<script setup lang="ts">
import GlobalConfig from '@/views/development/global/global-config.vue'
</script>
<style scoped lang="less">
</style>
