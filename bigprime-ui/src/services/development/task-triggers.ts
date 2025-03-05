import request from '@/utils/request'

/**
 * Flink任务实例表管理
 */
export namespace FlinkTaskTriggersService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/task/triggers/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/task/triggers/get-list', param)
    return result.data as any[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: any) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/flink/task/triggers', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/flink/task/triggers', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/flink/task/triggers/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/flink/task/triggers/' + id)
    return result.data
  }
}




