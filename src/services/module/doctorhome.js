import request from '../request.js';

// 获取医生详情
export async function getDoctorDetail(params) {
    const res = await request.get('/open-middle/dprs/doctor/detail', {
        params,
    });
    return res;
}

// 获取医生服务
export async function getDoctorServices(params) {
    const res = await request.get('/open-middle/dprs/doctor_service/advicelist', {
        params,
    });
    return res;
}

// 获取整体评价

export async function getDoctorStars(params) {
    const res = await request.get('/open-middle/dprs/comment/label_stat', {
        params,
    });
    return res;
}

// 获取评价列表
export async function getDoctoCommentList(params) {
    const res = await request.get('/open-middle/dprs/comment/v2/list', {
        params,
    });
    return res;
}







