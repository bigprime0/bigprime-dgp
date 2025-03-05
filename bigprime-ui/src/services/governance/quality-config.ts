import request from '@/utils/request'
import type { SchedulerJob } from '@/services/scheduler/scheduler-job'

export interface DataQualityConfigParam {
  ruleType: string,
  creator: number,
  updateTime: Date,
  deleted: number,
  createTime: Date,
  jobId: number,
  name: string,
  id: number,
  pidName:string,
  updater: number,
  schedulerJobParam:SchedulerJob
}

/**
 * 数据质量-配置管理
 */
export namespace DataQualityConfigService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/quality/config/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/quality/config/get-list', param)
    return result.data as DataQualityConfigParam[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: DataQualityConfigParam) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/quality/config', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/quality/config', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/quality/config/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/quality/config/' + id)
    return result.data
  }

  export const getStatistic = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/quality/config/get-statistic', param)
    return result.data as any
  }
}




