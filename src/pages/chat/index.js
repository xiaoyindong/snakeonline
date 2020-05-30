if (navigator.userAgent.toUpperCase().indexOf('IPHONE') !== -1) {
    // 兼容iso 不刷新问题
    window.onpageshow = function (e) {
        if (e.persisted) {
            window.location.reload(true);
        }
    }
}
/**
 * 聊天页
 */
import ReactDOM from 'react-dom';
import Main from './Main.jsx';
import '@global';
import 'lib-flexible';

ReactDOM.render(<Main />, document.getElementById('App'));