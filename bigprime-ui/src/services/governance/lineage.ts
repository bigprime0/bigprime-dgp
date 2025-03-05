import request from '@/utils/request'

export namespace LineageService {
  /**
   * 解析sql脚本的血缘结构
   * @param param
   */
  export const parseScript = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/lineage/parse', param)
    return result as any
  }

  export const parseMasterData = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/lineage/parse/data-master', param)
    return result as any
  }
}
