import request from '@/utils/request'

/**
 * Flink全局配置
 */
export namespace FlinkGlobalConfigService {

  /**
   * 保存
   * @param data
   */
  export const save = async (data: any) => {
    const result = await request.post('/bigprime-dgp/flink/global/config', data)
    return result.data as boolean
  }


  /**
   * 根据ID获取数据
   * @param id
   */
  export const getByType = async (type: number) => {
    const result = await request.get('/bigprime-dgp/flink/global/config/type/' + type)
    return result.data
  }
}




