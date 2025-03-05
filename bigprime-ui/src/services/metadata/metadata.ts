import request from '@/utils/request'

export interface metadataPropertyModel {
  code: string
  name: string
  value: string
}

export interface metadataModel {
  id: string
  version: string
  name: string
  category: string
  categoryName: string
  description: string
  sourceId: number
  sourceName: string
  sourceType: string
  sourceProps: metadataPropertyModel[]
  tags: string
}

export interface metadataTreeModel {
  id: number
  type: string
  name: string
  children?: any[]
  data?: metadataModel
  elements: dataElementModel[]
  properties: metadataPropertyModel[]
  isLeaf: boolean
  treeLevel: string
}

export interface dataElementModel {
  id: string
  metadataId: string
  ownerCode: string
  ownerName: string
  eleCode: string
  eleName: string
  eleEName: string
  eleDataType: string
  eleValue: string
  eleRealValue?: {}
  eleCols?: any[]
}

export interface metadataAnalyseModel {
  key: string
  name: string
  type: string
  value: {} | number
}

export interface metadataUpdateLogMdel {
  metadataId: string
  categoryName: string
  sourceName: string
  ownerCode: string
  ownerName: string
  eleId: string
  eleCode: string
  eleName: string
  oldEleValue: string
  newEleValue: string
  editorName: string
  lastUpdated: Date
}

export namespace MetadataService {
  /**
   * 元数据采集
   * @param param
   */
  export const collect = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/metadata/collect', param)
    return result.data as number
  }

  /**
   * 获取元数据树结构
   */
  export const getTree = async () => {
    const result = await request.get('/bigprime-dgp/metadata/tree')
    return result.data as metadataTreeModel[]
  }

  /**
   * 获取某个元数据下的数据元集合
   * @param metadataId
   */
  export const getDataElements = async (metadataId: String) => {
    const result = await request.get('/bigprime-dgp/metadata/' + metadataId)
    return result.data as dataElementModel[]
  }

  export const getMetadataAnalyse = async () => {
    const result = await request.get('/bigprime-dgp/metadata/analyse')
    return result.data as metadataAnalyseModel[]
  }

  export const getMetadataPage = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/metadata/page', param)
    return result.data as metadataModel[]
  }

  export const updateDataElements = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/metadata/elem/update', param)
    return result.data
  }

  export const getUpdateLogs = async (param: {}) => {
    const result = await request.post('/bigprime-dgp/metadata/log/page', param)
    return result.data
  }
}
