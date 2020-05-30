import request from '../request.js';

// 获取首页数据
export async function getRenderRsPage(params) {
  const res = await request.get('/dprs/v1/home/get', {
    params,
  });
  return res;
}
