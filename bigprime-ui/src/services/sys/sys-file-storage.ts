import request from '@/utils/request'

export interface SysFileStorageConfigParam {
  storageType: string,
  creator: number,
  updateTime: Date,
  deleted: number,
  createTime: Date,
  id: number,
  isDefaultStorage: number,
  configJson: string,
  config: ConfigParam,
  updater: number,
}

export interface ConfigParam {
  domainName: string,
  accessKey: string,
  secretKey: string,
  bucket: string
}

/**
 * 文件存储配置管理
 */
export namespace SysFileStorageConfigService {

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/file/storage/config/get-list', param)
    return result.data as SysFileStorageConfigParam[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: any) => {
    const result = await request.put('/bigprime-dgp/file/storage/config', data)
    return result.data as boolean
  }
}




