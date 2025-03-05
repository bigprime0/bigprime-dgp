import request from '@/utils/request'
import type { IntegrationConfigType } from '@/views/sys/cfg/types/integrationType'

/**
 * 系统配置
 */
export namespace SysCfgService {

  /**
   * 保存集成配置
   * @param data
   */
  export const saveIntegration = async (data: any) => {
    const result = await request.post('/bigprime-dgp/integration/config', data)
    return result.data as boolean
  }

  /**
   * 更新集成配置
   * @param data
   */
  export const updateIntegration = async (data: any) => {
    const result = await request.put('/bigprime-dgp/integration/config', data)
    return result.data as boolean
  }

  /**
   * 分页查询配置列表
   * @param data
   */
  export const pageList = async (data: any) => {
    const result = await request.post('/bigprime-dgp/integration/config/page', data)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * 根据参数查询相关配置列表
   * @param data
   */
  export const list = async (data: any) => {
    const result = await request.post('/bigprime-dgp/integration/config/list', data)
    return result.data as [IntegrationConfigType]
  }
  /**
   * 根据值删除配置项
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/integration/config/' + id)
    return result.data as boolean
  }

  /**
   * 克隆配置
   * @param data
   */
  export const cloneIntegration = async (data: any) => {
    const result = await request.post('/bigprime-dgp/integration/config/clone', data)
    return { key: result.data?.key, value: result.data?.value }
  }

}




