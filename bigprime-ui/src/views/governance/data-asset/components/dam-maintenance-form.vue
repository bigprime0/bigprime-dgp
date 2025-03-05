<template>
  <div class="ds-form">
    <tiny-form ref="dataAssetsFormRef" :model="dataAssetsFormData" :rules="dataAssetsFormRules" label-width="100px"
               overflow-title
               :disabled="formDisabled && !dbDisabled">

      <tiny-row :hidden="formHidden">
        <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
        </tiny-divider>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.categoryId')">
            <span class="span-font">{{ dataAssetsFormData.categoryName }}</span>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.code')" :show-message="false" prop="code">
            <tiny-input v-model="dataAssetsFormData.code"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.name')" :show-message="false" prop="name">
            <tiny-input v-model="dataAssetsFormData.name"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="12">
          <tiny-form-item :label="$t('assets.asset.field.remark')">
            <tiny-input v-model="dataAssetsFormData.remark" type="textarea" :maxlength="300"
                        show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row :hidden="formHidden">
        <tiny-divider content-position="left" content-color="#7693f5">{{ $t('assets.asset.system.divider') }}
        </tiny-divider>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.assetFormatClassification')" :show-message="false" prop="assetFormatClassification">
            <tiny-radio v-model="dataAssetsFormData.assetFormatClassification" :label=1>
              {{ $t('assets.asset.field.assetFormatClassification.database') }}
            </tiny-radio>
            <tiny-radio v-model="dataAssetsFormData.assetFormatClassification" :label=2>
              {{ $t('assets.asset.field.assetFormatClassification.video') }}
            </tiny-radio>
            <tiny-radio v-model="dataAssetsFormData.assetFormatClassification" :label=3>
              {{ $t('assets.asset.field.assetFormatClassification.file') }}
            </tiny-radio>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.updateFrequency')">
            <tiny-select v-model="dataAssetsFormData.updateFrequency">
              <tiny-option :key=1 :label="$t('assets.asset.field.updateFrequency.everyDay')" :value=1 />
              <tiny-option :key=2 :label="$t('assets.asset.field.updateFrequency.everyWeek')" :value=2 />
              <tiny-option :key=3 :label="$t('assets.asset.field.updateFrequency.everyMonth')" :value=3 />
              <tiny-option :key=4 :label="$t('assets.asset.field.updateFrequency.everyYear')" :value=4 />
              <tiny-option :key=5 :label="$t('assets.asset.field.updateFrequency.anyTime')" :value=5 />
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.sourceSystem')">
            <tiny-input v-model="dataAssetsFormData.sourceSystem"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.publishDate')">
            <tiny-input v-model="dataAssetsFormData.publishDate" disabled="true"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row v-if="dataAssetsFormData.assetFormatClassification === 1" :hidden="!formHidden || formType !== 'source'">
        <tiny-col :span="12">
          <ActuatorDb ref="actuatorDbRef" :db-actuator-param-json="dataAssetsFormData.assetJson" :show-data="true" :disabled="formDisabled"/>
        </tiny-col>
      </tiny-row>
      <tiny-row :hidden="!formHidden || formType !== 'source'"
                v-if="dataAssetsFormData.assetFormatClassification === 2 || dataAssetsFormData.assetFormatClassification === 3">
        <tiny-col :span="12">
          <Attachment ref="attachmentRef" :attachment-uuid="dataAssetsFormData.assetJson"
                      :accept="dataAssetsFormData.assetFormatClassification === 2 ? 'video/*' : '*'"
                      :is-delete="!formDisabled"
                      :disabled="formDisabled" />
        </tiny-col>
      </tiny-row>


      <tiny-row :hidden="formHidden">
        <tiny-divider content-position="left" content-color="#7693f5">{{ $t('assets.asset.provide.divider') }}
        </tiny-divider>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.provideOrganizationId')" :show-message="false" prop="provideOrganizationId">
            <OrgSelect v-model="dataAssetsFormData.provideOrganizationId" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.belongingOrganizationId')" :show-message="false" prop="belongingOrganizationId">
            <OrgSelect v-model="dataAssetsFormData.belongingOrganizationId" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.belongingOrganizationLeader')">
            <tiny-input v-model="dataAssetsFormData.belongingOrganizationLeader"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.belongingOrganizationContactInfo')">
            <tiny-input v-model="dataAssetsFormData.belongingOrganizationContactInfo"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>


      <tiny-row :hidden="formDisabled || formHidden">
        <tiny-divider content-position="left" content-color="#7693f5">{{ $t('assets.asset.purview.divider') }}
        </tiny-divider>
      </tiny-row>
      <tiny-row :hidden="formDisabled || formType !== 'purview'">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.purviewType')">
            <tiny-radio v-model="dataAssetsFormData.purviewType" :label=1>
              {{ $t('assets.asset.field.purviewType.open') }}
            </tiny-radio>
            <tiny-radio v-model="dataAssetsFormData.purviewType" :label=2>
              {{ $t('assets.asset.field.purviewType.condition') }}
            </tiny-radio>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row v-if="dataAssetsFormData.purviewType === 2" :hidden="formDisabled || formType !== 'purview'">
        <tiny-col :span="12">
          <tiny-form-item :label="$t('assets.asset.field.purviewType.organization')">
            <OrgSelect v-model="dataAssetsFormData.purviewOrganizationList" :multiple=true />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row v-if="dataAssetsFormData.purviewType === 2" :hidden="formDisabled || formType !== 'purview'">
        <tiny-col :span="12">
          <tiny-form-item :label="$t('assets.asset.field.purviewType.role')">
            <RoleSelect v-model="dataAssetsFormData.purviewRoleList" :multiple=true />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row v-if="dataAssetsFormData.purviewType === 2" :hidden="formDisabled || formType !== 'purview'">
        <tiny-col :span="12">
          <tiny-form-item :label="$t('assets.asset.field.purviewType.user')">
            <UserSelect v-model="dataAssetsFormData.purviewUserList" :multiple=true />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>


      <tiny-row :hidden="formHidden">
        <tiny-divider content-position="left" content-color="#7693f5">{{ $t('assets.asset.business.divider') }}
        </tiny-divider>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.manageObjectClassification')">
            <tiny-input v-model="dataAssetsFormData.manageObjectClassification"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.industryClassification')">
            <tiny-input v-model="dataAssetsFormData.industryClassification"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.informationCategoriesClassification')">
            <tiny-input v-model="dataAssetsFormData.informationCategoriesClassification"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.businessClassification')">
            <tiny-input v-model="dataAssetsFormData.businessClassification"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="6">
          <tiny-form-item :label="$t('assets.asset.field.topicClassification')">
            <tiny-input v-model="dataAssetsFormData.topicClassification"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :hidden="formHidden">
        <tiny-col :span="12">
          <tiny-form-item :label="$t('assets.asset.field.tag.info')">
            <DamMaintenanceTag :tags="dataAssetsFormData.tagNameList" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <br />
      <tiny-row style="text-align: center" :hidden="formDisabled">
        <tiny-button plain type="primary" @click="closeDataAssetsForm(false)"> {{ $t('common.operations.cancel') }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveDataAssetsData"> {{ $t('common.operations.save') }}
        </tiny-button>
      </tiny-row>
    </tiny-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import emitter from '@/utils/evnetbus'
import { useI18n } from 'vue-i18n'
import { Modal } from '@opentiny/vue'
import { type DataAssetsParam, DataAssetsService } from '@/services/assets/asset'
import OrgSelect from '@/views/sys/org/components/org-select.vue'
import RoleSelect from '@/views/sys/role/components/role-select.vue'
import UserSelect from '@/views/sys/user/components/user-select.vue'
import DamMaintenanceTag from '@/views/governance/data-asset/components/dam-maintenance-tag.vue'
import ActuatorDb from '@/views/components/actuator/components/actuator-db.vue'
import Attachment from '@/views/components/attachment/attachment.vue'


const { t } = useI18n()
const dataAssetsFormRef = ref()
const dataAssetsFormData = defineModel<DataAssetsParam>('dataAssetsFormData', { default: {} })
const formDisabled = defineModel('formDisabled', { default: false })
const dbDisabled = defineModel('dbDisabled', { default: false })
const formHidden = defineModel('formHidden', { default: false })
const formType = defineModel('formType', { default: '' })

const dataAssetsFormRules = computed(() => {
  let ruleList = {
    code: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    name: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    assetFormatClassification: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    provideOrganizationId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    belongingOrganizationId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const actuatorDbRef = ref()
const attachmentRef = ref()
const saveDataAssetsData = () => {
  dataAssetsFormRef.value
    .validate()
    .then(async () => {
      if (dataAssetsFormData.value.assetFormatClassification === 1) {
        dataAssetsFormData.value.assetJson = actuatorDbRef.value.dataJson
      }else{
        dataAssetsFormData.value.assetJson = attachmentRef.value.attachmentUuid
      }
      await DataAssetsService.save(dataAssetsFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataAssetsForm(true)
    })
}

const closeDataAssetsForm = (isUp: boolean) => {
  emitter.emit('closeDataAssetsForm', isUp)
}

const uploadFileEvent = () => {
  DataAssetsService.saveStatistic({
    orgId: dataAssetsFormData.value.belongingOrganizationId,
    provideCount: 1
  })
}
emitter.on('uploadFileEvent', uploadFileEvent)

const removeFileEvent = () => {
  DataAssetsService.saveStatistic({
    orgId: dataAssetsFormData.value.belongingOrganizationId,
    provideCount: -1
  })
}
emitter.on('removeFileEvent', removeFileEvent)

const downloadFileEvent = () => {
  DataAssetsService.saveStatistic({
    orgId: dataAssetsFormData.value.belongingOrganizationId,
    useCount: 1
  })
}
emitter.on('downloadFileEvent', downloadFileEvent)

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
</style>
