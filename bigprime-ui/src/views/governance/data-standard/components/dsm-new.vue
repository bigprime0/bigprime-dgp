<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.dg', 'menu.dg.dg-dsm', 'menu.dg.dg-dsm.dg-dsm-new']" />
    <div class="contain">
      <tiny-grid :data="tableData" :tree-config="treeConfig" :resizable="false"
                 show-header-overflow="tooltip" show-overflow="tooltip"
                 row-id="id">

        <template #toolbar>
          <div class="grid-toolbar">
            <tiny-search @search="search" @clear="search" @change="search" v-model="searchValue"
                         :placeholder="$t('common.search.placeholder')"
                         is-enter-search clearable></tiny-search>
            <div>
              <tiny-button type="primary" @click="handleForm(null, 'add')">{{ $t('common.operations.add') }}
              </tiny-button>
            </div>
          </div>
        </template>

        <tiny-grid-column field="name" :title="$t('governance.standard.type.name')" tree-node>
          <template v-slot="data">
            <IconFolderOpened class="svg-dir" v-if="data.row.dataType === 0" />
            <IconFiletext class="svg-file" v-else />
            <span :class="data.row.dataType === 0 ? 'icon-span svg-dir' : 'icon-span'">{{ data.row.name }}</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="code" :title="$t('governance.standard.type.code')"></tiny-grid-column>
        <tiny-grid-column :title="$t('governance.standard.type.dataType')">
          <template v-slot="data">
            <span v-if="data.row.dataType === 0" class="svg-dir">{{ $t('governance.standard.type.dataType.directory')
              }}</span>
            <span v-if="data.row.dataType === 1">{{ $t('governance.standard.type.dataType.standard') }}</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column :title="$t('common.operations')" width="200" align="center">
          <template v-slot="data">
            <a v-if="data.row.dataType === 0" @click="handleForm(data.row, 'add')">
              {{ t('common.operations.add') }}
            </a>
            <a v-if="isEmpty(data.row.children)" @click="deleteNode(data.row.id)">
              {{ t('common.operations.delete') }}
            </a>
            <a @click="handleForm(data.row, 'edit')">
              {{ t('common.operations.update') }}
            </a>
          </template>
        </tiny-grid-column>
      </tiny-grid>
    </div>
  </div>

  <div>
    <tiny-drawer :title="drawTitle"
                 :visible="drawVisible"
                 @update:visible="drawVisible = $event"
                 :show-header="true"
                 :mask-closable="false"
                 width="50%"
                 @close="handleDrawerClose(false)">
      <div>
        <DsmNewForm :form-data="formData" :form-tree="formTree"></DsmNewForm>
      </div>
    </tiny-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Grid as TinyGrid, GridColumn as TinyGridColumn, Modal } from '@opentiny/vue'
import { useI18n } from 'vue-i18n'
import { iconFiletext, iconFolderOpened } from '@opentiny/vue-icon'
import { StandardTypeService } from '@/services/governance/standard'
import { assign, cloneDeep, isEmpty } from 'lodash-es'
import DsmNewForm from '@/views/governance/data-standard/components/dsm-new-form.vue'
import emitter from '@/utils/evnetbus'
import type { MenuInfo } from '@/services/sys/sys-menu'

const { t } = useI18n()
const IconFolderOpened = iconFolderOpened()
const IconFiletext = iconFiletext()


const drawVisible = ref(false)
const drawTitle = ref('')
const formData = ref()
const formDataCopy = ref()

const tableData = ref()
const formTree = ref()
const treeConfig = ref({
  children: 'children',
  trigger: 'cell',
  indent: 12,
  expandAll: true
})


const searchValue = ref()

const search = async () => {
  let list = await StandardTypeService.getList()
  let data: any = {
    children: []
  }
  list.forEach((o: any) => {
    getDir(o, data)
  })
  if (!isEmpty(searchValue.value)) {
    let value:any = []
    list.forEach(l => {
      const result = filter(l)
      if (result) {
        value.push(l)
      }
    })
    tableData.value = value
  }else{
    tableData.value = list
  }
  formTree.value = {
    data: data.children
  }
}

const getDir = (data: any, parent: any) => {
  if (data.dataType === 0) {
    let dir: any = {
      id: data.id,
      name: data.name,
      children: []
    }
    if (!isEmpty(data.children)) {
      data.children.forEach((d: any) => {
        getDir(d, dir)
      })
    }
    parent.children.push(dir)
  }
}

const filter = (data: any) => {
  let isShow = false
  if (data.name.indexOf(searchValue.value) != -1) {
    isShow = true
  }
  let children = [] as MenuInfo[]
  if (!isEmpty(data.children)) {
    data.children.forEach(data => {
      const result = filter(data)
      if (result) {
        children.push(data)
      }
    })
  }
  if (!isEmpty(children)) {
    isShow = true
  }
  data.children = children
  return isShow
}

const handleForm = (row: any, typeValue: any) => {
  if (typeValue == 'add') {
    drawTitle.value = t('common.text.add.data')
    formData.value = {
      id: 0,
      pid: 0,
      dataType: 0
    }
    if (!isEmpty(row)) {
      formData.value.pid = row.id
      formData.value.dataType = 1
    }
  } else {
    drawTitle.value = t('common.text.update.data')
    formData.value = row
    formDataCopy.value = cloneDeep(row)
  }
  drawVisible.value = true
}

const deleteNode = (id: any) => {
  Modal.confirm(t('common.prompt.delete')).then(async (res: string) => {
    if (res === 'confirm') {
      await StandardTypeService.deleteById(id)
      Modal.message({
        message: t('common.prompt.delete.success'),
        status: 'success'
      })
      await search()
    }
  })
}

const handleDrawerClose = (isUp: any) => {
  if (isUp) {
    search()
  } else {
    assign(formData.value, formDataCopy.value)
  }
  drawVisible.value = false
}

emitter.on('drawerTypeCancel', (isUp) => {
  handleDrawerClose(isUp)
})

onMounted(async () => {
  await search()
})
</script>

<style scoped lang="less">
.icon-span {
  padding-left: 8px;
}

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

.grid-toolbar {
  display: flex;
  justify-content: left;
  width: calc(25vh + 100px);
  margin: 10px 0;

  div {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }
}

.svg-dir {
  fill: #ffcc41;
  color: #ffcc41;
}

.svg-file {
  fill: #1ac456;
}

</style>
