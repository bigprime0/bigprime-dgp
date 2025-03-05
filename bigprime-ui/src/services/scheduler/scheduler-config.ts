import request from '@/utils/request'

export interface SchedulerParam {
  creator: number,
  updateTime: Date,
  deleted: number,
  createTime: Date,
  name: string,
  id: number,
  type: number,
  url: string,
  token: string,
  status: number,
  updater: number,
}

/**
 * 调度器表管理
 */
export namespace SchedulerService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/scheduler/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/scheduler/get-list', param)
    return result.data as SchedulerParam[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: SchedulerParam) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/scheduler', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/scheduler', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/scheduler/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/scheduler/' + id)
    return result.data
  }
}




