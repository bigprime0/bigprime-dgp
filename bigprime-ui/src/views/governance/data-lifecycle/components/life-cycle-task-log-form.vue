<template>
  <div class="ds-form">
    <tiny-form :model="logFormData" label-width="100px" overflow-title disabled>
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>


      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'lifeCycleId')}"
                          :label="logFormData.type === 1 ? $t('lifecycle.filing.field.nearline.name') :
                                  logFormData.type === 2 ? $t('lifecycle.filing.field.offline.name') : $t('lifecycle.filing.field.destruction.name')">
            <tiny-input v-model="logFormData.lifeCycleName"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'name')}"
                          :label="logFormData.type === 1 ? $t('lifecycle.task.field.nearline.name') :
                                  logFormData.type === 2 ? $t('lifecycle.task.field.offline.name') : $t('lifecycle.task.field.destruction.name')">
            <tiny-input v-model="logFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-row>
          <tiny-col :span="6">
            <tiny-form-item :class="{'span-change':includes(colorChanges,'taskType')}"
                            :label="$t('lifecycle.task.field.taskType')">
              <tiny-radio v-model='logFormData.taskType' :label=1>
                {{ $t('lifecycle.task.field.taskType.disposable') }}
              </tiny-radio>
              <tiny-radio v-model='logFormData.taskType' :label=2>
                {{ $t('lifecycle.task.field.taskType.periodicity') }}
              </tiny-radio>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'sourceId')}"
                          :label="$t('lifecycle.filing.field.sourceId')">
            <tiny-select v-model="logFormData.sourceId" disabled>
              <tiny-option v-for="item in source" :key="item.id" :label="item.name" :value="item.id"></tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'tableName')}"
                          :label="$t('lifecycle.filing.field.tableName')">
            <tiny-input v-model="logFormData.tableName" disabled></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'condition')}"
                          :label="logFormData.type === 1 ? $t('lifecycle.filing.field.nearline.condition') :
                                  logFormData.type === 2 ? $t('lifecycle.filing.field.offline.condition') : $t('lifecycle.filing.field.destruction.condition')">
            <tiny-input type="textarea" v-model="logFormData.condition" :rows=3 show-word-limit
                        disabled></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'remark')}"
                          :label="$t('common.summary')">
            <tiny-input type="textarea" v-model="logFormData.remark" :rows=3 show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'status')}"
                          :label="$t('common.operations.status')">
            <tiny-radio v-model="logFormData.status" :label=0>{{ $t('common.operations.status.new') }}</tiny-radio>
            <!--            <tiny-radio v-model="logFormData.status" :label=1>{{ $t('common.operations.status.underReview') }}</tiny-radio>-->
            <tiny-radio v-model="logFormData.status" :label=2>{{ $t('common.operations.status.published') }}</tiny-radio>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :class="{'span-change':includes(colorChanges,'taskStatus')}"
                          :label="$t('common.operations.execute.status')">
            <tiny-radio v-model="logFormData.taskStatus" :label=0>{{ $t('common.operations.execute.status.notStarted') }}</tiny-radio>
            <tiny-radio v-model="logFormData.taskStatus" :label=1>{{ $t('common.operations.execute.status.inProgress') }}</tiny-radio>
            <tiny-radio v-model="logFormData.taskStatus" :label=2>{{ $t('common.operations.execute.status.completed') }}</tiny-radio>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>
  </div>
</template>

<script setup lang="ts">
import { includes } from 'lodash-es'

const logFormData = defineModel('logFormData', { default: {} as any })
const source = defineModel('source', { default: [] as any })
const colorChanges = defineModel('colorChanges', { default: [] })
</script>

<style scoped lang="less">
.span-font {
  font-size: 12px;
  color: #000000;
}

.ds-form {
  padding: 10px;

  :deep(.container-form) {
    margin-top: 0;
    padding: 20px 15px 15px 15px;
    border-radius: 0;
    box-shadow: 0 0 2px 2px #eee;
    height: 100vh - 80px;
    height: calc(100vh - 130px);
  }
}

.span-change {
  :deep(.tiny-form-item__label) {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: var(--ti-form-item-label-font-size);
    color: #e08331;
    height: var(--ti-form-item-label-line-height);
    line-height: var(--ti-form-item-label-line-height);
    padding-right: 8px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
