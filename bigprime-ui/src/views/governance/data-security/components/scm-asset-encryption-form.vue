<template>
  <div class="ds-form">
    <tiny-form ref="dataSecurityAssetsFormRef" :model="dataSecurityAssetsFormData" :rules="dataSecurityAssetsFormRules"
               label-width="120px" overflow-title :disabled="dataSecurityAssetsFormData.status > 0">
      <tiny-divider content-position="left" content-color="#7693f5">{{ $t('common.field.divider') }}
      </tiny-divider>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('assets.asset.field.name')" prop="assetId" :show-message="false">
            <tiny-select v-model="dataSecurityAssetsFormData.asset.name" filterable clearable remote
                         @change="changeAsset"
                         @clear="changeAsset"
                         :remote-method="assetSearch">
              <tiny-option v-for="item in assetData" :key="item.code" :label="item.name"
                           :value="item.code"></tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('assets.asset.field.code')">
            <tiny-input disabled="true" v-model="dataSecurityAssetsFormData.asset.code"></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row v-if="!isEmpty(dataSecurityAssetsFormData.asset.assetJson)">
        <tiny-col :span="12">
          <tiny-form-item>
            <ActuatorDb ref="actuatorDbRef" :db-actuator-param-json="dataSecurityAssetsFormData.asset.assetJson" :is-crypto="true" />
          </tiny-form-item>

        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.level.field.sensitiveLevel')" prop="levelId" :show-message="false">
            <tiny-select v-model="dataSecurityAssetsFormData.levelId" clearable>
              <tiny-option v-for="item in levelData" :key="item.id" :label="item.sensitiveName"
                           :value="item.id"></tiny-option>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.config.field.crypto.method')" prop="cryptoId" :show-message="false">
            <tiny-select v-model="dataSecurityAssetsFormData.cryptoId" filterable clearable>
              <tiny-option-group v-for="group in securityData" :key="group.key" :label="group.key">
                <tiny-option
                  v-for="item in group.value"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></tiny-option>
              </tiny-option-group>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.asset.field.encryptionConditions')" prop="encryptionConditions"
                          :show-message="false">
            <tiny-radio v-model="dataSecurityAssetsFormData.encryptionConditions" :label=1>
              {{ $t('security.asset.field.all.encrypted') }}
            </tiny-radio>
            <tiny-radio v-model="dataSecurityAssetsFormData.encryptionConditions" :label=2>
              {{ $t('security.asset.field.conditional.encryption') }}
            </tiny-radio>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row v-if="dataSecurityAssetsFormData.encryptionConditions === 2">
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.asset.field.conditional.encryption.organization')">
            <OrgSelect v-model="dataSecurityAssetsFormData.encryptionOrganizationList" :multiple=true />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row v-if="dataSecurityAssetsFormData.encryptionConditions === 2">
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.asset.field.conditional.encryption.role')">
            <RoleSelect v-model="dataSecurityAssetsFormData.encryptionRoleList" :multiple=true />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row v-if="dataSecurityAssetsFormData.encryptionConditions === 2">
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.asset.field.conditional.encryption.user')">
            <UserSelect v-model="dataSecurityAssetsFormData.encryptionUserList" :multiple=true />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item :label="$t('security.asset.field.remark')">
            <tiny-input v-model="dataSecurityAssetsFormData.remark" type="textarea" :maxlength="255"
                        show-header-overflow="tooltip" show-overflow="tooltip"
                        show-word-limit></tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <br />
      <tiny-row style="text-align: center">
        <tiny-button plain type="primary" @click="closeDataSecurityAssetsForm(false)"> {{ $t('common.operations.cancel')
          }}
        </tiny-button>
        <tiny-button :reset-time="500" type="primary" @click="saveDataSecurityAssetsData">
          {{ $t('common.operations.save') }}
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
import { DataSecurityAssetsService } from '@/services/governance/security-asset-encryption'
import OrgSelect from '@/views/sys/org/components/org-select.vue'
import UserSelect from '@/views/sys/user/components/user-select.vue'
import RoleSelect from '@/views/sys/role/components/role-select.vue'
import { DataAssetsService } from '@/services/assets/asset'
import { find, isEmpty } from 'lodash-es'
import ActuatorDb from '@/views/components/actuator/components/actuator-db.vue'


const { t } = useI18n()
const dataSecurityAssetsFormRef = ref()
const dataSecurityAssetsFormData = defineModel('dataSecurityAssetsFormData', {
  default: {
    id: 0, status: 0,
    asset: { id: 0, code: '', name: '', assetJson: '', categoryId: 0 },
    level: { id: 0, sensitiveName: '', sensitiveLevel: '' },
    crypto: { id: 0, name: '' }
  } as any
})
const levelData = defineModel('levelData', { default: [] as any })
const securityData = defineModel('securityData', { default: [] as any })
const assetData = ref()

const actuatorDbRef = ref()

const assetSearch = async (query: any) => {
  if (!isEmpty(query)) {
    let data = await DataAssetsService.getPage({
      isStatistic: 0,
      model: {
        name: query,
        assetFormatClassification: 1,
        status: 2
      },
      page: 1,
      limit: 50
    })
    assetData.value = data.list
  } else {
    assetData.value = []
  }
}

const changeAsset = (value: any) => {
  if (!isEmpty(value)) {
    let f = find(assetData.value, { code: value })
    dataSecurityAssetsFormData.value.assetId = f.id
    dataSecurityAssetsFormData.value.asset.id = f.id
    dataSecurityAssetsFormData.value.asset.code = f.code
    dataSecurityAssetsFormData.value.asset.name = f.name
    dataSecurityAssetsFormData.value.asset.assetJson = f.assetJson
    dataSecurityAssetsFormData.value.asset.categoryId = f.categoryId
  } else {
    assetData.value = []
    dataSecurityAssetsFormData.value.asset.assetId = 0
    dataSecurityAssetsFormData.value.asset.code = ''
    dataSecurityAssetsFormData.value.asset.name = ''
    dataSecurityAssetsFormData.value.asset.assetJson = ''
    dataSecurityAssetsFormData.value.asset.categoryId = ''
  }
}

const dataSecurityAssetsFormRules = computed(() => {
  let ruleList = {
    levelId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    assetId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    encryptionConditions: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }],
    cryptoId: [{ required: true, message: t('common.prompt.required'), trigger: 'blur' }]
  }
  return ruleList
})

const saveDataSecurityAssetsData = () => {
  dataSecurityAssetsFormRef.value
    .validate()
    .then(async () => {
      dataSecurityAssetsFormData.value.asset.assetJson = actuatorDbRef.value.dataJson
      await DataSecurityAssetsService.save(dataSecurityAssetsFormData.value)
      Modal.message({
        message: t('common.prompt.save.success'),
        status: 'success'
      })
      closeDataSecurityAssetsForm(true)
    })
}

const closeDataSecurityAssetsForm = (isUp: boolean) => {
  emitter.emit('closeDataSecurityAssetsForm', isUp)
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
    height: 100vh - 80px;
    height: calc(100vh - 130px);
  }
}
</style>
