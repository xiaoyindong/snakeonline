import ossprocess from '@utils/ossprocess';
import route from '@route';
import './style.less';
export default ({ data = {} }) => {
    const {
        doctorLabels,
        doctorAvatar,
        price,
        doctorName,
        titleName,
        hospitalName,
        departName,
        skill,
        replyRate,
        adviceNum,
        doctorId,
        employeeId
    } = data;
    return <div className="doctor_card_item">
        <div className="doctor_photo">
            <img src={ossprocess.optimizationImg(
                doctorAvatar,
                { resize: `w_${40}` }
            )} />
        </div>
        <div className="doctor_info">
            <div>
                <span className="doctor_name">{doctorName}</span>
                <span className="doctor_title">{titleName}</span>
            </div>
            <div className="doctor_hospital">{hospitalName} · {departName}</div>
            {
                <div className="label_list">
                    {
                        doctorLabels.map(label => <span className="label_item">图文</span>)
                    }
                </div>
            }
            <p className="">{skill}</p>
            <p className="number_score">
                <span>回复率</span>
                <span className="value">{replyRate}</span>
                <span>咨询</span>
                <span className="value">{adviceNum}</span>
                <button
                    className="consult_btn"
                    onClick={() => {
                        route.push(`./doctor_info.html?employeeId=${employeeId}`);
                        // route.push(`/new/dpr/doctorservicemiddle.html?employeeId=${employeeId}`);
                    }}
                >￥{price} 咨询</button>
            </p>
        </div>
    </div>
}