<template>
  <tiny-form>
    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="1">
            分钟，允许的通配符[, - * /]
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="2">
            周期从
            <tiny-input type="number" v-model='cycle01' :min="0" :max="58" />
            -
            <tiny-input type="number" v-model='cycle02' :min="cycle01 ? cycle01 + 1 : 1" :max="59" />
            分钟
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="3">
            从
            <tiny-input type="number" v-model='average01' :min="0" :max="58" />
            分钟开始，每
            <tiny-input type="number" v-model='average02' :min="1" :max="59 - average01 || 0" />
            分钟执行一次
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
              <tiny-option v-for="item in 60" :key="item" :value="item-1">{{ item - 1 }}</tiny-option>
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
const average01 = ref(0)
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
      cron.value.min = '*'
      break
    case 2:
      cycle01.value = checkNum(cycle01.value, 0, 58)
      cycle02.value = checkNum(cycle02.value, cycle01.value ? cycle01.value + 1 : 1, 59)
      cron.value.min = cycle01.value + '-' + cycle02.value
      break
    case 3:
      average01.value = checkNum(average01.value, 0, 58)
      average02.value = checkNum(average02.value, 1, 59 - average01.value || 0)
      cron.value.min = average01.value + '/' + average02.value
      break
    case 4:
      cron.value.min = isEmpty(checkboxList.value) ? '*' : checkboxList.value.join()
      break
  }
}

watchEffect(() => radioChange())
</script>
