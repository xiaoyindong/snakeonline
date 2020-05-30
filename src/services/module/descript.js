import request from '../request.js';

// 查询家庭成员列表
export async function getFamilyCustomerList(params) {
    const res = await request.get('/open-middle/dpm/patient_info/family_customer/get', {
        params,
    });
    return res;
}

// 查询订单基本信息
export async function getOrderDetail(params) {
    const res = await request.get('/open-middle/dprs/advicedisplay/basechatrecorddetail/get', {
        params,
    });
    return res;
}

// 查询医生信息
export async function getDoctorInfo(params) {
    const res = await request.get('/open-middle/dprs/api/check_in/doctorinfo', {
        params,
    });
    return res;
}

// 提交病情描述
export async function saveDescription(params) {
    const res = await request.post('/open-middle/dprs/illnessdesc/save', {
        data: params,
    });
    return res;
}
