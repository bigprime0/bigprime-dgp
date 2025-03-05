import request from '@/utils/request'

export interface DataAssetsCategoryParam {
  name: string,
  pid: number,
  pidName: string,
  id: number,
  children: DataAssetsCategoryParam[]
}

/**
 * 数据资产类目管理
 */
export namespace DataAssetsCategoryService {

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/assets/category/get-list', param)
    return result.data as DataAssetsCategoryParam[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: DataAssetsCategoryParam) => {
    if (data.id > 0) {
      const result = await request.put('/bigprime-dgp/assets/category', data)
      return result.data as number
    } else {
      const result = await request.post('/bigprime-dgp/assets/category', data)
      return result.data as number
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/assets/category/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/assets/category/' + id)
    return result.data
  }
}




