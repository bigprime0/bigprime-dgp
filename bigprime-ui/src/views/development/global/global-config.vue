<template>
  <div class="container-list">
    <Breadcrumb v-if="!isEmpty(breadcrumb)" style="margin-left: 0" :items="breadcrumb" />
    <div class="contain">
      <tiny-layout>
        <tiny-row>
          <tiny-col :span="8">
            <div class="resource-title">
              <IconSetting style="fill:#3ac295;margin-right: 10px;"></IconSetting>
              <tiny-tag type="success" size="medium">{{ $t(title) }}</tiny-tag>
            </div>
            <div class="resource-des">
              <li>{{ $t(des) }}</li>
            </div>
          </tiny-col>
          <tiny-col :span="4">
            <div class="button-css">
              <tiny-button type="success" :icon="iconEdit()" circle
                           :title="$t('common.operations.update')"
                           :disabled="!disabled"
                           @click="disabled = false" />

              <tiny-button type="primary" :icon="iconDone()" circle
                           v-loading.lock.fullscreen="saveLoading"
                           tiny-loading__background="rgba(0, 0, 0, 0.08)"
                           tiny-loading__size="large"
                           :title="$t('common.operations.save')"
                           :disabled="disabled"
                           @click="save" />
            </div>
          </tiny-col>
        </tiny-row>

        <tiny-divider></tiny-divider>
        <div v-if="type === 1">
          <tiny-row>
            <tiny-col :span="8">
              <div class="resource-title">
                <IconEditorList style="fill:#526ecc;margin-right: 10px;"></IconEditorList>
                <tiny-tag color="blue" size="medium">{{ $t('Python环境变量') }}</tiny-tag>
              </div>
              <div class="resource-des">
                <li>{{ $t('Python环境变量，用于提交Python任务以及构建Python Udf') }}</li>
              </div>
            </tiny-col>
            <tiny-col :span="4">
              <div class="resource-info">
                <tiny-input v-model="config.configObject.python" :placeholder="$t('python3')"
                            :disabled="disabled"></tiny-input>
              </div>
            </tiny-col>
          </tiny-row>

          <tiny-row style="margin-top: 20px;">
            <tiny-col :span="8">
              <div class="resource-title">
                <IconEditorList style="fill:#526ecc;margin-right: 10px;"></IconEditorList>
                <tiny-tag color="blue" size="medium">{{ $t('Bigprime 访问地址') }}</tiny-tag>
              </div>
              <div class="resource-des">
                <li>{{ $t('Bigprime访问地址，默认带出当前可访问地址，用于Flink任务状态回传') }}</li>
              </div>
            </tiny-col>
            <tiny-col :span="4">
              <div class="resource-info">
                <tiny-input v-model="config.configObject.path" :placeholder="path"
                            :disabled="disabled"></tiny-input>
              </div>
            </tiny-col>
          </tiny-row>

          <tiny-row style="margin-top: 20px;">
            <tiny-col :span="8">
              <div class="resource-title">
                <IconEditorList style="fill:#526ecc;margin-right: 10px;"></IconEditorList>
                <tiny-tag color="blue" size="medium">{{ $t('历史最大保留数量') }}</tiny-tag>
              </div>
              <div class="resource-des">
                <li>{{ $t('提交的作业历史与自动注册的集群记录最大保留数量，如果不足该数量，则不会被删除，即使已经过了最大保留天数,也不会被删除, 单位(个)') }}</li>
              </div>
            </tiny-col>
            <tiny-col :span="4">
              <div class="resource-info">
                <tiny-input type="number" min="1" v-model="config.configObject.maxNumber" :placeholder="10"
                            :disabled="disabled"></tiny-input>
              </div>
            </tiny-col>
          </tiny-row>

          <tiny-row style="margin-top: 20px;">
            <tiny-col :span="8">
              <div class="resource-title">
                <IconEditorList style="fill:#526ecc;margin-right: 10px;"></IconEditorList>
                <tiny-tag color="blue" size="medium">{{ $t('历史最大保留天数') }}</tiny-tag>
              </div>
              <div class="resource-des">
                <li>{{ $t('提交的作业历史与自动注册的集群记录最大保留天数，过期会被自动删除, 单位(天)') }}</li>
              </div>
            </tiny-col>
            <tiny-col :span="4">
              <div class="resource-info">
                <tiny-input type="number" min="1" v-model="config.configObject.maxDay" :placeholder="30"
                            :disabled="disabled"></tiny-input>
              </div>
            </tiny-col>
          </tiny-row>

          <tiny-row style="margin-top: 20px;">
            <tiny-col :span="8">
              <div class="resource-title">
                <IconEditorList style="fill:#526ecc;margin-right: 10px;"></IconEditorList>
                <tiny-tag color="blue" size="medium">{{ $t('表达式变量列表') }}</tiny-tag>
              </div>
              <div class="resource-des">
                <li>{{ $t('用于扩展表达式变量,逗号分割,需要使用类的全限定名') }}</li>
                <li>{{ $t('例如: com.bigprime.common.utils.DateUtils,请确保类在服务的classpath中') }}</li>
              </div>
            </tiny-col>
            <tiny-col :span="4">
              <div class="resource-info">
                <tiny-input type="textarea" :autosize="true" v-model="config.configObject.utils" :placeholder="'cn.hutool.core.date.DateUtil,\n'+
'cn.hutool.core.util.IdUtil,\n'+
'cn.hutool.core.util.RandomUtil,\n'+
'cn.hutool.core.util.StrUtil'"
                            :disabled="disabled"></tiny-input>
              </div>
            </tiny-col>
          </tiny-row>
        </div>

        <div v-if="type === 2">
          <tiny-row>
            <tiny-col :span="8">
              <div class="resource-title">
                <IconEditorList style="fill:#526ecc;margin-right: 10px;"></IconEditorList>
                <tiny-tag color="blue" size="medium">{{ $t('使用Rest API') }}</tiny-tag>
              </div>
              <div class="resource-des">
                <li>{{ $t('当用户使用Application模式以及RestAPI时，需要配置相关参数') }}</li>
                <li>{{ $t('Application模式支持Yarn和Kubernetes，启用RestAPI后，Flink任务的savepoint,停止等操作都将会通过JobManager的RestAPI进行') }}</li>
              </div>
            </tiny-col>
            <tiny-col :span="4">
              <div class="resource-info">
                <tiny-switch v-model="config.configObject.restApi" :true-value=1 :false-value=0 :disabled="disabled"></tiny-switch>
              </div>
            </tiny-col>
          </tiny-row>

          <tiny-row style="margin-top: 20px;">
            <tiny-col :span="8">
              <div class="resource-title">
                <IconEditorList style="fill:#526ecc;margin-right: 10px;"></IconEditorList>
                <tiny-tag color="blue" size="medium">{{ $t('SQL 分隔符') }}</tiny-tag>
              </div>
              <div class="resource-des">
                <li>{{ $t('提交SQL语句时，多条执行语句的分隔符，默认为分号') }}</li>
              </div>
            </tiny-col>
            <tiny-col :span="4">
              <div class="resource-info">
                <tiny-input v-model="config.configObject.sqlSplit" :placeholder="$t(';')"
                            :disabled="disabled"></tiny-input>
              </div>
            </tiny-col>
          </tiny-row>

          <tiny-row style="margin-top: 20px;">
            <tiny-col :span="8">
              <div class="resource-title">
                <IconEditorList style="fill:#526ecc;margin-right: 10px;"></IconEditorList>
                <tiny-tag color="blue" size="medium">{{ $t('Job提交等待时间') }}</tiny-tag>
              </div>
              <div class="resource-des">
                <li>{{ $t('提交Application等任务时获取Job ID的最大等待时间，单位是秒') }}</li>
              </div>
            </tiny-col>
            <tiny-col :span="4">
              <div class="resource-info">
                <tiny-input type="number" :min="1" v-model="config.configObject.awaitTime" :placeholder="15"
                            :disabled="disabled"></tiny-input>
              </div>
            </tiny-col>
          </tiny-row>
        </div>
      </tiny-layout>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Modal, TinyRadioButton, TinyRadioGroup } from '@opentiny/vue'
import { useI18n } from 'vue-i18n'
import { iconDone, iconEdit, iconEditorList, iconSetting, iconStartCircle } from '@opentiny/vue-icon'
import { isEmpty } from 'lodash-es'
import { FlinkGlobalConfigService } from '@/services/development/global-config'
import { getDomain } from '@/utils/token'


const { t } = useI18n()
const breadcrumb = defineModel('breadcrumb')
const type = defineModel('type', { default: 1 })
const title = defineModel('title', { default: '' })
const des = defineModel('des', { default: '' })
const IconSetting = iconSetting()
const IconEditorList = iconEditorList()
const config = ref<any>({
  configObject: {} as any
})
const path = getDomain('dgp')
const disabled = ref(true)
const search = async () => {
  config.value = await FlinkGlobalConfigService.getByType(type.value)
  if(config.value.configObject == null){
    config.value.configObject = {}
  }
  disabled.value = true
}

const saveLoading = ref(false)
const save = async () => {
  saveLoading.value = true
  const result = await FlinkGlobalConfigService.save(config.value).catch(error => {
    saveLoading.value = false
  })
  saveLoading.value = false
  if (result) {
    Modal.message({
      message: t('common.prompt.save.success'),
      status: 'success'
    })
    await search()
  } else {
    Modal.message({
      message: t('common.prompt.save.fail'),
      status: 'error'
    })
  }
}

onMounted(() => {
  search()
})

</script>
<style scoped lang="less">
.container-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

}

.contain {
  flex: 1 1 auto;
  margin: 8px 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px 8px rgba(169, 174, 184, 0.05);
  padding: 10px;
  height: 99%;
}

:deep(container-breadcrumb) {
  margin: 0;
  font-size: 13px;
}

.button-css {
  display: flex;
  gap: 10px;
  margin-top: 20px;

  :deep(.tiny-button.tiny-button--success) {
    color: var(--ti-button-info-text-color);
    fill: var(--ti-button-info-text-color);
    border-color: #24DD7F;
    background-color: #24DD7F;
  }
}

.resource-title {
  margin-top: 10px;
}

.resource-des {
  margin-top: 10px;
  font-size: 12px;
  color: #2c3e50;
}

.resource-info {
  margin-top: 22px;
}
</style>
