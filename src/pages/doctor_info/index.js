if (navigator.userAgent.toUpperCase().indexOf('IPHONE') !== -1) {
    // 兼容iso 不刷新问题
    window.onpageshow = function (e) {
        if (e.persisted) {
            window.location.reload(true);
        }
    }
}
/**
 * 医生服务页面
 */
import ReactDOM from 'react-dom';
import DoctorInfo from './DoctorInfo.jsx';
import '@global';
import 'lib-flexible';

ReactDOM.render(<DoctorInfo />, document.getElementById('App'));