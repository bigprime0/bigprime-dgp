import request from '@/utils/request'

export interface DataQualityRuleParam {
  executeClass: string,
  actuator: string,
  ruleType: number,
  name: string,
  pid: number,
  id: number,
  children: DataQualityRuleParam[]
}

/**
 * 数据质量-规则管理
 */
export namespace DataQualityRuleService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/quality/rule/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/quality/rule/get-list', param)
    return result.data as DataQualityRuleParam[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: DataQualityRuleParam) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/quality/rule', data)
      return result.data as number
    } else {
      const result = await request.post('/bigprime-dgp/quality/rule', data)
      return result.data as number
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/quality/rule/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/quality/rule/' + id)
    return result.data
  }
}




