import { useMemo, useEffect, useState } from 'react';

import { getDoctoCommentList } from '@services/module/doctorhome';

let pageNum = 1;
let hasMore = true;
let timer = null;
let doctorId = null;
let evaList = [];

export default ({ list, doctorInfo }) => {

    const [data, setData] = useState(null);

    const [reset, setReset] = useState(1);

    const getList = async () => {
        const content = await getDoctoCommentList({
            pageNum,
            pageSize: 10,
            doctorId
        });
        if (!content.code) {
            content.data.data = content.data.data || [];
            hasMore = content.data.data.length >= 10;
            evaList = [...evaList, ...content.data.data]
            delete content.data.data;
            setData(content.data);
            setReset(Math.random());
        }
    }

    useEffect(() => {
        window.onscroll = () => {
            if (hasMore && window.outerHeight + window.scrollY + 10 > document.body.offsetHeight && document.body.offsetHeight > window.outerHeight) {
                pageNum += 1;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    getList();
                }, 280);
            }
        }
    }, [])

    useEffect(() => {
        if (doctorInfo && doctorInfo.doctorId) {
            doctorId = doctorInfo.doctorId;
            getList();
        }
    }, [doctorInfo])

    const evaluate = useMemo(() => {
        if (!data || !list) {
            return;
        }
        const { totalCount } = data;
        return <div className="evaluate-box">
            <div className="evaluate-title b-title ">
                患者评价
          <span className="num">({totalCount})</span>
            </div>
            <div className="evaluate-values">
                {
                    list.map(({ name, num }, index) => {
                        return (
                            <div key={index} className="evaluate-tag">
                                <span>{name}</span>
                                <span>{num}</span>
                            </div>
                        );
                    })
                }
            </div>
            <div className="evaluate-item-box">
                {
                    evaList.map((item, index) => (
                        <div key={index} className="evaluate-item">
                            <div className="line"></div>
                            <div className="star-box">
                                {item.score > 0 &&
                                    new Array(item.score)
                                        .fill("")
                                        .map((item, index) => (
                                            <img
                                                key={index}
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAaCAMAAACTisy7AAAAS1BMVEUAAAD/wi3/0Ub/wiv/wiv/wyz/yjb/wiz/wiv/wiv/wiv/wiz/wiz/wyz/wSv/wiz/wSz/wiz/wiv/wi3/wy3/wy//wjP/xS7/wSvJ42fCAAAAGHRSTlMAfQfKw3QM7+jinmdIQNvRkG1kUE4mGRb+x/2aAAAAm0lEQVQoz3XR2QrEIAxA0dS6W7sv+f8vneIImsnkPoh6CAgCKWeQ01q2CXEScUQc5cG3SR4URw8sHX9x+eLye//ktGqs6TXlB0rWRO2Q5XQ0FmBAoQGgKbem3Jpya8qNKDXS3NtMTdFJRfCieBE8KZ4EDUVDMJa7sO+hbCL755AUgEqB/bhDv6n68M2j6+32plBl4+8OrX0Xfv4A96Aag2Cx44cAAAAASUVORK5CYII="
                                                alt=""
                                            />
                                        ))}
                                {5 - item.score > 0 &&
                                    new Array(5 - item.score)
                                        .fill("")
                                        .map((n, index) => (
                                            <img
                                                key={`id${index}`}
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAaCAMAAACTisy7AAAAV1BMVEUAAAD39/f39/f7+/v9/f339/f39/f39/f39/f39/f39/f4+Pj39/f4+Pj39/f39/f39/f39/f4+Pj39/f39/f39/f4+Pj4+Pj4+Pj39/f////////39/euvmdwAAAAHHRSTlMAfccMB+/o3sKec2dOQOPRzJB3bWRQSCYZFgQBfHw4fQAAAJ9JREFUKM910jcShDAMQFHhhCM5o/ufc4N2ZhHGv7L1GhUCVkpQztqyLYhLEQWiKFnEd7GA3Qe7Z5vx2/xkZ0vYnjfYU+gt/rJ9SDvNpXdCY5YWzkuACgtVAH/NjWtupLllmhspN1Z9tZrbgayD4cpxZRg5RoYDx4Gho0WmiRZz9wPBJigAFRq8H4tGMyp6qtGgvtpmPBGxN9sFpQSK/1+Jsh8drFvumAAAAABJRU5ErkJggg=="
                                                alt=""
                                            />
                                        ))}
                            </div>
                            <p className="evaluate-value">{item.detail}</p>
                            <div className="evaluate-by-info">
                                <span className="tel">{item.mobile}</span>
                                <span className="time">{item.commentTime}</span>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    }, [data, list, reset]);

    return [evaluate];
}