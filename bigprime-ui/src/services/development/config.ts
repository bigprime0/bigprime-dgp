import request from '@/utils/request'

/**
 * Flink集群配置管理
 */
export namespace FlinkConfigService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/config/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/flink/config/get-list', param)
    return result.data as any[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: any) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/flink/config', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/flink/config', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/flink/config/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/flink/config/' + id)
    return result.data
  }

  export const getPlugin = async () => {
    const result = await request.get('/bigprime-dgp/flink/config/get-plugin')
    return result.data
  }

  export const testConnection = async (data: any) => {
    const result = await request.post('/bigprime-dgp/flink/config/test-connection', data)
    return result.data as boolean
  }
}




