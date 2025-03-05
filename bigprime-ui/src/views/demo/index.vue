<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.demo']" />
    <div class="contain">
      <tiny-tabs v-model="activeTab">
        <tiny-tab-item title="LineageDemo" lazy name="LineageDemo">
          <LineageDemo />
        </tiny-tab-item>
        <tiny-tab-item title="EditDemo" lazy name="EditDemo">
          <monacoEditor
            ref="buildRef"
            v-model="editValue"
            overviewRulerBorder="false"
            cursorSmoothCaretAnimation="true"
            formatOnPaste="true"
            mouseWheelZoom="true"
            folding="true"
            automaticLayout="true"
            glyphMargin="true"
            language="python"
          >
          </monacoEditor>
        </tiny-tab-item>
      </tiny-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LineageDemo from '@/views/demo/lineage-demo.vue'
import * as monaco from 'monaco-editor'
import { MonacoLanguageClient } from 'monaco-languageclient'

const activeTab = ref('EditDemo')
const editValue = ref('')

const url = 'ws://localhost:30000/pyright' // 替换为您的语言服务器地址
const webSocket = new WebSocket(url)

MonacoLanguageClient.webSocket.onopen = async () => {
  const socket = toSocket(webSocket)
  const reader = new WebSocketMessageReader(socket)
  const writer = new WebSocketMessageWriter(socket)

  const languageClient = createLanguageClient({
    reader,
    writer,
    name: 'Pyright Language Client',
    clientOptions: {
      // ... 客户端选项 ...
    },
    connectionProvider: {
      get: () => Promise.resolve({ reader, writer })
    }
  })

  await languageClient.start()
  reader.onClose(() => languageClient.stop())
}
</script>

<style scoped lang="less">
.container-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.tiny-select__tags .tiny-select__tags-text.is-disabled > span) {
    color: #000000;
    font-size: var(--ti-tag-font-size);
    margin: var(--ti-select-tags-margin-top) var(--ti-select-tags-margin-right)
      var(--ti-select-tags-margin-bottom) var(--ti-select-tags-margin-left);
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
.codeEditBox {
  margin-top: 20px;
  height: calc(100vh - 230px);
}
</style>
