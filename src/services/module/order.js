import request from '../request.js';

// 获取当前用户服务状态
export async function requestAdvicestatusPackageId(params) {
    const res = await request.get('/open-middle/dprs/order/advicestatus/packageId', {
        params,
    });
    return res;
}

// 获取订单状态
export async function requestOrderexist(params) {
    const res = await request.get('/open-middle/trademid/api/trade/orderexist', {
        params,
    });
    return res;
}

// 下咨询订单
export async function requestOrderSave(params) {
    const res = await request.get('/open-middle/dprs/order/detail/save', {
        params,
    });
    return res;
}