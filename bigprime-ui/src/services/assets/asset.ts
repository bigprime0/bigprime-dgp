import request from '@/utils/request'
import type { BaseModel } from '@/utils/tool'

export interface DataAssetsParam extends BaseModel {
  code: string,
  remark: string,
  belongingOrganizationLeader: string,
  businessClassification: string,
  provideOrganizationId: number,
  industryClassification: string,
  categoryId: number,
  categoryName: string,
  manageObjectClassification: string,
  assetFormatClassification: number,
  purviewType: number,
  isPurview: boolean,
  purviewOrganization: string,
  purviewOrganizationList: number[],
  purviewRole: string,
  purviewRoleList: number[],
  purviewUser: string,
  purviewUserList: number[],
  informationCategoriesClassification: string,
  updateFrequency: number,
  belongingOrganizationId: number,
  belongingOrganizationContactInfo: string,
  sourceSystem: string,
  topicClassification: string,
  name: string,
  assetJson: string,
  publishDate: string,
  status: number,
  tagName: string,
  tagNameList: string[],
}

export interface DataAssetsStatisticParam {
  dataSourceUnit: number,
  dataAssetCategories: number,
  subclassOfDataAssets: number,
  dataItem: number,
  numberOfRecords: number,
  trendsInDataAssetChanges: any[],
  distributionOfDataAssetContributions: any[],
  distributionOfDataAssetUsage: any[]
}

/**
 * 数据资产信息管理
 */
export namespace DataAssetsService {
  /**
   * 分页列表
   * @param param
   */
  export const getPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/assets/page', param)
    return { total: result.data?.total, list: result.data?.list }
  }

  /**
   * list列表
   * @param param
   */
  export const getList = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/assets/get-list', param)
    return result.data as DataAssetsParam[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: DataAssetsParam) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/assets', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/assets', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/assets/' + id)
    return result.data as boolean
  }

  /**
   * 根据ID获取数据
   * @param id
   */
  export const getById = async (id: number) => {
    const result = await request.get('/bigprime-dgp/assets/' + id)
    return result.data
  }

  export const saveStatistic = async (data: any) => {
    const result = await request.post('/bigprime-dgp/assets/save-statistic', data)
    return result.data as boolean
  }

  export const getStatistic = async (year: number) => {
    const result = await request.get('/bigprime-dgp/assets/get-statistic/' + year)
    return result.data as DataAssetsStatisticParam
  }
}




