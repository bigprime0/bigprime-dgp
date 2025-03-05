import request from '@/utils/request'

/**
 * 数据安全级别管理
 */
export namespace DataSecurityLevelService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/security/level/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/security/level/get-list', param)
    return result.data as any[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: any) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/security/level', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/security/level', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/security/level/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/security/level/' + id)
    return result.data
  }
}




