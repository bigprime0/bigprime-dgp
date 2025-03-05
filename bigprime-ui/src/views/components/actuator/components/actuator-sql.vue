<template>
  <tiny-row>
<!--    <tiny-col :span="6">
      <tiny-form-item>
        <tiny-radio v-model="data.dataBaseType" :label=1>{{ $t('datasource.select.data.source') }}</tiny-radio>
        <tiny-radio v-model="data.dataBaseType" :label=2>{{ $t('scheduler.actuator.enum.custom') }}</tiny-radio>
      </tiny-form-item>
    </tiny-col>-->
    <tiny-col :span="6">
      <tiny-form-item>
        <DataSourceSelect ref="dataSourceSelectRef" :dataBaseId="data.dataBaseId" />
      </tiny-form-item>
    </tiny-col>
  </tiny-row>

<!--  <tiny-row v-if="data.dataBaseType == 2">
    <tiny-col :span="12">
      <tiny-form-item :label="$t('datasource.config.url')">
        <tiny-input v-model="data.jdbcParam.url"></tiny-input>
      </tiny-form-item>
    </tiny-col>
  </tiny-row>

  <tiny-row v-if="data.dataBaseType == 2">
    <tiny-col :span="12">
      <tiny-form-item :label="$t('datasource.config.schema')">
        <tiny-input v-model="data.jdbcParam.schema"></tiny-input>
      </tiny-form-item>
    </tiny-col>
  </tiny-row>

  <tiny-row v-if="data.dataBaseType == 2">
    <tiny-col :span="6">
      <tiny-form-item :label="$t('datasource.config.userName')">
        <tiny-input v-model="data.jdbcParam.userName"></tiny-input>
      </tiny-form-item>
    </tiny-col>

    <tiny-col :span="6">
      <tiny-form-item :label="$t('datasource.config.passWord')">
        <tiny-input type="password" v-model="data.jdbcParam.passWord" show-password></tiny-input>
      </tiny-form-item>
    </tiny-col>
  </tiny-row>-->

  <tiny-row>
    <tiny-col :span="12">
      <tiny-form-item>
        <monacoEditor height="200px"
                      v-model="data.sql"
                      language="sql">
        </monacoEditor>
      </tiny-form-item>
    </tiny-col>
  </tiny-row>

</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import DataSourceSelect from '@/views/data-source/components/dsm-source-select.vue'
import { has, isEmpty } from 'lodash-es'

const props = defineProps({
  sqlActuatorParamJson: {
    type: String,
    required: true
  }
})

const dataSourceSelectRef = ref()
const data = ref<any>({} as any)
const dataJson = computed(() => {
  data.value.dataBaseId = dataSourceSelectRef.value.dataBaseId
  if (data.value.dataBaseId <= 0) {
    data.value.dataBaseId = 0
  }
  return JSON.stringify(data.value)
})

const defaultValue = () => {
  data.value = {
    dataBaseType: 1,
    dataBaseId: '',
    jdbcParam: {
      url: '',
      schema: '',
      userName: '',
      passWord: ''
    },
    sql: ''
  }
}

watchEffect(() => {
  if(isEmpty(data.value)){
    if (!isEmpty(props.sqlActuatorParamJson)) {
      data.value = JSON.parse(props.sqlActuatorParamJson)
      if (!has(data.value, 'dataBaseType')) {
        defaultValue()
      }
    }else{
      defaultValue()
    }
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
