import request from '@/utils/request'

/**
 * 数据服务API管理
 */
export namespace DataServiceApiService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/service/api/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/service/api/get-list', param)
    return result.data
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: any) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/service/api', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/service/api', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/service/api/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/service/api/' + id)
    return result.data
  }

  export const testApi = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/service/api/test-api', param)
    return result.data
  }
}




