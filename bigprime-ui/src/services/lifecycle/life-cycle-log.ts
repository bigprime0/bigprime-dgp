import request from '@/utils/request'

/**
* 数据生命变动日志管理
*/
export namespace DataLifeCycleLogService {
    /**
    * 分页列表
    * @param param
    */
    export const getPage = async (param: {}) => {
        const result = await request.post('/bigprime-dgp/life/cycle/log/page', param)
        return { total: result.data?.total, list: result.data?.list }
    }


    /**
    * 根据ID获取数据
    * @param id
    */
    export const getById = async (id: number) => {
        const result = await request.get('/bigprime-dgp/life/cycle/log/' + id)
        return result.data
    }
}




