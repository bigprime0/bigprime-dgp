import request from '@/utils/request'


/**
 * Flink任务表管理
 */
export namespace FlinkTaskService {

  export const getTreeList = async () => {
    const result = await request.get('/bigprime-dgp/flink/task/get-tree-list')
    return result.data
  }

  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/task/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/task/get-list', param)
    return result.data as any[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: any) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/flink/task', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/flink/task', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/flink/task/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/flink/task/' + id)
    return result.data
  }

  export const getFlinkDdl = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/task/get-flink-ddl', param)
    return result.data as any[]
  }

  export const execute = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/task/execute', param)
    return result.data as any[]
  }

  export const publish = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/task/publish', param)
    return result.data as boolean
  }

  export const unPublish = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/task/un-publish', param)
    return result.data as boolean
  }

  export const getStatistic = async () => {
    const result = await request.get('/bigprime-dgp/flink/task/get-statistic')
    return result.data
  }
}




