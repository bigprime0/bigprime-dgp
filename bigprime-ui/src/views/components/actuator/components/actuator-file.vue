<template>
  <Attachment ref="attachmentRef" :attachment-uuid="data.attachmentUuid" />
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import type { FileActuatorParam } from '@/views/components/actuator/actuator-types'
import { isEmpty } from 'lodash-es'
import Attachment from '@/views/components/attachment/attachment.vue'

const props = defineProps({
  fileActuatorParamJson: {
    type: String,
    required: true
  }
})

const attachmentRef = ref()
const data = ref<FileActuatorParam>({} as FileActuatorParam)
const dataJson = computed(() => {
  data.value.attachmentUuid = attachmentRef.value.attachmentUuid
  return JSON.stringify(data.value)
})

watchEffect(() => {
  if (!isEmpty(props.fileActuatorParamJson)) {
    data.value = JSON.parse(props.fileActuatorParamJson)
  }
})

defineExpose({
  dataJson
})

</script>

<style scoped lang="less">
.grid-toolbar {
  display: flex;
  justify-content: left;
  width: calc(35vh + 100px);
  margin: 12px 0;

  div {
    margin-right: 10px;
  }
}
</style>
