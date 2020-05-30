
import React, { useMemo, useEffect, useState } from 'react';
import './style.less';
import { queryByHospitalIds } from '@services/module/doctorlist';
import urlparams from '@utils/urlparams';
import SearchBar from '@component/SearchBar';
import SearchCondition from '@component/SearchCondition';
import DoctorCard from '@component/DoctorCard';

let timer = null;
let data = null;
let pageIndex = 1;
let hasMore = true;
let areaId = urlparams.areaId || 0;
let departmentId = urlparams.operateId || undefined;
let hosId = urlparams.hosId || undefined;
export default (props) => {
    const [keyword, setKeyword] = useState(sessionStorage.keyWord || undefined);

    let [reset, setReset] = useState(1);

    useEffect(() => {
        window.onscroll = () => {
            if (hasMore && window.outerHeight + window.scrollY + 10 > document.body.offsetHeight && document.body.offsetHeight > window.outerHeight) {
                pageIndex += 1;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    getList();
                }, 280);
            }
        }
    }, [])

    useEffect(() => {
        data = [];
        pageIndex = 1;
        getList();
    }, [keyword]);

    const getList = () => {
        queryByHospitalIds({
            hospitalIds: hosId,
            selectAreaId: areaId,
            keyWord: keyword,
            pageIndex,
            pageSize: 10,
            operDptId: departmentId,
        }).then(content => {
            if (!content.code) {
                const { doctorData = [] } = content.data;
                hasMore = doctorData.length >= 10;
                if (pageIndex <= 1) {
                    data = [...doctorData];
                } else {
                    data = [...(data || []), ...doctorData];
                }
                setReset(Math.random());
            }
        })
    }

    const list = useMemo(() => {
        if (!data) {
            return null;
        }
        if (!data.length) {
            return <div className="doctor_list_empty">
                <img className="image" src="//cdn.myweimai.com/images/cf1f282e4ad84598b0f38216421b3ecb_320x320.png" />
                <p>暂无数据</p>
            </div>
        }
        return <div className="doctor_list">
            {
                data.map(item => <DoctorCard data={item} />)
            }
            <p>
                {hasMore ? null : '没有更多了'}
            </p>
        </div>
    }, [reset]);

    const header = useMemo(() => {
        if (urlparams.type === 'search') {
            return <SearchBar
                value={keyword}
                onSearch={(keyword) => {
                    window.scrollTo(0, 0);
                    setKeyword(keyword);
                }}
                onCancel={() => {
                    delete sessionStorage.keyWord;
                    history.back();
                }}
            />
        } else {
            return <SearchCondition
                onChange={(data) => {
                    if (data.departmentId) {
                        departmentId = data.departmentId;
                    } else {
                        areaId = data.areaId;
                        departmentId = undefined;
                    }
                    pageIndex = 1;
                    document.documentElement.scrollIntoView(true);
                    getList();
                }}
            />
        }
    }, []);


    return <div id="doctor_list">
        {header}
        {list}
    </div>
}