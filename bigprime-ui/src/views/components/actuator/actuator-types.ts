import type { JdbcParam } from '@/store/modules/data-source'



export interface DbActuatorParam {
  dataBaseId: number,
  jdbcParam: JdbcParam,
  cryptoId: number,
  tableParameters: Array<{
    tableName: string
    columns: string[]
    cryptoColumns:string[]
  }>
}

export interface ApiActuatorParam {
  url: string,
  requestMethod: string
}

export interface FileActuatorParam {
  attachmentUuid: string
}

export interface SqlActuatorParam {
  dataBaseType:number,
  dataBaseId: number,
  jdbcParam: JdbcParam,
  sql: string
}





