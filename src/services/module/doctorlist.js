import request from '../request.js';

// 获取医生列表
export async function queryByHospitalIds(params) {
    const res = await request.get('/dprs/v1/doctor/queryByHospitalIds', {
        params,
    });
    return res;
}

// 查询区域列表
export function getAreaList(params) {
    const res = request.get('/dprs/v1/area/query', {
        params,
    });
    return res;
}

// 查询区域科室
export function getDeptmentList(params) {
    const res = request.get('/dprs/v1/department/query', {
        params,
    });
    return res;
}