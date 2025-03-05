<template>
  <tiny-link class="link-add" @click="addCondition('','')" :underline="false" :icon="iconNode()"></tiny-link>
  <div v-if="!isEmpty(configs)" style="max-height: 300px;overflow: auto;">
    <div style="display: flex; margin: 10px 0 0 0;" v-for="(item, index) in configs" :key="index">
      <span class="span-font">{{ $t('datasource.custom.attribute') }}</span>
      <tiny-input style="width: 40%;margin-left: 5px;" v-model="item.key"></tiny-input>
      <span class="span-font">{{ $t('datasource.custom.value') }}</span>
      <tiny-input style="width: 30%;margin-left: 5px;" v-model="item.value"></tiny-input>
      <tiny-link class="link-delete" @click="deleteCondition(item.key)" :underline="false"
                 :icon="iconNodeOpen()"></tiny-link>
      <br />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { iconNode, iconNodeOpen } from '@opentiny/vue-icon'
import { isEmpty, trim } from 'lodash-es'

const data = defineModel('data', { default: {} as any })
const configs = ref<any[]>([])

const resultData = computed(() => {
  let result: any = {}
  configs.value.forEach(o => {
    if (trim(o.key).length > 0 && trim(o.value).length > 0) {
      result[o.key] = o.value
    }
  })
  return result
})

const addCondition = (key: any, value: any) => {
  configs.value.push({ key: key, value: value })
}

const deleteCondition = (key: any) => {
  configs.value = configs.value.filter(item => item.key !== key)
}

watch(data, () => {
  configs.value = []
  if (!isEmpty(data.value)) {
    let object:any = []
    Object.entries(data.value).forEach(([key, value]) => {
      object.push({ key: key, value: value })
    })
    configs.value = object
  }
})

defineExpose({
  resultData
})

</script>

<style scoped lang="less">
.span-font {
  font-size: 13px;
  color: #2c3e50;
  margin-top: 2px;
  margin-left: 20px;
}

.link-add {
  :deep(.tiny-link-svg) {
    --ti-link-svg-width: 1.4em;
    --ti-link-svg-height: 1.4em;
    fill: #1ac456;
  }
}

.link-delete {
  margin-left: 5px;

  :deep(.tiny-link-svg) {
    --ti-link-svg-width: 1.4em;
    --ti-link-svg-height: 1.4em;
    fill: #ee0808;
  }
}
</style>
