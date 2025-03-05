<template>
  <div class="ds-form">
    <br />
    <tiny-steps line size="large" :data="[{ name: t('service.api.field.attribute.configuration') },{ name: t('service.api.field.execution.configuration') },{ name: t('service.api.field.parameter.configuration') }]"
                :active="active"
                @click="handleClick"></tiny-steps>
    <br />
    <tiny-form ref="dataServiceApiFormRef" :model="dataServiceApiFormData" :rules="dataServiceApiFormRules"
               label-width="100px" :disabled="dataServiceApiFormData.status !== 0" overflow-title>

      <div v-show="active === 0">
        <tiny-row>
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.name')" :show-message="false" prop="name">
              <tiny-input v-model="dataServiceApiFormData.name"></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>

        <tiny-row>
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.version')" :show-message="false" prop="version">
              <tiny-input v-model="dataServiceApiFormData.version"></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>

        <tiny-row>
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.beginTime')">
              <tiny-date-picker size="mini" v-model="dataServiceApiFormData.beginTime"></tiny-date-picker>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>

        <tiny-row>
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.endTime')">
              <tiny-date-picker size="mini" v-model="dataServiceApiFormData.endTime"></tiny-date-picker>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>

        <tiny-row>
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.maxNum')">
              <tiny-input v-model="dataServiceApiFormData.maxNum"></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>

        <tiny-row>
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.currentLimit')">
              <span style="font-size: 12px;color: #000000;">{{ t('service.api.field.every') }}</span>
              <tiny-input style="width: 90px;margin: 0 5px;" v-model="dataServiceApiFormData.currentLimitSecond"
                          type="number" :min="0"></tiny-input>
              <span style="font-size: 12px;color: #000000;">{{ t('service.api.field.seconds') }}</span>
              <tiny-input style="width: 90px;margin: 0 5px;" v-model="dataServiceApiFormData.currentLimitNumber"
                          type="number" :min="0"></tiny-input>
              <span style="font-size: 12px;color: #000000;">{{ t('service.api.field.order') }}</span>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>

        <tiny-row>
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.secretKey')">
              <tiny-input v-model="dataServiceApiFormData.secretKey">
                <template #append>
                  <tiny-button :reset-time="500" type="primary"
                               @click="dataServiceApiFormData.secretKey = createUuid()">
                    {{ $t('common.operations.generate') }}
                  </tiny-button>
                </template>
              </tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>

        <tiny-row>
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.description')">
              <tiny-input type="textarea" v-model="dataServiceApiFormData.description" show-word-limit
                          :maxlength="300"></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
      </div>

      <div v-show="active === 1">
        <tiny-row v-show="dataServiceApiFormData.type === 'OTHER'">
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.sourceId')">
              <DatasourceSelect ref="sourceSelectRef" :data-base-id="dataServiceApiFormData.sourceId"
                                @change="sourceChange"></DatasourceSelect>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>

        <tiny-row v-show="dataServiceApiFormData.type === 'OTHER'">
          <tiny-col :span="10">
            <tiny-form-item :label="$t('service.api.field.sourceTable')">
              <tiny-select v-model="dataServiceApiFormData.sourceTable" clearable filterable>
                <tiny-option v-for="item in sourceTableData" :key="item.name" :label="item.name" :value="item.name">
                </tiny-option>
              </tiny-select>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>

        <tiny-grid style="margin-top: 10px;max-height: 480px;overflow: auto;" :data="sourceColumnData" :fit="true"
                   size="small" auto-resize border :stripe="true"
                   show-header-overflow="tooltip"
                   :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
                   highlight-hover-row>
          <tiny-grid-column field="column" :title="$t('datasource.structure.name')" />
          <tiny-grid-column field="dataType" width="100" :title="$t('datasource.structure.data.type')" />
          <tiny-grid-column field="comment" :title="$t('datasource.structure.comment')" />
          <tiny-grid-column field="request" width="70" :title="$t('service.api.field.request.parameters')">
            <template #edit="data">
              <tiny-checkbox v-model="data.row.request" :true-label="true" :false-label="false"
                             @change="requestChange(data.row)" />
            </template>
            <template v-slot="data">
              <tiny-checkbox v-model="data.row.request" :true-label="true" :false-label="false"
                             @change="requestChange(data.row)" />
            </template>
          </tiny-grid-column>
          <tiny-grid-column field="return" width="70" :title="$t('service.api.field.return.parameters')">
            <template #edit="data">
              <tiny-checkbox v-model="data.row.return" :true-label="true" :false-label="false"
                             @change="returnChange(data.row)" />
            </template>
            <template v-slot="data">
              <tiny-checkbox v-model="data.row.return" :true-label="true" :false-label="false"
                             @change="returnChange(data.row)" />
            </template>
          </tiny-grid-column>
        </tiny-grid>
      </div>

      <div v-show="active === 2">
        <tiny-divider content-position="left" content-color="#7693f5">{{ $t('service.api.field.request.parameters') }}
        </tiny-divider>
        <tiny-grid style="margin-top: 10px;max-height: 270px;overflow: auto;"
                   :data="reqParameter" :fit="true"
                   show-header-overflow="tooltip"
                   size="small" auto-resize border :stripe="true"
                   :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
                   highlight-hover-row>
          <tiny-grid-column field="column" :title="$t('datasource.structure.name')" />
          <tiny-grid-column field="dataType" width="100" :title="$t('datasource.structure.data.type')" />
          <tiny-grid-column field="comment" :title="$t('datasource.structure.comment')" />
          <tiny-grid-column field="isNullable" width="70" :title="$t('datasource.structure.is.nullable')">
            <template #edit="data">
              <tiny-checkbox v-model="data.row.isNullable" :true-label="true" :false-label="false" />
            </template>
            <template v-slot="data">
              <tiny-checkbox v-model="data.row.isNullable" :true-label="true" :false-label="false" />
            </template>
          </tiny-grid-column>
          <tiny-grid-column field="operator" :title="$t('datasource.structure.operator')">
            <template #edit="data">
              <tiny-select v-model="data.row.operator" clearable>
                <tiny-option v-for="item in operatorData" :key="item.value" :label="item.label" :value="item.value">
                </tiny-option>
              </tiny-select>
            </template>
            <template v-slot="data">
              <tiny-select v-model="data.row.operator" clearable>
                <tiny-option v-for="item in operatorData" :key="item.value" :label="item.label" :value="item.value">
                </tiny-option>
              </tiny-select>
            </template>
          </tiny-grid-column>
          <tiny-grid-column field="defaultValue" :title="$t('datasource.structure.default.value')">
            <template #edit="data">
              <tiny-input v-model="data.row.defaultValue" />
            </template>
            <template v-slot="data">
              <tiny-input v-model="data.row.defaultValue" />
            </template>
          </tiny-grid-column>

        </tiny-grid>
        <tiny-divider content-position="left" content-color="#7693f5">{{ $t('service.api.field.return.parameters') }}
        </tiny-divider>
        <tiny-grid style="margin-top: 10px;max-height: 270px;overflow: auto;"
                   :data="resParameter" :fit="true"
                   size="small" auto-resize border :stripe="true"
                   show-header-overflow="tooltip"
                   :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
                   highlight-hover-row>
          <tiny-grid-column field="column" :title="$t('datasource.structure.name')" />
          <tiny-grid-column field="dataType" width="100" :title="$t('datasource.structure.data.type')" />
          <tiny-grid-column field="comment" :title="$t('datasource.structure.comment')" />
          <tiny-grid-column field="securityId" :title="$t('security.encryption')">
            <template #edit="data">
              <tiny-select v-model="data.row.securityId" filterable clearable>
                <tiny-option-group v-for="group in securityData" :key="group.key" :label="group.key">
                  <tiny-option
                    v-for="item in group.value"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :title="item.name"
                  ></tiny-option>
                </tiny-option-group>
              </tiny-select>
            </template>
            <template v-slot="data">
              <tiny-select v-model="data.row.securityId" filterable clearable>
                <tiny-option-group v-for="group in securityData" :key="group.key" :label="group.key">
                  <tiny-option
                    v-for="item in group.value"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :title="item.name"
                  ></tiny-option>
                </tiny-option-group>
              </tiny-select>
            </template>
          </tiny-grid-column>
        </tiny-grid>
      </div>
    </tiny-form>
    <br />
    <div style="text-align: center">
      <tiny-button v-if="active > 0" :reset-time="1" type="primary" @click="handlePrev">
        {{ t('common.operations.step.prev') }}
      </tiny-button>
      <tiny-button v-if="active < 2" :reset-time="1" type="primary" @click="handleNext">
        {{ t('common.operations.step.next') }}
      </tiny-button>
      <tiny-button v-if="active === 2 && dataServiceApiFormData.status === 0" :reset-time="500" type="primary"
                   @click="saveDataServiceApiData">
        {{ $t('common.operations.save') }}
      </tiny-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { DataServiceApiService } from '@/services/service/service-api'
import { createUuid } from '@/utils/tool'
import DatasourceSelect from '@/views/data-source/components/dsm-source-select.vue'
import { operatorData, SourceService } from '@/services/spi/source'
import { cloneDeep, find, isEmpty } from 'lodash-es'


const { t } = useI18n()
const dataServiceApiFormRef = ref()
const securityData = defineModel('securityData', { default: [] as any })
const dataServiceApiFormData = defineModel('dataServiceApiFormData', {
  default: {
    id: 0,
    status: 0,
    type: 'OTHER',
    config: {
      reqParameter: [],
      resParameter: []
    }
  } as any
})
const active = ref(0)
const sourceSelectRef = ref()
const sourceTableData = ref()
const sourceColumnData = ref()
const reqParameter = ref([] as any)
const resParameter = ref([] as any)

const dataServiceApiFormRules = computed(() => {
  let ruleList = {
    name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    version: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const requestChange = async (data: any) => {
  if (data.request) {
    let value = find(reqParameter.value, { column: data.column })
    if (!value) {
      let req = find(dataServiceApiFormData.value?.config?.reqParameter, { column: data.column })
      if (req) {
        reqParameter.value.push(cloneDeep(req))
      } else {
        reqParameter.value.push(data)
      }
    }
  } else {
    reqParameter.value = reqParameter.value.filter((item: any) => item.column !== data.column)
  }
}
const returnChange = async (data: any) => {
  if (data.return) {
    let value = find(resParameter.value, { column: data.column })
    if (!value) {
      let res = find(dataServiceApiFormData.value?.config?.resParameter, { column: data.column })
      if (res) {
        resParameter.value.push(cloneDeep(res))
      } else {
        resParameter.value.push(data)
      }
    }
  } else {
    resParameter.value = resParameter.value.filter((item: any) => item.column !== data.column)
  }
}

const sourceChange = async () => {
  dataServiceApiFormData.value.sourceId = sourceSelectRef.value.dataBaseId
  dataServiceApiFormData.value.sourceTable = ''
}

const handleClick = (index: any) => {
  active.value = index
}

const handlePrev = () => {
  active.value = active.value > 0 ? active.value - 1 : 0
}

const handleNext = () => {
  active.value = active.value < 2 ? active.value + 1 : 2
}

const saveDataServiceApiData = () => {
  dataServiceApiFormRef.value
    .validate()
    .then(async () => {
      dataServiceApiFormData.value.config.reqParameter = reqParameter.value
      dataServiceApiFormData.value.config.resParameter = resParameter.value
      await DataServiceApiService.save(dataServiceApiFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataServiceApiForm(true)
    })
}

const closeDataServiceApiForm = (isUp: boolean) => {
  emitter.emit('closeDataServiceApiForm', isUp)
}

watchEffect(async () => {
  if (dataServiceApiFormData.value.sourceId && dataServiceApiFormData.value.type === 'OTHER') {
    sourceTableData.value = await SourceService.getTables(dataServiceApiFormData.value.sourceId, false)
  } else {
    sourceTableData.value = []
  }
})

watchEffect(async () => {
  if (!isEmpty(dataServiceApiFormData.value.sourceTable)) {
    const result = await SourceService.getTable(dataServiceApiFormData.value.sourceId, dataServiceApiFormData.value.sourceTable)
    let reqData: any = []
    let resData: any = []
    result?.columns.forEach((o: any) => {
      o.request = false
      o.return = false
      let req = find(dataServiceApiFormData.value?.config?.reqParameter, { column: o.column })
      if (req) {
        o.request = true
        reqData.push(cloneDeep(req))
      }
      let res = find(dataServiceApiFormData.value?.config?.resParameter, { column: o.column })
      if (res) {
        o.return = true
        resData.push(cloneDeep(res))
      }
    })
    sourceColumnData.value = result?.columns
    reqParameter.value = reqData
    resParameter.value = resData
  } else {
    sourceColumnData.value = []
    reqParameter.value = []
    resParameter.value = []
  }
})
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
    height: calc(100vh - 130px);
  }
}
</style>
