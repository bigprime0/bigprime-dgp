<template>
  <div class="container-list">
    <Breadcrumb
      :items="['menu.dg', 'menu.dg.dg-metadata', 'menu.dg.dg-metadata.dg-metadata-main']"
    />
    <div class="contain">
      <tiny-split v-model="ratio" trigger-simple disabled>
        <template #left>
          <div class="split-pane">
            <MetadataTree />
          </div>
        </template>
        <template #right>
          <div class="split-pane">
            <MetadataContent :key="nanoid(8)" />
          </div>
        </template>
      </tiny-split>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MetadataTree from '@/views/metadata/components/metadata-tree.vue'
import MetadataContent from '@/views/metadata/components/metadata-content.vue'
import { nanoid } from 'nanoid'

const ratio = ref(0.2)
</script>

<style scoped lang="less">
.container-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.contain {
  flex: 1 1 auto;
  margin: 8px 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px 8px rgba(169, 174, 184, 0.05);
  padding: 10px;
}

.split-pane {
  padding: 10px;
}
</style>
