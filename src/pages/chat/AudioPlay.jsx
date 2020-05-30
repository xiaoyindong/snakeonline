import { Component } from 'react';

import { Toast } from 'antd-mobile';

import ossprocess from '@utils/ossprocess';

import { repuestAmrtomp3 } from '@services/module/chat';

export default class AudioPaly extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 0,
        }
        // 三张图分别代表暂停 播放 加载中
        this.playButtons = [
            '//cdn.myweimai.com/images/ce9d153f13173aaddc0aa0a0af7033de_58x58.png',
            '//cdn.myweimai.com/images/63019b09684965bf914f8760e538a9a3_58x58.png',
            '//cdn.myweimai.com/images/e4b67f2178a736222f16fc480550f41e_50x50.gif',
        ];
        this.audioStream = null;
        this.audio = document.createElement("audio");
    }

    componentDidMount() {
        // 解决ios手机自动播放问题
        let state = 0;
        document.addEventListener('WeixinJSBridgeReady', () => {
            this.audio.play();
        }, false);

        document.addEventListener('touchstart', () => {
            if (state == 0) {
                this.audio.play();
                state = 1;
            }
        }, false);
        this.audio.onended = () => {
            this.setState({ status: 0 });
        }
    }

    async loadStream(content) {
        if (this.audioStream) {
            this.audioPlay();
            return;
        }
        this.setState({ status: 2 })
        const { code, data = {} } = await repuestAmrtomp3({ amrBase64Data: encodeURIComponent(content) });
        if (!code) {
            const { mp3Data } = data;
            if (mp3Data) {
                this.audioStream = 'data:audio/mp3;base64,' + mp3Data;
                this.audioPlay();
            } else {
                Toast.info('语音为空');
                return;
            }
        }
    }

    audioPlay() {
        this.audio.src = this.audioStream;
        this.setState({ status: 1 });
        this.audio.play();
    }

    img() {
        const { status } = this.state;
        const { content, aac, url } = this.props.data || {};
        return <img
            className="status"
            onClick={() => {
                if (aac) {
                    if (this.state.status === 1) {
                        this.setState({ status: 0 });
                        this.audio.pause();
                    } else {
                        this.audio = new Audio(url);
                        this.setState({ status: 1 });
                        this.audio.play();
                    }
                    return;
                }
                if (this.state.status === 2) {
                    return;
                }
                if (this.state.status === 1) {
                    this.setState({ status: 0 });
                    this.audio.pause();
                    return;
                }
                if (content) {
                    this.loadStream(content);
                }
            }}
            src={ossprocess.optimizationImg(
                this.playButtons[status],
                { resize: `w_${30}` }
            )}
        />
    }

    range() {
        return <div className="range" />
    }

    render() {
        const { duration } = this.props.data || {};
        const min = parseInt(duration / 60);
        const sec = duration % 60;
        return [this.img(), this.range(), <span className="duration">{(min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec)}</span>]
    }
}
