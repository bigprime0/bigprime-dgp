import request from '@/utils/request'
import { isEmpty } from 'lodash-es'

export interface FileStorageParam {
  id: number,
  name: string,
  suffix: string,
  url: string,
  size: number,
  attachmentUuid: string,
  domainUrl:string
}

/**
 * 文件管理
 */
export namespace FileStorageService {
  export const attachmentList = async (attachmentUuid: string) => {
    const res = await request.post('/bigprime-dgp/file-storage/attachment-list', { attachmentUuid: attachmentUuid })
    return res.data as FileStorageParam[]
  }

  export const uploadFile = async (file: any) => {
    const res = await request.post('/bigprime-dgp/file-storage/upload', file,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data as FileStorageParam
  }

  export const downloadFile = async (id: any, name: any) => {
    const response = await request.post('/bigprime-dgp/file-storage/download', { id: id }, {
      responseType: 'blob'
    })
    const downloadUrl = window.URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = downloadUrl
    if (isEmpty(name)) {
      name = response.headers['content-disposition'].split(';')[1].split('=')[1]
    }
    link.setAttribute('download', name)
    link.click()
    window.URL.revokeObjectURL(downloadUrl)
    return true
  }

  export const deleteFile = async (id: any) => {
    const res = await request.delete('/bigprime-dgp/file-storage/' + id)
    return res.data as boolean
  }

  export const uploadAvatar = async (file: any) => {
    const res = await request.post('/bigprime-dgp/file-storage/upload-avatar', file,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data as FileStorageParam
  }
}


