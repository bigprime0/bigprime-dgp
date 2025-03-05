<template>
  <ScmConfig :type="'Crypto'">
    <template #breadcrumb>
      <Breadcrumb :items="['menu.dg', 'menu.dg.dg-scm', 'menu.dg.dg-scm.dg-scm-encryption']" />
    </template>
  </ScmConfig>
</template>

<script setup lang="ts">
import ScmConfig from '@/views/governance/data-security/components/scm-config.vue'
</script>

