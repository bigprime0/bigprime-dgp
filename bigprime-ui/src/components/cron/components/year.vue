<template>
  <tiny-form>
    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio :label="1" v-model='radioValue'>
            不填，允许的通配符[, - * /]
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio :label="2" v-model='radioValue'>
            每年
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio :label="3" v-model='radioValue'>
            周期从
            <tiny-input type="number" v-model='cycle01' :min='fullYear' :max="2098" />
            -
            <tiny-input type="number" v-model='cycle02' :min="cycle01 ? cycle01 + 1 : fullYear + 1" :max="2099" />
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio :label="4" v-model='radioValue'>
            从
            <tiny-input type="number" v-model='average01' :min='fullYear' :max="2098" />
            年开始，每
            <tiny-input type="number" v-model='average02' :min="1" :max="2099 - average01 || fullYear" />
            年执行一次
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="12">
        <tiny-form-item>
          <tiny-radio :label="5" v-model='radioValue'>
            指定
            <tiny-select clearable v-model="checkboxList" placeholder="可多选" multiple :show-alloption="false">
              <tiny-option v-for="item in 10" :key="item" :value="item - 1 + fullYear" :label="item -1 + fullYear" />
            </tiny-select>
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>
  </tiny-form>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { checkNum } from '@/utils/tool'
import { isEmpty } from 'lodash-es'

const radioValue = ref(1)
const cycle01 = ref(Number(new Date().getFullYear()))
const cycle02 = ref()
const average01 = ref(Number(new Date().getFullYear()))
const average02 = ref(1)
const checkboxList = ref([])
const fullYear = ref(Number(new Date().getFullYear()))
const cron = defineModel('cron', {
  default: {
    second: '*',
    min: '*',
    hour: '*',
    day: '*',
    month: '*',
    week: '?',
    year: ''
  }
})

defineExpose({
  radioValue,
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList
})

// 单选按钮值变化时
const radioChange = () => {
  switch (radioValue.value) {
    case 1:
      cron.value.year = ''
      break
    case 2:
      cron.value.year = '*'
      break
    case 3:
      cycle01.value = checkNum(cycle01.value, fullYear.value, 2098)
      cycle02.value = checkNum(cycle02.value, cycle01.value ? cycle01.value + 1 : fullYear.value + 1, 2099)
      cron.value.year = cycle01.value + '-' + cycle02.value
      break
    case 4:
      average01.value = checkNum(average01.value, fullYear.value, 2098)
      average02.value = checkNum(average02.value, 1, 2099 - average01.value || fullYear.value)
      cron.value.year = average01.value + '/' + average02.value
      break
    case 5:
      cron.value.year = isEmpty(checkboxList.value) ? '' : checkboxList.value.join()
      break
  }
}

watchEffect(() => radioChange())
</script>
