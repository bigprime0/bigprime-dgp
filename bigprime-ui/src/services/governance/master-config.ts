import request from '@/utils/request'
import type { BaseModel } from '@/utils/tool'

export interface DataMasterConfigParam extends BaseModel {
  columnData: string,
  indexData: string,
  tableData: string,
  tableName: string,
  publishDate: Date,
  status: number,
  children: DataMasterConfigParam[],
  databaseId: number
}

/**
 * 主数据配置管理
 */
export namespace DataMasterConfigService {

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/master/config/get-list', param)
    return result.data as DataMasterConfigParam[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: DataMasterConfigParam) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/master/config', data)
      return result.data as DataMasterConfigParam
    } else {
      const result = await request.post('/bigprime-dgp/master/config', data)
      return result.data as DataMasterConfigParam
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteByData = async (data: DataMasterConfigParam) => {
    const result = await request.post('/bigprime-dgp/master/config/delete', data)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/master/config/' + id)
    return result.data
  }

  /**
   * 保存主数据
   * @param param
   */
  export const saveMaintainData = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/master/config/save-maintain', param)
    return result.data as boolean
  }
}




