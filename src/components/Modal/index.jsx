import { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.less';
import { Modal } from 'antd-mobile';

class EvaluateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
        };
    }

    componentDidMount() {
    }

    close() {
        this.setState({
            show: false,
        });
    }

    render() {
        const { children, onOk } = this.props;
        return (
            <Modal
                footer={[
                    {
                        text: '确定',
                        onPress: () => {
                            this.close();
                            onOk && onOk();
                        }
                    }
                ]}
                className="consult_modal_wrap"
                transparent
                visible={this.state.show}
                onClose={() => {
                    this.close();
                }}
            >
                {children}
            </Modal>
        );
    }
}

const show = props => {
    let div = document.createElement('div');
    if (document.getElementById('consult_modal_wrap')) {
        div = document.getElementById('consult_modal_wrap');
    } else {
        div.id = 'consult_modal_wrap';
        document.body.appendChild(div);
    }
    ReactDOM.render(<EvaluateModal {...(props || {})} show={true} key={Math.random()} />, div);
    return div;
};

const hide = (dom) => {
    if (dom === undefined) {
        const div = document.getElementById('consult_modal_wrap');
        if (div) {
            document.body.removeChild(div);
        }
    } else if (dom) {
        document.body.removeChild(dom);
    }
};

export default { show, hide };
