import request from '@/utils/request'


export namespace AlarmService {
    export const getDefinitionList = async (param: {}) => {
        const result = await request.post('/bigprime-das/alarm-definition/list', param)
        return result.data
    }

    export const getGroupList = async (param: {}) => {
        const result = await request.post('/bigprime-das/alarm-group/list', param)
        return result.data
    }
}




