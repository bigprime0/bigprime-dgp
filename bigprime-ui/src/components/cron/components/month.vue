<template>
  <tiny-form>
    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="1">
            月，允许的通配符[, - * /]
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="2">
            周期从
            <tiny-input type="number" v-model='cycle01' :min="1" :max="11" />
            -
            <tiny-input type="number" v-model='cycle02' :min="cycle01 ? cycle01 + 1 : 2" :max="12" />
            月
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="3">
            从
            <tiny-input type="number" v-model='average01' :min="1" :max="11" />
            月开始，每
            <tiny-input type="number" v-model='average02' :min="1" :max="12 - average01 || 0" />
            月月执行一次
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="6">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="4">
            指定
            <tiny-select clearable v-model="checkboxList" placeholder="可多选" multiple :show-alloption="false">
              <tiny-option v-for="item in 12" :key="item" :value="item">{{ item }}</tiny-option>
            </tiny-select>
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>
  </tiny-form>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { checkNum } from '@/utils/tool'
import { isEmpty } from 'lodash-es'

const radioValue = ref(1)
const cycle01 = ref(1)
const cycle02 = ref(2)
const average01 = ref(1)
const average02 = ref(1)
const checkboxList = ref([])
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
      cron.value.month = '*'
      break
    case 2:
      cycle01.value = checkNum(cycle01.value, 1, 11)
      cycle02.value = checkNum(cycle02.value, cycle01.value ? cycle01.value + 1 : 2, 12)
      cron.value.month = cycle01.value + '-' + cycle02.value
      break
    case 3:
      average01.value = checkNum(average01.value, 1, 11)
      average02.value = checkNum(average02.value, 1, 12 - average01.value || 0)
      cron.value.month = average01.value + '/' + average02.value
      break
    case 4:
      cron.value.month = isEmpty(checkboxList.value) ? '*' : checkboxList.value.join()
      break
  }
}

watchEffect(() => radioChange())
</script>
