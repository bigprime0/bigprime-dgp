export enum ValueTypeEnum {
  text = 'text',
  array = 'array',
  textarea = 'textarea',
  number = 'number',
  date = 'date',
  boolean = 'boolean',
  list = 'list'
}

export enum CompTypeEnum {
  textInput = 'textInput',
  textarea = 'textarea',
  numberInput = 'numberInput',
  dateInput = 'dateInput',
  switch = 'switch',
  select = 'select',
  mselect = 'mselect',
  grid = 'grid',
}

export interface IntegrationConfigType {
  id: number,
  product: string,
  category: string,
  subCategory?: string,
  applicableVersion: string,
  dbType: string,
  label: string,
  realLabel: string,
  title: string,
  descr?: string,
  valueType: ValueTypeEnum,
  defaultValue: string,
  compType: CompTypeEnum,
  compConfig: string,
  compConfigJson?: any,
  seq: number,
  isRequired: number,
  isAdvanced: number,
}
