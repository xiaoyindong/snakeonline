
import './style.less';

let data = undefined;

export default ({ readOnly, value, onSearch, onCancel, onClick }) => {
    data = value;
    return (<div
        onClick={() => {
            onClick && onClick();
        }}
    >
        <div className="search_bar_rect" />
        <div className="search_bar">
            <div className="search_icon" />
            {
                readOnly ?
                    <div className="search_placeholder">请输入科室、医生</div> : <form action="javascript:;" onSubmit={() => false} className="search_form">
                        <input
                            type="search"
                            className="search_input"
                            defaultValue={value}
                            placeholder={'请输入科室、医生'}
                            onChange={e => {
                                data = e.target.value || '';
                            }}
                            onKeyPress={e => {
                                if (e.nativeEvent && e.nativeEvent.keyCode === 13) {
                                    onSearch && onSearch(data);
                                    sessionStorage.keyWord = data || '';
                                }
                            }}
                        />
                        <span
                            className="cancel"
                            onClick={() => {
                                onCancel && onCancel();
                            }}
                        >取消</span>
                    </form>
            }
        </div>
    </div>)
}