<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.sys', 'menu.sys.cfg']" />
    <div class="contain">
      <tiny-tabs v-model="activeTab">
        <tiny-tab-item :title="$t('sys.cfg.tab.title.file.storage')" lazy name="fileStorage">
          <FileStorageConfig />
        </tiny-tab-item>
      </tiny-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import IntegrationConfig from '@/views/sys/cfg/components/integration-config.vue'
import FileStorageConfig from '@/views/sys/cfg/components/file-storage-config.vue'

const activeTab = ref('fileStorage')

</script>

<style scoped lang="less">
.container-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.tiny-select__tags .tiny-select__tags-text.is-disabled>span) {
    color: #000000;
    font-size: var(--ti-tag-font-size);
    margin: var(--ti-select-tags-margin-top) var(--ti-select-tags-margin-right) var(--ti-select-tags-margin-bottom) var(--ti-select-tags-margin-left);
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.contain {
  flex: 1 1 auto;
  margin: 8px 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px 8px rgba(169, 174, 184, 0.05);
  padding: 10px;
  height: 99%;
}

.status {
  &-dot {
    position: relative;
    top: -1px;
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    vertical-align: middle;
    background-color: #1890ff;
    border-radius: 50%;
  }

  &-closed {
    .status-dot {
      background-color: #d9d9d9;
    }
  }

  &-finished {
    .status-dot {
      background-color: #52c41a;
    }
  }
}

.grid-toolbar {
  display: flex;
  justify-content: right;
  width: 400px;

  button {
    margin-left: 5px;
  }
}

.down-ds {
  width: 100%;
  margin-left: 5px;
}

.down-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}

</style>
