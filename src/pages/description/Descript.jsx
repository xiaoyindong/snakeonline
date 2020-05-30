import { useMemo, useState } from 'react';


export default ({ onChange }) => {
    const [show, setShow] = useState(false);

    return <div className="descript_box">
        <div className="descript_title">
            <span>哪里不舒服呢？</span>
            <span
                onClick={() => {
                    setShow(!show);
                }}
            >如何描述</span>
        </div>
        {
            useMemo(() => {
                if (show) {
                    return <div className="eg_box">
                        <p>请描述疾病名称或者症状，患病时间，做过什么检查，用药情况，目前病情是加重还是缓解，想要获得医生什么帮助？描述越详细，医生回复质量越高</p>
                        <p>例：女儿三岁，上周一感冒咳嗽流鼻涕，医院检查说是支原体感染（报告单见照片），阿奇颗粒吃了三天有好转，但隔了两天又开始咳嗽流鼻涕，请问医生接下来该如何治疗？</p>
                    </div>
                }
            }, [show])

        }
        <hr />
        <textarea
            className="descript_text"
            placeholder={`在此详细描述情况\n如：发病症状、患病时间、发病诱因、病情发展情况、检查报告、用药情况、就医信息等等`}
            onChange={(e) => {
                onChange && onChange(e.target.value);
            }}
        />
    </div>
}