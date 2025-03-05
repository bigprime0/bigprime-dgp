<template>
  <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}</tiny-divider>

  <tiny-form ref="dataServiceExampleFormRef" :model="dataServiceExampleFormData" label-width="100px" overflow-title>
    <tiny-row>
      <tiny-col :span="5">
        <tiny-form-item :label="$t('service.api.field.path')">
          <tiny-input v-model="dataServiceExampleFormData.path" disabled></tiny-input>
        </tiny-form-item>
      </tiny-col>
      <tiny-col :span="5">
        <tiny-form-item :label="$t('service.api.field.name')">
          <tiny-input v-model="dataServiceExampleFormData.name" disabled></tiny-input>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>

    <tiny-row>
      <tiny-col :span="5">
        <tiny-form-item :label="$t('service.api.field.apiKey')">
          <tiny-input v-model="dataServiceExampleFormData.apiKey" disabled></tiny-input>
        </tiny-form-item>
      </tiny-col>
      <tiny-col :span="5">
        <tiny-form-item :label="$t('service.api.field.secretKey')">
          <tiny-input v-model="dataServiceExampleFormData.secretKey" disabled></tiny-input>
        </tiny-form-item>
      </tiny-col>
    </tiny-row>
  </tiny-form>

  <tiny-tabs v-model="activeName">
    <tiny-tab-item :title="$t('service.api.field.request.parameters')" lazy name="request">
      <tiny-input type="number" :title="$t('service.api.field.current.page')" v-model="currentPage"
                  style="width: 90px;margin-right: 10px;"></tiny-input>
      <tiny-input type="number" :title="$t('service.api.field.page.size')" v-model="pageSize"
                  style="width: 90px;margin-right: 15px;"></tiny-input>
      <tiny-link class="link-exec" :underline="false" :icon="iconDeltaRight()"
                 :title="$t('common.operations.test')"
                 @click="searchData"> {{ $t('datasource.execute.run') }}
      </tiny-link>

      <tiny-popover width="500">
        <json-viewer
          :preview-mode="false"
          :expanded="false"
          :expand-depth="3"
          :copyable="true"
          :value="jsonData" />
        <template #reference>
          <tiny-link class="link-exec" :underline="false" :icon="iconSearch()"
                     title="JSON"
                     @click="showQuery">JSON
          </tiny-link>
        </template>
      </tiny-popover>


      <tiny-grid style="margin-top: 10px;max-height: 270px;overflow: auto;"
                 :data="dataServiceExampleFormData.config.reqParameter" :fit="true"
                 show-header-overflow="tooltip"
                 size="small" auto-resize border :stripe="true"
                 :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
                 highlight-hover-row>
        <tiny-grid-column field="column" :title="$t('datasource.structure.name')" />
        <tiny-grid-column field="dataType" width="100" :title="$t('datasource.structure.data.type')" />
        <tiny-grid-column field="comment" :title="$t('datasource.structure.comment')" />
        <tiny-grid-column field="isNullable" width="70" :title="$t('datasource.structure.is.nullable')">
          <template v-slot="data">
            <tiny-checkbox v-model="data.row.isNullable" disabled :true-label="true" :false-label="false" />
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="operator" :title="$t('datasource.structure.operator')">
          <template v-slot="data">
            <tiny-select v-model="data.row.operator" disabled clearable>
              <tiny-option v-for="item in operatorData" :key="item.value" :label="item.label" :value="item.value">
              </tiny-option>
            </tiny-select>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="exampleValue" :title="$t('service.api.field.example.value')">
          <template #edit="data">
            <tiny-input v-model="data.row.exampleValue" />
          </template>
          <template v-slot="data">
            <tiny-input v-model="data.row.exampleValue" />
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="defaultValue" :title="$t('datasource.structure.default.value')">
          <template v-slot="data">
            <tiny-input v-model="data.row.defaultValue" disabled />
          </template>
        </tiny-grid-column>

      </tiny-grid>
    </tiny-tab-item>

    <tiny-tab-item :title="$t('service.api.field.return.parameters')" lazy name="return">
      <tiny-grid style="margin-top: 10px;max-height: 270px;overflow: auto;"
                 :data="dataServiceExampleFormData.config.resParameter" :fit="true"
                 size="small" auto-resize border :stripe="true"
                 show-header-overflow="tooltip"
                 :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
                 highlight-hover-row>
        <tiny-grid-column field="column" :title="$t('datasource.structure.name')" />
        <tiny-grid-column field="dataType" width="100" :title="$t('datasource.structure.data.type')" />
        <tiny-grid-column field="comment" :title="$t('datasource.structure.comment')" />
        <tiny-grid-column field="securityId" :title="$t('security.encryption')">
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
    </tiny-tab-item>
  </tiny-tabs>

  <tiny-divider content-position="left" content-color="#7693f5">
    <span>{{ $t('service.api.field.example.return.result') + ' (' + count + ')' }}</span>
  </tiny-divider>
  <tiny-grid style="margin-top: 10px;max-height: 270px;overflow: auto;"
             :data="resultData" :fit="false" size="small" auto-resize border
             show-header-overflow="tooltip" show-overflow="tooltip"
             column-width="150"
             :stripe="true"
             highlight-hover-row>
    <tiny-grid-column v-for="item in resultHeader" :key="item"
                      :field="item"
                      :title="item" />
  </tiny-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { operatorData } from '@/services/spi/source'
import { iconDeltaRight, iconSearch } from '@opentiny/vue-icon'
import { DataServiceApiService } from '@/services/service/service-api'


const { t } = useI18n()
const securityData = defineModel('securityData', { default: [] as any })
const dataServiceExampleFormData = defineModel('dataServiceExampleFormData', {
  default: {
    apiKey: '',
    config: {
      reqParameter: [],
      resParameter: []
    }
  } as any
})
const activeName = ref('request')
const resultData = ref()
const resultHeader = ref()

const jsonData = ref()
const pageSize = ref(dataServiceExampleFormData.value.maxNum ? dataServiceExampleFormData.value.maxNum : 100)
const currentPage = ref(1)
const count = ref(0)

const showQuery = () => {
  let query: any = {
    apiKey: dataServiceExampleFormData.value.apiKey
  }
  if (dataServiceExampleFormData.value.secretKey) {
    query.secretKey = dataServiceExampleFormData.value.secretKey
  }

  if (!currentPage.value || currentPage.value <= 0) {
    currentPage.value = 1
  }
  query.currentPage = currentPage.value

  if (pageSize.value) {
    if (pageSize.value <= 0) {
      pageSize.value = dataServiceExampleFormData.value.maxNum ? dataServiceExampleFormData.value.maxNum : 100
    } else if (dataServiceExampleFormData.value.maxNum && pageSize.value > dataServiceExampleFormData.value.maxNum) {
      pageSize.value = dataServiceExampleFormData.value.maxNum
    }
  } else {
    pageSize.value = 100
  }
  query.pageSize = pageSize.value

  if (dataServiceExampleFormData.value.config.reqParameter) {
    let parameter: any = {}
    dataServiceExampleFormData.value.config.reqParameter.forEach((o: any) => {
      if (o.exampleValue) {
        parameter[o.column] = o.exampleValue
      }
    })
    query.parameterJson = JSON.stringify(parameter)
  }

  jsonData.value = query
}

const searchData = async () => {
  showQuery()
  const result = await DataServiceApiService.testApi(jsonData.value)
  resultHeader.value = result.headers
  resultData.value = result.columns
  count.value = resultData.value.length
}
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

.link-exec {
  margin-right: 15px;

  :deep(.tiny-link-svg) {
    fill: #1ac456;
    margin-bottom: 3px;
  }

  :deep(.tiny-link__inner) {
    margin-left: 2px;
    color: #1ac456;
  }
}
</style>
