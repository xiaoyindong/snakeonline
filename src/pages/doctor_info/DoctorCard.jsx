
import { useMemo, useState } from 'react';

export default ({ data }) => {

    const [open, setOpen] = useState(false);

    const doctor = useMemo(() => {
        if (!data) {
            return null;
        }

        const {
            doctorAvatar,
            doctorName,
            doctorLabels = [],
            titleName,
            departName,
            hospitalName,
            adviceNum,
            replyRate,
            favorableRate,
            skill,
            summary
        } = data;
        return <div className="doctor-info-box">
            <div className="doctor-info-top">
                <img src={doctorAvatar} alt="" />
                <div className="doctor-name">{doctorName}</div>
                <div className="tags">
                    {doctorLabels.map((item, idx) => (
                        <span className="tag" key={idx}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>
            <div className="doctor-info-mid">
                <div className="doctor-action">
                    <span className="doctor-title">{titleName}</span>
                    <span>{departName}</span>
                </div>
                <div className="doctor-hosp">{hospitalName}</div>
                {/* <div
                    className="to-detail"
                    onClick={() => {
                        this.toDoctor();
                    }}
                >
                    <span>主页</span>
                    <b></b>
                </div> */}
            </div>
            <div className="doctor-info-bottom">
                <ul>
                    <li>
                        <span className="s-key">咨询数</span>
                        <span className="s-value">{adviceNum}</span>
                    </li>
                    <li>
                        <span className="s-key">回复率</span>
                        <span className="s-value">{replyRate}</span>
                    </li>
                    <li>
                        <span className="s-key">好评率</span>
                        <span className="s-value">{favorableRate}</span>
                    </li>
                </ul>
                <div
                    className="doctor-desc"
                    className={
                        open ? "doctor-desc-open" : "doctor-desc-notopen"
                    }
                >
                    <p className="desc-detail">
                        {`擅长：${skill || "暂无"}`}
                        <br></br>
                        {`简介：${summary || "暂无"}`}
                    </p>
                    {(skill || summary) && (
                        <div
                            className="to-detail"
                            onClick={() => {
                                setOpen(!open);
                            }}
                        >
                            <span>查看详情</span>
                            <b></b>
                        </div>
                    )}
                </div>
            </div>
        </div>
    }, [data, open])

    return [doctor]
}