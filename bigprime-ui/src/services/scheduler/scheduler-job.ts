import request from '@/utils/request'

export interface SchedulerJob {
  cron: string,
  creator: number,
  createTime: Date,
  concurrent: number,
  schedulerId: number,
  dataJson: string,
  updater: number,
  executeClass: string,
  actuator: string,
  updateTime: Date,
  deleted: number,
  actuatorData: string,
  name: string,
  executeMethod: string,
  id: number,
  group: string,
  status: number,
  extend01: string,
  extend02: string,
  extend03: string,
  extend04: string,
  extend05: string
}

/**
 * 调度Job表管理
 */
export namespace SchedulerJobService {

  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/job/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/job/get-list', param)
    return result.data as SchedulerJob[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: SchedulerJob) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/job', data)
      return result.data > 0
    } else {
      const result = await request.post('/bigprime-dgp/job', data)
      return result.data > 0
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/job/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/job/' + id)
    return result.data
  }

  /**
   * 立即执行
   * @param id
   */
  export const executeOnceTask = async (id: number) => {
    const result = await request.get('/bigprime-dgp/job/execute-once-task/' + id)
    return result.data as boolean
  }
}




