import { useMemo, useEffect, useState } from 'react';

import './style.less';

import { getDoctorDetail, getDoctorServices, getDoctorStars } from '@services/module/doctorhome';

import urlparams from '@utils/urlparams';

import DoctorCard from './DoctorCard';
import Servers from './Servers';
import Evaluate from './Evaluate';


export default () => {

    const [doctorInfo, setDoctorInfo] = useState(null);

    const [serverList, setServiceList] = useState(null);

    const [starList, setStarList] = useState(null);

    useEffect(async () => {
        const { code, data } = await getDoctorDetail({
            employeeId: urlparams.employeeId
        });
        if (!code) {
            setDoctorInfo(data);
            getDoctorServices({
                doctorId: data.doctorId,
            }).then(content => {
                if (!content.code) {
                    setServiceList(content.data);
                }
            })
            getDoctorStars({
                doctorId: data.doctorId,
            }).then(content => {
                if (!content.code) {
                    setStarList(content.data);
                }
            })
        }
    }, [])

    const doctor = useMemo(() => {
        return <DoctorCard data={doctorInfo} />
    }, [doctorInfo]);

    const servers = useMemo(() => {
        return <Servers data={serverList} />;
    }, [serverList]);

    const evaluate = useMemo(() => {
        return <Evaluate list={starList} doctorInfo={doctorInfo} />;
    }, [starList, doctorInfo]);

    return <div id="doctor_info">
        {doctor}
        {servers}
        {evaluate}
    </div>
}
