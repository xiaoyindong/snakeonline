import { useMemo, useEffect, useState } from 'react';
import './style.less';
import { getChatStatus } from '@services/module/chat';
import urlparams from '@utils/urlparams';
import { Toast } from 'antd-mobile';

import MessageBox from './MessageBox';

import Footer from './Footer';

import RongCloud from './RongCloud';

let chatInfo = {};

let IM = null;

export default () => {

    const [reset, setReset] = useState(1);
    const [msgList, setMsgList] = useState([]);

    useEffect(async () => {
        if (!urlparams.doctorUserId) {
            Toast.fail('缺少doctorUserId');
            return;
        }
        const { code, data } = await getChatStatus({
            yishengyhbh: urlparams.doctorUserId
        });
        if (code || !data.customer.customerRegId) {
            return;
        }
        chatInfo = data;
        document.title = data.doctor.name;
        IM = new RongCloud({
            clientUserId: data.customer.customerRegId,
            receiveUserId: urlparams.doctorUserId,
        });
        IM.on('message', (list) => {
            setMsgList(list);
            document.documentElement.scrollIntoView(false);
        });
        IM.on('status', async () => {
            const { code, data } = await getChatStatus({
                yishengyhbh: urlparams.doctorUserId
            });
            if (code || !data.customer.customerRegId) {
                return;
            }
            chatInfo = data;
            setReset(Math.random());
        })
        // 初始化完成重置
        setReset(Math.random());

        document.body.addEventListener('focusin', () => {  //软键盘弹起事件
            setTimeout(() => {
                document.documentElement.scrollIntoView(false);
            }, 200);
        })
        document.body.addEventListener('focusout', () => { //软键盘关闭事件
            setTimeout(() => {
                document.documentElement.scrollIntoView(false);
            }, 200);
        })
    }, []);

    const header = useMemo(() => {
        const { statusCode, deadline } = chatInfo.order || {};
        let statusText = '咨询中';
        switch (statusCode) {
            case 2: statusText = '订单已关闭'; break;
            case 3: statusText = '咨询中'; break;
        }
        return <div className="header_status">
            <span>{statusText}</span>
            <span>{deadline}</span>
            {/* <span>将在 <span>3小时/2回合</span> 结束</span> */}
        </div>
    }, [reset]);

    const message = useMemo(() => {
        const { customer = {}, doctor = {} } = chatInfo;
        return <MessageBox
            data={msgList}
            customer={customer}
            doctor={doctor}
        />
    }, [msgList])

    const foot = useMemo(() => <Footer
        data={chatInfo}
        IM={IM}
    />, [reset]);

    return <div id="chat_page">
        {header}
        {message}
        {foot}
    </div>
}