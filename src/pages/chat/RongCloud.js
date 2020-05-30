
import { getCloudToken } from '@services/module/chat';
import { Toast } from 'antd-mobile';

class RouCloud {
    constructor({ receiveUserId, clientUserId } = {}) {
        this.onEvents = {
            message: [],
            status: [],
        };
        this.rongCloudAppId = location.hostname.match(/(dev|integration|stable|localhost)/) ? 'qd46yzrf474qf' : 'kj7swf8o7t7k2';
        this.RongIMClient = RongIMLib.RongIMClient;
        this.targetId = receiveUserId;
        this.senderUserId = clientUserId;
        this.messageList = [];
        this.init();
    }
    messageEventListener() { }
    async init() {
        const { code, data } = await getCloudToken({});
        if (code) {
            return;
        }
        this.rongCloudToken = data.rongCloudToken;
        RongIMClient.init(this.rongCloudAppId);
        RongIMLib.RongIMEmoji.init();
        const messageName = 'WMRCInquiryMessage'; // 消息名称。
        const objectName = 'RCD:WMInquiryMsg'; // 消息内置名称，请按照此格式命名。
        const messageTag = new RongIMLib.MessageTag(true, true); // 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
        const propertys = ['inquiryTextMsg', 'inquiryPictureArr']; // 消息类中的属性名。
        this.RongIMClient.registerMessageType(messageName, objectName, messageTag, propertys);
        this.connect();
    }
    connect() {
        Toast.loading('连接中', 0);
        RongIMClient.setConnectionStatusListener({
            onChanged: (status) => {
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功');
                        this.RongCloudInstance = RongIMClient.getInstance();
                        break;
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        info = '断开连接';
                        // this.ready = false;
                        break;
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        info = '其他设备登录';
                        // this.ready = false;
                        break;
                    case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                        info = '域名不正确';
                        // this.ready = false;
                        break;
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用');
                        this.reconnect();
                        // this.ready = false;
                        break;
                    default:
                        console.log('链接状态为', status);
                        this.reconnect();
                    // location.reload();
                }
            }
        });
        // 接收消息监听器
        this.RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: message => {
                console.log('Listener Message -- 接收到消息XXXX');
                if (this.targetId == message.targetId) {
                    switch (message.messageType) {
                        case RongIMClient.MessageType.TextMessage:
                            message.content.content = RongIMLib.RongIMEmoji.emojiToHTML(message.content.content);
                            this.addMessage(message);
                            break;
                        case RongIMClient.MessageType.VoiceMessage:
                            //const voiceBase64Str = message.content.content;
                            //const duration = voiceBase64Str.length / 1024;
                            message.redPoint = true;
                            // RongIMLib.RongIMVoice.preLoaded(voiceBase64Str);
                            // setTimeout(function(){
                            //   RongIMLib.RongIMVoice.play(voiceBase64Str,duration);
                            // },1000)
                            // _self.playVoice(voiceBase64Str,duration)
                            // 对声音进行预加载
                            // message.content.content 格式为 AMR 格式的 base64 码
                            this.addMessage(message);

                            break;
                        case RongIMClient.MessageType.ImageMessage:
                            this.addMessage(message);

                            break;
                        case RongIMClient.MessageType.DiscussionNotificationMessage:
                            // message.content.extension => 讨论组中的人员。
                            break;
                        case RongIMClient.MessageType.LocationMessage:
                            // message.content.latiude => 纬度。
                            // message.content.longitude => 经度。
                            // message.content.content => 位置图片 base64。
                            break;
                        case RongIMClient.MessageType.RichContentMessage:
                            // message.content.content => 文本消息内容。
                            // message.content.imageUri => 图片 base64。
                            // message.content.url => 原图 URL。
                            message.content.content = RongIMLib.RongIMEmoji.emojiToHTML(message.content.content);
                            this.addMessage(message);

                            break;
                        case RongIMClient.MessageType.InformationNotificationMessage:
                            this.addMessage(message);
                            // do something...
                            break;
                        case RongIMClient.MessageType.ContactNotificationMessage:
                            // do something...
                            break;
                        case RongIMClient.MessageType.ProfileNotificationMessage:
                            // do something...
                            break;
                        case RongIMClient.MessageType.CommandNotificationMessage:
                            // do something...
                            break;
                        case RongIMClient.MessageType.CommandMessage:
                            // do something...
                            //todo all do it
                            // this.addMessage(message);
                            this.onEvents.status.forEach(fun => fun());
                            // 监听状态变化

                            break;
                        case RongIMClient.MessageType.WMRCInquiryMessage:
                            message.content.content = message.content.inquiryTextMsg;
                            // message.content.content => 消息内容
                            this.addMessage(message);

                            break;
                        case RongIMClient.MessageType.UnknownMessage:
                            this.addMessage(message);
                            // do something...
                            break;
                        default:
                        // do something...
                    }
                } else if (this.getAllmessageStatus) {
                    this.addMessage(message);
                }
            },
        });
        this.RongIMClient.connect(this.rongCloudToken, {
            onSuccess: userId => {
                console.log('rongInit userId', userId);
                this.userId = userId;
                this.loadHistory();
                this.removeUnread();
                // this.ready = true;
                console.log('Login successfully.' + userId);
            },
            onTokenIncorrect: () => {
                this.ready = false;
                return Toast.fail('融云 token 无效');
            },
            onError: errorCode => {
                let info;
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        // 链接超时进行重新的链接start
                        this.reconnect();
                        // 链接超时进行重新链接end
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                        info = '在黑名单中，无法向对方发送消息';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                        info = '不在讨论组中';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_GROUP:
                        info = '不在群组中';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                        info = '不在聊天室中';
                        break;
                    default:
                        // 防止融云报错，无法终止loading的问题，以及方便前端技术人员排查错误
                        info = '融云链接失败，请稍后再试';
                }
                if (info) {
                    // this.ready = false;
                    window.fundebug &&
                        window.fundebug.notify('融云错误', '融云错误码errorCode：' + errorCode, {
                            metaData: {
                                userId: this.userId,
                            },
                        });
                    return Toast.fail(info);
                }
            },
        });
    }
    // 清除未读消息
    removeUnread() {
		const conversationType = RongIMLib.ConversationType.PRIVATE;
		RongIMClient.getInstance().clearUnreadCount(conversationType, this.targetId, {
			onSuccess: function () {
				// 清除未读消息成功。
				console.log('清除未读消息成功')
			},
			onError: function (error) {
				// error => 清除未读消息数错误码。
			}
		});
	}
    // 捕获消息
    addMessage(messageItem = {}) {
        let n = this.messageList.length;
        //保证不重复
        if (n > 1 && this.messageList[n - 1] && this.messageList[n - 1].messageId === messageItem.messageId) {
            return
        }
        //私聊
        if (RongIMLib.ConversationType.PRIVATE !== messageItem.conversationType) {
            return
        }
        this.messageList.push(messageItem);
        this.filterMessage(this.messageList);
        Toast.hide();
        this.onEvents.message.forEach(fun => fun([...this.messageList]));
    }
    // 重新连接融云服务器。
    reconnect() {
        const callb = {
            onSuccess: userId => {
                console.log('Reconnect successfully.' + userId);
                // this.ready = true;
                this.userId = userId;
            },
            onTokenIncorrect: () => {
                Toast.fail('token无效');
            },
            onError: error => {
                window.fundebug &&
                    window.fundebug.notify('融云重连错误', '融云错误信息：' + error, {
                        metaData: {
                            userId: this.userId,
                        },
                    });
                Toast.fail(error);
            },
        };
        const config = {
            //  默认 false, true 启用自动重连，启用则为必选参数
            auto: window.navigator && window.navigator.onLine ? true : false,
            //  重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
            url: 'http://cdn.ronghub.com/RongIMLib-2.5.1.min.js',
            //  网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.5.0.min.js 可选
            rate: [100, 1000, 3000, 6000, 10000],
        };
        this.RongIMClient.reconnect(callb, config);
    };
    loadHistory() {
        const conversationType = RongIMLib.ConversationType.PRIVATE; //私聊,其他会话选择相应的消息类型即可。
        const count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取。
        this.RongCloudInstance.getHistoryMessages(conversationType, this.targetId, null, count, {
            onSuccess: (list = [], hasMsg) => {
                list.forEach((val) => {
                    if (val.messageType == "TextMessage" && val.content.content) {
                        val.content.content = RongIMLib.RongIMEmoji.emojiToHTML(val.content.content);
                    }
                    if (val.messageType == 'WMRCInquiryMessage') {
                        if (val.content.inquiryTextMsg) {
                            val.content.content = RongIMLib.RongIMEmoji.emojiToHTML(val.content.inquiryTextMsg);
                        }
                    }
                });
                this.messageList = [...list, ...this.messageList];
                if (hasMsg) {
                    this.loadHistory();
                } else {
                    this.filterMessage(this.messageList);
                    Toast.hide();
                    this.onEvents.message.forEach(fun => fun([...this.messageList]));
                }
            },
            onError: (error) => {
                if (error == '-1' && this.tryHistoryFrequency < 3) { //超时重试3次
                    this.tryHistoryFrequency = this.tryHistoryFrequency + 1;
                    this.loadHistory();
                } else {
                    Toast.info("error:获取聊天记录失败,errorcode:" + error);
                }
            }
        });
    }
    filterMessage(arr) {
        let newArr = [];
        const obj = {};
        const conversationType = RongIMLib.ConversationType.PRIVATE;
        arr.forEach((item) => {
            if (item) {
                const key = item.sentTime + JSON.stringify(item.content);
                if (!obj[key]) {
                    // 过滤重复消息
                    obj[key] = true;
                    if (item.conversationType === conversationType) {
                        // 过滤单聊
                        newArr.push(item);
                    }
                }
            }
        });
        // 屏蔽非当前聊天消息
        newArr = newArr.filter((item) => {
            if (item && item.senderUserId) {
                return item.senderUserId === this.senderUserId || item.senderUserId === this.targetId; // 过滤发送人
            } else {
                return false;
            }
        });
        const messageList = [];
        newArr.forEach(item => {
            let has = false;
            messageList.forEach(alerdy => {
                // item.senderUserId === alerdy.senderUserId && item.sentTime === alerdy.sentTime && 
                if (item.messageId === alerdy.messageId) {
                    has = true;
                }
            });
            if (!has) {
                messageList.push(item);
            }
        })
        this.messageList = messageList;
    }
    getCloudToken() {
        return this.rongCloudToken;
    }
    // 绑定事件
    on(event, func) {
        if (this.onEvents[event]) {
            this.onEvents[event].push(func);
        } else {
            this.onEvents[event] = [func];
        }
    }
    sendToRongCloud(msg) {
        if (this.isSending) {
            return;
        }
        this.isSending = true;
        const conversationtype = RongIMLib.ConversationType.PRIVATE;
        RongIMClient.getInstance().sendMessage(conversationtype, this.targetId, msg, {
            onSuccess: (message) => {
                this.isSending = false;
                this.addMessage(message);
                //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            },
            onError: (errorCode, message) => {
                this.isSending = false;
                var info = '';
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                        info = '在黑名单中，无法向对方发送消息';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                        info = '不在讨论组中';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_GROUP:
                        info = '不在群组中';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                        info = '不在聊天室中';
                        break;
                    default:
                        info = '未知错误';
                        break;
                }
                console.log('发送失败:' + info);
                Toast.info(info);
            }
        });
    }
    sendMessage({ content, type, duration, voiceUri, imageUrl }) {
        Toast.loading('发送中', 0);
        // this.sending = true;
        // setTimeout(() => {
        //     this.sending = false;
        // }, 300)
        let msg = null;
        switch (type) {
            case 'images':
                // msg = new RongIMLib.ImageMessage({
                //     content: '',
                //     imageUri: imageUrl,
                // });
                // break;
                const image = new Image();
                image.crossOrigin = '*'; // 支持跨域图片
                image.src = imageUrl;
                image.onload = () => {
                    const getBase64 = img => {
                        if (img.height > 100) {
                            img.width *= 100 / img.height;
                            img.height = 100;
                        }
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(img, 0, 0, img.width, img.height);
                        }
                        const dataURL = canvas.toDataURL('image/png', 0.5); // 可选其他值 image/jpeg
                        return dataURL;
                    };

                    const picSrc = getBase64(image);
                    const base64Str = picSrc.split('base64,')[1];
                    msg = new RongIMLib.ImageMessage({
                        content: base64Str,
                        imageUri: imageUrl,
                    });
                    this.sendToRongCloud(msg);
                }
                return;
            case 'voice':
                msg = new RongIMLib.VoiceMessage({
                    content,
                    duration,
                    voiceUri,
                });
                break;
            default:
                msg = new RongIMLib.TextMessage({ content, extra: '' });
        }
        this.sendToRongCloud(msg);
    }
}

export default RouCloud;