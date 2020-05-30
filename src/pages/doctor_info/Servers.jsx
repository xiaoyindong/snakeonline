
import { useMemo, useState } from 'react';

import qs from 'query-string';

import { requestAdvicestatusPackageId, requestOrderexist, requestOrderSave } from '@services/module/order';

import route from '@route';

import Modal from '@component/Modal';

export default ({ data }) => {

    const dispatch = async ({ adviceStatus, relatedData }) => {
        if (!relatedData) {
            alert(`接口: relatedData参数缺失`);
            return;
        };
        const {
            serviceDetailId,
            skuId,
            confirmMsg = '',
            targetId,
            businessId
        } = JSON.parse(relatedData);
        if (adviceStatus === 1) { // 进入聊天页
            route.push(`./chat.html?doctorUserId=${targetId}`);
        } else if (adviceStatus === 2) { // 去下单
            const content = confirmMsg.split(/\n|\r/);
            Modal.show({
                children: <div>{content.map((d, i) => <p key={i}>{d}</p>)}</div>,
                onOk: () => {
                    requestOrderSave({ serviceDetailId }).then(content => {
                        if (!content.code) {
                            route.push(`./description.html?orderId=${content.data.orderId}`);
                        }
                    })
                }
            })
        } else if (adviceStatus === 4) { // 服务已下架
            // this.toDoctor();
        } else if (adviceStatus === 5) { // 跳转至首页
            route.push(`./home.html`);
        } else if (adviceStatus === 6) { // 购买订单
            const { code, data } = await requestOrderexist({ skuId });
            if (!code) {
                if (data.orderNo) {
                    const content = await requestAdvicestatusPackageId({ orderMainNo: data.orderNo });
                    if (!content.code && content.data) {
                        const { chatType, targetId } = content.data;
                        if (chatType === 1) {
                            route.push(`./chat.html?doctorUserId=${targetId}`);
                        }
                    }
                } else { // 去确认订单
                    const paramsString = qs.stringify({
                        applyId: '',
                        buyInfoCollections: JSON.stringify({
                            mode: '1',
                            buyInfoCollections: [
                                {
                                    shopId: '',
                                    goodsList: [
                                        {
                                            number: 1,
                                            skuId,
                                        },
                                    ],
                                },
                            ],
                        }),
                    });
                    route.push(`/new/mall/confirmOrder.html?${paramsString}`);
                }
            }
        } else if (adviceStatus === 12) { // 病情描述
            route.push(`./description.html?orderId=${businessId}`);
        }
        // 8, 群聊，10，专病服务，3，服务中间页
    }

    const servers = useMemo(() => {
        if (!data) {
            return;
        }

        return <div className="consult-box">
            <div className="consult-title b-title">
                在线咨询
                <div
                    className="title-left"
                    onClick={() => {
                        Modal.show({
                            children: <div className="tip-content">
                                <p>1、单次咨询服务提供24小时内6回合咨询服务，24小时到期或6回合结束后咨询结束；</p>
                                <p>2、包月咨询服务提供30天内不限回合数的咨询服务，30天到期后咨询结束；</p>
                                <p>3、语音和文字计算在回合内，患者医生交替发言计算为1个回合，图片发送不限次；</p>
                                <p>4、单次咨询24小时内医生未回复，系统将自动退款，若问题已解决，医患双方同意后医生可提前关闭咨询；</p>
                                <p>5、医生建议仅供参考，若病情紧急，请立即前往医院就医。</p>
                            </div>
                        })
                    }}
                >
                    <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAytJREFUSA3FV79PFFEQntldz8poCLGQgthIYqeGRE2I8YBSAYEz+A9gY6FWJJYmdraGxFhyZo8D/NHdcYaYECMFFSZUhkJpCJFYee7uc759u3vLuXu34Qj3Eu693Zn5vrfz5s0MRF0anJW3uFi5oojHRX9IjPpI0QXflumnIvoh689MamVmanQzC2Zb4mK5OqU8ek6kBjQg78m8Q0LoP+sN9Iu8N5Bvs0HPZiZHFvVz8m8qsf1+7aJbry8oRddFaZ+I502LV6bH8xvMLB/ZGEopLq3UBl1HiUfUrAh7mOmLmcs9KNy99b2h2VglEttLtVuO55VFeFYoXp62zBcTE7d/NczSV8vLn879cdw5xfRENnBgGcZk4V5+rdniP2Kf1PUqcl6/iczCzHR+tdkoy3OxVBsmcm2JizOWaYw2kx8ihnud+t8NFteZOfNmYSy/nYUkTcd+Vxtw6+66kqOxcqcG42434kY4U7gXX9qK1N7aytlL1Rt2pSK66UNjmAVgAjuuGRH70YtAkjNt517n2+4bx1Xr7gF/RWDFAZvXwAImghQcoTwixpURhH0EUihMnVldg0xIL5U+1vR9TlUmAiaw9bXUij7x2/LqVX1PeT5L9JrMj4j5g2Hww8KdYSSPlkNj8jw4kIigbOHHU2oMM+4p5nbj/uRIVXTwl3kA23HUXJD9NkNXD0mC2ENyyIK0UK4+XShVt4qL1ddZ9KGjsf2sJ1xEPrH4v0/WO80ZCQpJw/DovLjtsiSI/iR50rsAeyfg0sR+wg9zb5LVcb0DR1BcQlcfF3RbHLl84qjA1X6lCctcW9MOFIRDXL0bEcsWcCX62yWDDihx54VTODRXcMZSxCVYelHaOgFvZaux/ZotXFFUK//+6nrayvzoshAbXUpErNsVlkqkZlFPjw6fbKkx1azkiu2wNYqiGu2K+L8HRTzZ/Ohv/cYAXYlwhCgRMXoktCvoHHQRD1U6m4EFTGDH+7CIGPDokeSrD9A5oIinUSrLfGWZNGQY5uM0HbwHhiKvBExgx3UR4odGV1qfcAddafYi8m60tyE55hNv6OPk/gaO+V+YZvwTe/4HtrGRONvL3sMAAAAASUVORK5CYII="
                        alt=""
                    />
                    <span>须知</span>
                </div>
            </div>
            <div className="box-card">
                {
                    data.filter(item => ['0', '1'].includes(item.packageType)).map(item => (
                        <div className="consult-box-card" key={item.packageId}>
                            <div className="icon">
                                <img src={item.icon} alt="" />
                            </div>
                            <div className="consult-type">{item.serviceName}</div>
                            <div className="consult-type-info">
                                {item.serviceIntroduce}
                            </div>
                            <div className="price">
                                <span>
                                    {item.priceDesc ? item.priceDesc.split('/')[0] : ''}
                                </span>
                                /
                                <span>
                                    {item.priceDesc && item.priceDesc.split('/')[1]
                                        ? item.priceDesc.split('/')[1]
                                        : ''}
                                </span>
                            </div>
                            <div
                                className="consult-btn"
                                onClick={async () => {
                                    const { code, data } = await requestAdvicestatusPackageId({ packageId: item.packageId });
                                    if (!code) {
                                        dispatch(data || {});
                                    }
                                }}
                            >咨询</div>
                        </div>
                    ))
                }
            </div>
        </div>
    }, [data]);

    return [servers];
}