
import React, { useMemo, useEffect, useState } from 'react';
import './home.less';
import { getRenderRsPage } from '@services/module/home';
import urlparams from '@utils/urlparams';

import DoctorCard from '@component/DoctorCard';
import SearchBar from '@component/SearchBar';
import FastCard from './FastCard.jsx';
import HotDept from './HotDept.jsx';

import route from '@route';

sessionStorage.areaId = urlparams.areaId || sessionStorage.areaId || 0;
sessionStorage.hosId = urlparams.hosId || sessionStorage.hosId || '';

export default (props) => {
    const [dept, setDept] = useState([]);
    const [doctor, setDoctor] = useState([]);

    const areaId = sessionStorage.areaId;
    const hosId = sessionStorage.hosId;
    const getData = () => {
        getRenderRsPage({
            areaId,
            hospitalIds: hosId || undefined
        }).then(({ code, data }) => {
            if (!code) {
                const dept = [];
                let doctor = [];
                const { recommendDptList = [] } = data;
                recommendDptList.forEach(item => {
                    doctor = [...doctor, ...item.doctorList];
                    dept.push({
                        image: item.departmentImg,
                        operaDptId: item.operationDptId,
                        operaDptName: item.operationDptName,
                    });
                });
                dept.push({
                    image: 'https://cdn.myweimai.com/images/6a4d306d2d97e1c21b5c628a5011733c_60x60.png',
                    operaDptName: '更多',
                })
                setDept(dept);
                setDoctor(doctor);
            }
        });
    }
    useEffect(() => {
        getData();
    }, []);

    const List = useMemo(() => {
        return <div className="doctor_card_list">
            <h2 className="doctor_card_title">名医推荐</h2>
            {
                doctor.map(item => <DoctorCard data={item} />)
            }
        </div>
    }, [doctor])

    const depts = useMemo(() => <HotDept data={dept} />, [dept])
    return <div id="open_consult_home">
        <SearchBar
            readOnly={true}
            onClick={() => {
                route.push(`./doctor_list.html?areaId=${areaId}&type=search`);
            }}
        />
        <FastCard />
        {/* <TopCard /> */}
        {depts}
        {List}
        <div
            className="order_menu"
            onClick={() => {
                route.push(`/new/mall/my/order.html?tabType=1&noShowTab=1`);
            }}
        >
            我的订单
        </div>
    </div>

}