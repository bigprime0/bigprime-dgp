import request from '@/utils/request'

export interface SchedulerJobTriggersParam {
  resultJson: string,
  creator: number,
  executeDate: Date,
  updateTime: Date,
  errorMsg: string,
  deleted: number,
  begTime: Date,
  createTime: Date,
  jobId: number,
  executeStatus: number,
  endTime: Date,
  id: number,
  updater: number,
  extend01: string,
  extend02: string
}

/**
 * 调度Job日志表管理
 */
export namespace SchedulerJobTriggersService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/job/triggers/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/job/triggers/' + id)
    return result.data
  }
}




