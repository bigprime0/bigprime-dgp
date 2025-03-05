import request from '@/utils/request'

/**
* 数据生命周期任务管理
*/
export namespace DataLifeCycleTaskService {
    /**
    * 分页列表
    * @param param
    */
    export const getPage = async (param: {}) => {
        const result = await request.post('/bigprime-dgp/life/cycle/task/page', param)
        return { total: result.data?.total, list: result.data?.list }
    }

    /**
    * list列表
    * @param param
    */
    export const getList = async (param: {}) => {
        const result = await request.post('/bigprime-dgp/life/cycle/task/get-list', param)
        return result.data as any[]
    }

    /**
    * 保存
    * @param data
    */
    export const save = async (data: any) => {
        if (data.id) {
            const result = await request.put('/bigprime-dgp/life/cycle/task', data)
            return result.data as boolean
        } else {
            const result = await request.post('/bigprime-dgp/life/cycle/task', data)
            return result.data as boolean
        }
    }


    /**
    * 删除
    * @param id
    */
    export const deleteById = async (id: number) => {
        const result = await request.delete('/bigprime-dgp/life/cycle/task/' + id)
        return result.data as boolean
    }

    /**
    * 根据ID获取数据
    * @param id
    */
    export const getById = async (id: number) => {
        const result = await request.get('/bigprime-dgp/life/cycle/task/' + id)
        return result.data
    }

    export const getStatistic = async (param: {}) => {
        const result = await request.post('/bigprime-dgp/life/cycle/task/get-statistic', param)
        return result.data
    }
}




