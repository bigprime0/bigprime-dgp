import request from '@/utils/request'
import { find } from 'lodash-es'


/**
 * 安全管理
 */
export namespace SecurityService {



  export const getPlugin = async () => {
    const result = await request.get('/bigprime-dgp/spi/security/get-plugin')
    return result.data
  }


  export const getBySecurityType = async (query: any) => {
    const result = await request.post('/bigprime-dgp/spi/security/get-by-security-type', query)
    return result.data
  }

  export const getSecuritySelect = async (t: any) => {
    const results = await getBySecurityType({
      status: 2
    })
    let list: any = []
    results.forEach((result: any) => {
      let f = find(list, { key: result.securityType })
      if (f) {
        f.value.push(result)
      } else {
        list.push({
          key: result.securityType,
          value: [result]
        })
      }
    })
    list.forEach(o => {
      o.key = o.key === 'Desensitize' ? t('security.type.desensitize') : t('security.type.crypto')
    })
    return list
  }

  export const save = async (data: any) => {
    const result = await request.post('/bigprime-dgp/spi/security', data)
    return result.data as boolean
  }

  export const deleteById = async (id: number) => {
    const result = await request.delete('/bigprime-dgp/spi/security/' + id)
    return result.data as boolean
  }
}
