<template>
  <tiny-file-upload
    :http-request="uploadFile"
    :file-list="fileList"
    :data="fileParam"
    :disabled="disabled"
    list-type="saas"
    :before-remove="removeFile"
    :before-upload="beforeAvatarUpload"
    :limit="limit"
    is-hidden
    @download-file="handleDownloadFile" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { isEmpty, reject } from 'lodash-es'
import { Modal } from '@opentiny/vue'
import { type FileStorageParam, FileStorageService } from '@/services/currency/file-storage'
import emitter from '@/utils/evnetbus'

const { t } = useI18n()
const attachmentUuid = defineModel('attachmentUuid', { default: '' })

const limit = defineModel('limit', { default: 100 })
const accept = defineModel('accept', { default: '*' })
const disabled = defineModel('disabled', { default: false })
const isDelete = defineModel('isDelete', { default: true })
const fileParam = ref({ attachmentUuid: attachmentUuid })
const fileList = ref<FileStorageParam[]>([])

defineExpose({
  attachmentUuid,
  fileList
})

watchEffect(async () => {
  if (!isEmpty(attachmentUuid)) {
    fileList.value = await FileStorageService.attachmentList(attachmentUuid.value)
  } else {
    fileList.value = []
  }
})

const attachmentList = async () => {
  fileList.value = await FileStorageService.attachmentList(attachmentUuid.value)
}

const uploadFile = (file: any) => {
  FileStorageService.uploadFile(file).then((result) => {
    if (isEmpty(attachmentUuid.value)) {
      attachmentUuid.value = result.attachmentUuid
    }
    attachmentList()
    emitter.emit('uploadFileEvent')
  })
}

const beforeAvatarUpload = (file:any) => {
  //resolve()
  // return new Promise((resolve, reject) => {
  //   alert("accept::"+accept.value);
  //   if(accept.value !== '*'){
  //     alert(file.type)
  //   }
  //   reject(new Error('取消上传'))
  // })
  // return new Promise((resolve, reject) => {
  //   const isJPG = file.type === 'image/jpeg'
  //   const isLt2M = file.size / 1024 / 1024 < 2
  //   const allow = isJPG && isLt2M
  //
  //   if (!allow) {
  //     Modal.confirm(`自定义提示：《${file.name}》文件不合规范，文件类型或大小超出限制，确定要上传吗？`).then((res) => {
  //       res === 'confirm' ? resolve() : reject(new Error('取消上传'))
  //     })
  //   } else {
  //     resolve()
  //   }
  // })
}
const removeFile = (file: any) => {
  if (!isDelete.value) {
    Modal.message({
      message: t('common.prompt.delete.no'),
      status: 'warning'
    })
    let uid = attachmentUuid.value
    attachmentUuid.value = ''
    attachmentUuid.value = uid
    return reject(new Error())
  } else {
    return new Promise((resolve: any, reject: any) => {
      Modal.confirm(t('common.prompt.delete')).then((res: string) => {
        if (res === 'confirm') {
          FileStorageService.deleteFile(file.id).then(() => {
            resolve()
            attachmentList()
            emitter.emit('removeFileEvent')
          }).catch(() => {
            reject(new Error())
          })
        } else {
          reject(new Error())
        }
      })
    })
  }
}

const handleDownloadFile = async (file: any) => {
  openBar(file)
  await FileStorageService.downloadFile(file.id, file.name)
  closeBar(file)
  emitter.emit('downloadFileEvent')
}

const openBar = (file: any) => {
  file.showDownloadBar = true
  file.downloadPercentage = 0

  const timer = setInterval(() => {
    if (file.downloadPercentage >= 90) {
      clearInterval(timer)
      return
    }
    file.downloadPercentage += 10
  }, 300)
}

const closeBar = (file: any) => {
  file.downloadPercentage = 100
  setTimeout(() => {
    file.showDownloadBar = false
  }, 1000)
}

</script>

<style scoped lang="less">
</style>
