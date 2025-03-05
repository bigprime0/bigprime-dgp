import request from '@/utils/request'
import { isEmpty } from 'lodash-es'


/**
 * 标准类型
 */
export interface StandardTypeInfo {
  id: number,
  pid: number,
  code: string,
  name: string,
  dataType: number,
  children: StandardTypeInfo[],
  pidName: string
}

/**
 * 标准
 */
export interface Standard {
  id: number,
  code: string,
  cnName: string,
  enName: string,
  status: number,
  description: string,
  standardTypeId: number,
  standardTypeName: string,
  publishDate: Date,
  fieldType: string,
  fieldLength: number,
  fieldPrecision: number,
  isNone: number,
  codeType: string,
  codeJson: string
  codeTypeModel:CodeTypeModel
}

export interface StandardSelect {
  value: string,
  describe: string
}

export interface CodeTypeModel {
  rangeModel: { minValue: number, maxValue: number },
  listModel: { label: string, value: string }[],
  boolModel: { trueOrFalse: string }
}

/**
 * 标准类型管理
 */
export namespace StandardTypeService {
  /**
   * 列表
   */
  export const getList = async () => {
    const res = await request.post('/bigprime-dgp/standard/type/get-list')
    return res.data as StandardTypeInfo[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: StandardTypeInfo) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/standard/type', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/standard/type', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/standard/type/' + id)
    return result.data as boolean
  }
}


/**
 * 标准管理
 */
export namespace StandardService {

  /**
   * 类型
   */
  export const getTypes = async () => {
    const res = await request.get('/bigprime-dgp/standard/types')
    return res.data
  }

  /**
   * 分页列表
   */
  export const getPage = async (param: {}) => {
    const res = await request.post('/bigprime-dgp/standard/page', param)
    return { total: res.data?.total, list: res.data?.list }
  }

  /**
   * list列表
   */
  export const getList = async (param: {}) => {
    const res = await request.post('/bigprime-dgp/standard/get-list', param)
    return res.data as Standard[]
  }

  /**
   * 保存
   * @param data
   */
  export const save = async (data: Standard) => {
    if (data.id) {
      const result = await request.put('/bigprime-dgp/standard', data)
      return result.data as boolean
    } else {
      const result = await request.post('/bigprime-dgp/standard', data)
      return result.data as boolean
    }
  }


  /**
   * 删除
   * @param id
   */
  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/standard/' + id)
    return result.data as boolean
  }

  /**
   * 日志列表
   */
  export const getLogPage = async (param: {}) => {
    const res = await request.post('/bigprime-dgp/standard/log/page', param)
    return { total: res.data?.total as number, list: res.data?.list }
  }
}


export const ConvertCodeType = (row: Standard) => {
  if (isEmpty(row.codeTypeModel)) {
    row.codeTypeModel = {rangeModel: {minValue: 0, maxValue: 0 }, listModel: [], boolModel: {trueOrFalse: ''}}
  }
  switch (row.codeType) {
    case 'range':
      row.codeTypeModel.rangeModel = JSON.parse(row.codeJson)
      break
    case 'list':
      row.codeTypeModel.listModel = JSON.parse(row.codeJson)
      break
    case 'bool':
      row.codeTypeModel.boolModel = JSON.parse(row.codeJson)
      break
  }
}


