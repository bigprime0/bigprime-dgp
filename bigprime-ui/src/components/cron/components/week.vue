<template>
  <tiny-form>
    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="1">
            周，允许的通配符[, - * ? / L #]
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="2">
            不指定
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="3">
            周期从星期
            <tiny-select clearable v-model="cycle01">
              <tiny-option
                v-for="(item,index) of weekList"
                :key="index"
                :label="item.value"
                :value="item.key"
                :disabled="item.key === 1"
              >{{ item.value }}
              </tiny-option>
            </tiny-select>
            -
            <tiny-select clearable v-model="cycle02">
              <tiny-option
                v-for="(item,index) of weekList"
                :key="index"
                :label="item.value"
                :value="item.key"
                :disabled="item.key < cycle01 && item.key !== 1"
              >{{ item.value }}
              </tiny-option>
            </tiny-select>
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="3">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="4">
            第
            <tiny-input type="number" v-model='average01' :min="1" :max="4" />
            周的星期
            <tiny-select clearable v-model="average02">
              <tiny-option v-for="(item,index) of weekList" :key="index" :label="item.value" :value="item.key">
                {{ item.value }}
              </tiny-option>
            </tiny-select>
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="12">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="5">
            本月最后一个星期
            <tiny-select clearable v-model="weekday">
              <tiny-option v-for="(item,index) of weekList" :key="index" :label="item.value" :value="item.key">
                {{ item.value }}
              </tiny-option>
            </tiny-select>
          </tiny-radio>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="12">
        <tiny-form-item>
          <tiny-radio v-model='radioValue' :label="6">
            指定
            <tiny-select clearable v-model="checkboxList" placeholder="可多选" multiple :show-alloption="false">
              <tiny-option v-for="(item,index) of weekList" :key="index" :label="item.value" :value="String(item.key)">
                {{ item.value }}
              </tiny-option>
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
import emitter from '@/utils/evnetbus'

const radioValue = ref(2)
const cycle01 = ref(2)
const cycle02 = ref(3)
const average01 = ref(1)
const average02 = ref(2)
const checkboxList = ref([])
const weekday = ref(2)
const weekList = ref([
  {
    key: 2,
    value: '星期一'
  },
  {
    key: 3,
    value: '星期二'
  },
  {
    key: 4,
    value: '星期三'
  },
  {
    key: 5,
    value: '星期四'
  },
  {
    key: 6,
    value: '星期五'
  },
  {
    key: 7,
    value: '星期六'
  },
  {
    key: 1,
    value: '星期日'
  }
])
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
  checkboxList,
  weekday,
  weekList
})

// 单选按钮值变化时
const radioChange = () => {
  if (radioValue.value !== 2 && cron.value.day !== '?') {
    emitter.emit('upDay')
  }
  switch (radioValue.value) {
    case 1:
      cron.value.week = '*'
      break
    case 2:
      cron.value.week = '?'
      break
    case 3:
      cycle01.value = checkNum(cycle01.value, 1, 7)
      cycle02.value = checkNum(cycle02.value, 1, 7)
      cron.value.week = cycle01.value + '-' + cycle02.value
      break
    case 4:
      average01.value = checkNum(average01.value, 1, 4)
      average02.value = checkNum(average02.value, 1, 7)
      cron.value.week = average01.value + '/' + average02.value
      break
    case 5:
      weekday.value = checkNum(weekday.value, 1, 7)
      cron.value.week = weekday.value + 'L'
      break
    case 6:
      cron.value.week = isEmpty(checkboxList.value) ? '*' : checkboxList.value.join()
      break
  }
}

watchEffect(() => radioChange())
</script>
