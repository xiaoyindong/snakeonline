
import dayJs from 'dayjs';

import qs from 'qs';

import ossprocess from '@utils/ossprocess';

import EvaluateModal from '@component/EvaluateModal';

import { retrieveComment } from '@services/module/chat';

import viewer from 'react-mobile-image-viewer/lib/index.js';
import 'react-mobile-image-viewer/lib/index.css';

import route from '@route';

import urlparams from '@utils/urlparams';

import AudioPlay from './AudioPlay';

import Xss from 'xss';

const domain = `//${urlparams.domain || location.host}`;

export default ({ data, customer, doctor }) => {
    const { customerRegId } = customer;

    const renderTime = (item, pre) => {
        if (!pre) {
            return <div className="message_send_time">{dayJs(item.sentTime).format('YYYY-MM-DD HH:mm')}</div>;
        } else if (item.sentTime - pre.sentTime > 10 * 60 * 1000) {
            return <div className="message_send_time">{dayJs(item.sentTime).format('YYYY-MM-DD HH:mm')}</div>;
        } else {
            return null;
        }
    }

    const showN = str => {
        if (str) {
            const options = {
                whiteList: {
                    span: ['style', 'class', 'name'],
                },
            };
            str = Xss(str, options);
            str = str.replace(/\n/g, '<br/>');
            str = str.trim();
            // 空格中文非链接组成部分
            str = str.replace(/^(http(s)?\:)?\/\/[^\s\u4e00-\u9fa5]+/g, word => {
                return '<a href="' + word + '">' + word + '</a>';
            });
        }
        return str;
    };

    const renderMessage = (item = {}) => {
        const { content = {}, senderUserId } = item;
        const { messageName, message = {}, imageUri } = content;
        // 是否患者端
        const isPatient = customerRegId === senderUserId;
        if (messageName === 'InformationNotificationMessage') {
            return <div className="message_sys_info">{message}</div>
        } else if (messageName === 'TextMessage' && content.content) { // 语音消息，并且存在
            return <div className="message_item clearfix">
                <img
                    className={`user_photo ${isPatient ? 'user_photo_right' : 'left'}`}
                    src={
                        ossprocess.optimizationImg(
                            isPatient ? (customer.avatar || '//cdn.myweimai.com/images/dac86f05109a35952f5046c11bc4d788_320x320.png') : (doctor.avatar || '//cdn.myweimai.com/images/3a8bc408a393ebc85586a72a2ed3e247_80x80.png'),
                            { resize: `w_${36}` }
                        )
                    }
                    onClick={() => {
                        if (!isPatient) {
                            route.push(`${domain}/open-consult/doctor_info.html?employeeId=${doctor.employeeId}`);
                        }
                    }}
                />
                <div className={`message_content ${isPatient ? 'fr message_content_right' : 'fl'}`} dangerouslySetInnerHTML={{ __html: showN(content.content || '暂无内容') }} />
            </div>
        } else if (messageName === 'ImageMessage') {
            return <div className="message_item clearfix">
                <img
                    className={`user_photo ${isPatient ? 'user_photo_right' : 'left'}`}
                    src={
                        ossprocess.optimizationImg(
                            isPatient ? (customer.avatar || '//cdn.myweimai.com/images/dac86f05109a35952f5046c11bc4d788_320x320.png') : (doctor.avatar || '//cdn.myweimai.com/images/3a8bc408a393ebc85586a72a2ed3e247_80x80.png'),
                            { resize: `w_${36}` }
                        )
                    }
                    onClick={() => {
                        if (!isPatient) {
                            route.push(`${domain}/open-consult/doctor_info.html?employeeId=${doctor.employeeId}`);
                        }
                    }}
                />
                <div className={`message_content clearfix ${isPatient ? 'fr message_content_right' : 'fl'}`}>
                    <img
                        className="image_message_item fl"
                        onClick={() => {
                            viewer({
                                urls: [imageUri],
                                strict: true,
                                debug: false,
                            });
                        }}
                        src={
                            imageUri ? ossprocess.optimizationImg(
                                imageUri,
                                { resize: `w_${80}` }
                            ) : content.content}
                    />
                </div>
            </div>
        } else if (messageName === 'VoiceMessage') { // 语音消息
            return <div className="message_item clearfix">
                <img
                    className={`user_photo ${isPatient ? 'user_photo_right' : 'left'}`}
                    src={
                        ossprocess.optimizationImg(
                            isPatient ? (customer.avatar || '//cdn.myweimai.com/images/dac86f05109a35952f5046c11bc4d788_320x320.png') : (doctor.avatar || '//cdn.myweimai.com/images/3a8bc408a393ebc85586a72a2ed3e247_80x80.png'),
                            { resize: `w_${36}` }
                        )
                    }
                    onClick={() => {
                        if (!isPatient) {
                            route.push(`${domain}/open-consult/doctor_info.html?employeeId=${doctor.employeeId}`);
                        }
                    }}
                />
                <div className={`message_content message_voice_content ${isPatient ? 'fr message_content_right' : 'fl'}`}>
                    <AudioPlay data={content} />
                </div>
            </div>
        } else if (messageName === 'UnknownMessage') {
            const { objectName, content = {} } = message;
            if (objectName === 'RCD:WMEvaluationMsg') { // 评价卡片
                const { buttonName, detail, imageName, titleName } = content;
                return <div className="message_item clearfix">
                    <img
                        className={`user_photo ${isPatient ? 'user_photo_right' : 'left'}`}
                        src={
                            ossprocess.optimizationImg(
                                isPatient ? (customer.avatar || '//cdn.myweimai.com/images/dac86f05109a35952f5046c11bc4d788_320x320.png') : (doctor.avatar || '//cdn.myweimai.com/images/3a8bc408a393ebc85586a72a2ed3e247_80x80.png'),
                                { resize: `w_${36}` }
                            )
                        }
                        onClick={() => {
                            if (!isPatient) {
                                route.push(`${domain}/open-consult/doctor_info.html?employeeId=${doctor.employeeId}`);
                            }
                        }}
                    />
                    <div
                        onClick={async () => {
                            const { code, data } = await retrieveComment({
                                orderId: content.orderNumber,
                            });
                            if (!code) {
                                EvaluateModal.show({
                                    hasComment: !!data.hasComment,
                                    orderId: content.orderNumber,
                                })
                            }
                        }}
                        className={`evaluation_card clearfix ${isPatient ? 'fr' : 'fl'}`}
                    >
                        <div className="card_header">
                            <span>{titleName}</span><span>{buttonName}</span>
                        </div>
                        <div className="card_body">
                            <img src={
                                ossprocess.optimizationImg(
                                    imageName,
                                    { resize: `w_${50}` }
                                )
                            } />
                            <span>{detail}</span>
                        </div>
                    </div>
                </div >
            } else if (objectName === 'RCD:WMQuikCardMsg') { // 全屏卡片
                const { patient = {}, illnessDesc, imageList = [] } = content;
                return <div className="message_item">
                    <div className="message_patient_card">
                        <div className="header_card">
                            <img src={
                                ossprocess.optimizationImg(
                                    patient.avatar || '//cdn.myweimai.com/images/2b24a4027156dfbb261acfbe77eae7a7_180x180.png',
                                    { resize: `w_${28}` }
                                )} />
                            <span>{patient.patientName}</span>
                            <span>{patient.gender} {patient.age}</span>
                        </div>
                        <p>病情描述：</p>
                        <div>{illnessDesc}</div>
                        {
                            imageList.length ? <p>病情资料：</p> : null
                        }
                        <div className="images_list clearfix">
                            {
                                imageList.map((img, i) => <img
                                    key={i}
                                    className="image_item fl"
                                    onClick={() => {
                                        viewer({
                                            urls: imageList,
                                            strict: true,
                                            debug: false,
                                        });
                                    }}
                                    src={ossprocess.optimizationImg(
                                        img,
                                        { resize: `w_${75}` }
                                    )}
                                />)
                            }
                        </div>
                    </div>
                </div>;
            } else if (objectName === 'RCD:WMVoiceMsg') { // 群发语音
                const { url = '' } = content;
                const { duration = 0 } = qs.parse(url.split('?')[1]);
                return <div className="message_item clearfix">
                    <img
                        className={`user_photo ${isPatient ? 'user_photo_right' : 'left'}`}
                        src={
                            ossprocess.optimizationImg(
                                isPatient ? (customer.avatar || '//cdn.myweimai.com/images/dac86f05109a35952f5046c11bc4d788_320x320.png') : (doctor.avatar || '//cdn.myweimai.com/images/3a8bc408a393ebc85586a72a2ed3e247_80x80.png'),
                                { resize: `w_${36}` }
                            )
                        }
                        onClick={() => {
                            if (!isPatient) {
                                route.push(`${domain}/open-consult/doctor_info.html?employeeId=${doctor.employeeId}`);
                            }
                        }}
                    />
                    <div className={`message_content message_voice_content ${isPatient ? 'fr message_content_right' : 'fl'}`}>
                        <AudioPlay data={{
                            aac: true,
                            url,
                            duration,
                        }} />
                    </div>
                </div>
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    return <div className="message_list">
        {
            data.map((item, idx) => {
                return <div>
                    {
                        renderTime(item, data[idx - 1])
                    }
                    {
                        renderMessage(item)
                    }
                </div>
            })
        }
    </div>
}