import { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.less';
import { Modal, Toast } from 'antd-mobile';
import Rate from '@component/Rate/index.jsx';
import { retrieveCommentLabels, createComment, retrieveCommentDetail } from '@services/module/chat';


class EvaluateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            show: props.show,
            data: null,
            labelIdList: [],
            content: '',
            hasComment: props.hasComment,
        };
    }

    componentDidMount() {
        this.getLabel();
        this.limitOverFlow(true);
    }

    returnMove(e) {
        e.preventDefault();
    }

    limitOverFlow(bool) {
        if (bool) {
            document.body.addEventListener('touchmove', this.returnMove, { passive: false });
        } else {
            document.body.removeEventListener('touchmove', this.returnMove);
        }
    }

    async retrieveCommentDetail() {
        const data = await retrieveCommentDetail({
            orderId: this.props.orderId,
        });
        if (!data.code) {
            this.setState({
                value: +data.data.comment.score,
                comment: data.data.comment,
            });
        }
    }

    async getLabel() {
        const data = await retrieveCommentLabels({
            orderId: this.props.orderId,
        });
        if (!data.code) {
            // 处理五级评分
            const list = [];
            [1, 2, 3, 4, 5].forEach(score => {
                let scoreItem = null;
                (data.data || []).forEach(item => {
                    if (Number(item.score) === score) {
                        scoreItem = item;
                    }
                });
                list[score - 1] = scoreItem || {
                    description: '',
                    labelList: [],
                    score,
                };
            });
            this.setState({
                data: list,
            });
        }
        if (this.props.hasComment) {
            this.retrieveCommentDetail();
        }
    }

    async createComment() {
        this.close();
        const data = await createComment({
            orderId: this.props.orderId,
            content: this.state.content,
            labels: this.state.labelIdList.join(','),
            type: '2',
            score: this.state.value,
        });
        if (!data.code) {
            Toast.success('评价成功');
            this.props.onReload();
        }
    }

    close() {
        this.limitOverFlow(false);
        this.setState({
            show: false,
        });
    }

    render() {
        const { value, data, labelIdList, hasComment, comment } = this.state;
        if (!data) {
            return <div />;
        }
        return (
            <Modal
                className="evaluate_modal_wrap"
                popup={true}
                visible={this.state.show}
                onClose={() => {
                    this.close();
                }}
                animationType="slide-up"
            >
                {hasComment ? <div className="hasComment_icon" /> : null}
                <div className="header_content">
                    <div className="title">评价</div>
                    <div
                        className="close"
                        onClick={() => {
                            this.close();
                        }}
                    />
                </div>
                <div className="date_list_modal">
                    <Rate
                        value={value}
                        onChange={val => {
                            if (hasComment) {
                                return;
                            }
                            this.setState({
                                labelIdList: [],
                                value: val,
                            });
                        }}
                    >
                        {value ? data[value - 1] && data[value - 1].description : null}
                    </Rate>
                    <div className="label_list clearfix">
                        {value && !hasComment
                            ? data[value - 1] &&
                            data[value - 1].labelList.map((item, i) => {
                                if ((i + 1) % 3) {
                                    return (
                                        <div
                                            className={`label_item fl ${
                                                labelIdList.includes(item.labelId) ? 'active' : ''
                                                }`}
                                            key={item.labelId}
                                            onClick={() => {
                                                if (hasComment) {
                                                    return;
                                                }
                                                const idx = labelIdList.indexOf(item.labelId);
                                                if (idx !== -1) {
                                                    labelIdList.splice(idx, 1);
                                                } else {
                                                    labelIdList.push(item.labelId);
                                                }
                                                this.setState({
                                                    labelIdList,
                                                });
                                            }}
                                        >
                                            {item.labelName}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            className={`label_item fl no_margin ${
                                                labelIdList.includes(item.labelId) ? 'active' : ''
                                                }`}
                                            key={item.labelId}
                                            onClick={() => {
                                                if (hasComment) {
                                                    return;
                                                }
                                                const idx = labelIdList.indexOf(item.labelId);
                                                if (idx !== -1) {
                                                    labelIdList.splice(idx, 1);
                                                } else {
                                                    labelIdList.push(item.labelId);
                                                }
                                                this.setState({
                                                    labelIdList,
                                                });
                                            }}
                                        >
                                            {item.labelName}
                                        </div>
                                    );
                                }
                            })
                            : null}
                        {hasComment &&
                            comment &&
                            (comment.labels || []).map((item, i) => {
                                if ((i + 1) % 3) {
                                    return (
                                        <div className={`label_item fl active`} key={item}>
                                            {item}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className={`label_item fl no_margin active`} key={item}>
                                            {item}
                                        </div>
                                    );
                                }
                            })}
                    </div>
                    {value ? (
                        <div>
                            {hasComment ? (
                                <div className="read_detail_evalute">{comment.detail}</div>
                            ) : (
                                    <input
                                        disabled={hasComment}
                                        className="custom_desc"
                                        placeholder="补充评价，帮助我们改进服务质量"
                                        onChange={e => {
                                            this.setState({
                                                content: e.target.value,
                                            });
                                        }}
                                    />
                                )}
                        </div>
                    ) : null}
                </div>
                {hasComment ? null : (
                    <div className="bottom_button">
                        <div
                            className="button"
                            onClick={() => {
                                this.createComment();
                            }}
                        >
                            匿名提交
            </div>
                    </div>
                )}
            </Modal>
        );
    }
}

const show = props => {
    let div = document.createElement('div');
    if (document.getElementById('evaluate_modal_wrap')) {
        div = document.getElementById('evaluate_modal_wrap');
    } else {
        div.id = 'evaluate_modal_wrap';
        document.body.appendChild(div);
    }
    ReactDOM.render(<EvaluateModal {...(props || {})} show={true} key={Math.random()} />, div);
    return div;
};

const hide = (dom) => {
    if (dom === undefined) {
        const div = document.getElementById('evaluate_modal_wrap');
        if (div) {
            document.body.removeChild(div);
        }
    } else if (dom) {
        document.body.removeChild(dom);
    }
};

export default { show, hide };
