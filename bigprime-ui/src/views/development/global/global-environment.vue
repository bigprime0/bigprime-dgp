<template>
  <GlobalConfig :breadcrumb="['menu.dd.dd-global.dd-global-environment']" :type="1"
                :title="'menu.dd.dd-global.dd-global-environment'"
                :des="'对于全局环境的配置，避免因为配置变更而重启服务，可以在页面上修改配置，修改后会自动生效，无需重启服务'"/>
</template>

<script setup lang="ts">
import GlobalConfig from '@/views/development/global/global-config.vue'
</script>
<style scoped lang="less">
</style>
