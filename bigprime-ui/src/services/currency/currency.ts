import request from '@/utils/request'
import type { SelectModel } from '@/utils/tool'

/**
 * 通用接口管理
 */
export namespace CurrencyService {
  /**
   * 根据枚举类名获取信息(用作下拉列表)
   */
  export const getEnum = async (name: string) => {
    const res = await request.get('/bigprime-dgp/currency/get-enum/' + name)
    return res.data as SelectModel[]
  }

  export const getHomeStatistic = async () => {
    const res = await request.get('/bigprime-dgp/currency/get-home-statistic')
    return res.data
  }
}


