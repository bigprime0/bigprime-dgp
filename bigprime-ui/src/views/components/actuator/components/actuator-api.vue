<template>
  <tiny-row>
    <tiny-col :span="12">
      <tiny-form-item :label="$t('scheduler.job.field.api.requestMethod')" :show-message="false" prop="requestMethod">
        <tiny-radio v-model="data.requestMethod" label="GET">GET</tiny-radio>
        <tiny-radio v-model="data.requestMethod" label="POST">POST</tiny-radio>
      </tiny-form-item>
    </tiny-col>
  </tiny-row>

  <tiny-row>
    <tiny-col :span="12">
      <tiny-form-item :label="$t('scheduler.job.field.api.url')" :show-message="false" prop="url">
        <tiny-input v-model="data.url"></tiny-input>
      </tiny-form-item>
    </tiny-col>
  </tiny-row>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { isEmpty } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import type { ApiActuatorParam } from '@/views/components/actuator/actuator-types'

const props = defineProps({
  apiActuatorParamJson: {
    type: String,
    required: true
  }
})

const data = ref<ApiActuatorParam>({} as ApiActuatorParam)

const dataJson = computed(() => {
  return JSON.stringify(data.value)
})

watchEffect(() => {
  if (!isEmpty(props.apiActuatorParamJson)) {
    data.value = JSON.parse(props.apiActuatorParamJson)
  }
})

defineExpose({
  dataJson
})
</script>
