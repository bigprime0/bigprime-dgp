import request from '@/utils/request'
import type { BaseModel } from '@/utils/tool'

export interface DataServiceApiLogParam extends BaseModel {
  errorMessage: string,
  apiId: number,
  creator: number,
  createTime: Date,
  ip: string,
  reqParameter: string,
  type: string,
  version: string,
  updater: number,
  path: string,
  updateTime: Date,
  deleted: number,
  name: string,
  errorCode: number,
  id: number,
  returnCount: number,
  status: number,
}

/**
 * 数据服务API日志管理
 */
export namespace DataServiceApiLogService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/service/api/log/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/service/api/log/get-list', param)
    return result.data as DataServiceApiLogParam[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: DataServiceApiLogParam) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/service/api/log', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/service/api/log', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/service/api/log/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/service/api/log/' + id)
    return result.data
  }
}




