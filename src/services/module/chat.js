import request from '../request.js';

// 查询图文咨询状态
export async function getChatStatus(params) {
    const res = await request.get('/open-middle/dprs/order/status', {
        params,
    });
    return res;
}

// 医生状态
export async function repuestConsultStatus(params) {
    const res = await request.get('/dprs/v1/order/advicestatus/doctor/get', {
        params,
    });
    return res;
}

// 医生状态
export async function getUserInfo(params) {
    const res = await request.get('/open-middle//usercenter/api/user/info', {
        params,
    });
    return res;
}

// 获取融云token
export async function getCloudToken(params) {
    const res = await request.get('/open-middle/imcenter/user/getrongcloudtoken', {
        params,
    });
    return res;
}


// 获取评价标签
export function retrieveCommentLabels(params) {
    const res = request.get('/open-middle/dprs/comment/v2/labels', {
        params,
    });
    return res;
}

// 提交评价
export function createComment(params) {
    const res = request.post('/open-middle/dprs/comment/submit', {
        data: params,
    });
    return res;
}

export function retrieveComment(params) {
    const res = request.get('/open-middle/dprs/comment/result', {
        params,
    });
    return res;
}

export function retrieveCommentDetail(params) {
    const res = request.get('/open-middle/dprs/comment/detail', {
        params,
    });
    return res;
}

// 播放语音
export function repuestAmrtomp3(data) {
    const res = request.post('/open-middle/dprs/file/amrtomp3', {
        data,
    });
    return res;
}
