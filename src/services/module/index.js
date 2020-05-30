// import qs from 'qs';
import request from '../request.js';


// 查询家庭成员列表
export async function getFamilyCustomerList(params) {
    const res = await request.get('url', {
        params,
    });
    return res;
}