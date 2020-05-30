import { useEffect, useMemo, useState } from 'react';
import ossprocess from '@utils/ossprocess';
import { Checkbox, Toast } from 'antd-mobile';
import { getOrderDetail, getDoctorInfo, saveDescription } from '@services/module/descript';
import urlparams from '@utils/urlparams';
import './style.less';

import Member from './Member';
import Upload from './Upload';
import Descript from './Descript';

const sendData = {
    customerId: '',
    familyCustomerId: '',
    illnessDesc: '',
    imageList: [],
    purposeCodes: ['3'],
    healthRecordList: [],
    businessType: '2',
    businessId: urlparams.orderId,
    scaleIds: [],
    patientCard: {},
    packageId: ''
}

// patientCard = {
//     institution_id: illnessDescInput.cardInfo.institutionId,
//     patient_code: illnessDescInput.cardInfo.patientId,
//     card_id: illnessDescInput.cardInfo.id,
//     card_number: illnessDescInput.cardInfo.actualCardNumber,
//     card_type: illnessDescInput.cardInfo.cardType,
//     card_name: illnessDescInput.cardInfo.cardTypeName,
//   };

export default () => {
    const [doctorInfo, setDoctorInfo] = useState({});
    useEffect(async () => {
        const { code, data } = await getOrderDetail({
            orderId: urlparams.orderId
        });
        if (code) {
            return;
        }
        const content = await getDoctorInfo({
            doctorUserId: data.doctorUserId
        });
        if (code) {
            return;
        }
        setDoctorInfo(content.data);
    }, [])

    const patient = useMemo(() => {
        return <Member
            onSelect={(select) => {
                sendData.customerId = select.mainCustomerId;
                sendData.familyCustomerId = select.customerId;
            }}
        />
    }, [])

    const doctor = useMemo(() => {
        const { doctorName, professionTitleName, photo, hospitalName } = doctorInfo;
        return <div className="doctor_card">
            <img
                className="doctor_photo"
                src={ossprocess.optimizationImg(
                    photo,
                    { resize: `w_${40}` }
                )}
            />
            <div className="doctor_info">
                <p>
                    <span>{doctorName}</span>
                    <span>{hospitalName}</span>
                    <span>{professionTitleName}</span>
                </p>
                <p className="doctor_chat">请详细描述，我会为您提供相应的帮助</p>
            </div>
        </div>
    }, [doctorInfo]);

    const desc = useMemo(() => {
        return <Descript
            onChange={(value) => {
                sendData.illnessDesc = value;
            }}
        />
    });

    const upload = useMemo(() => {
        return <Upload
            onChange={(list = []) => {
                sendData.imageList = [...list];
            }}
        />;
    }, [])

    return <div id="descrip_page">
        {doctor}
        {patient}
        {desc}
        {upload}
        {/* <div className="bottom_desc">
            <Checkbox>
                <span className="text">希望医生开具药品或提供用药建议</span>
            </Checkbox>
        </div> */}
        <div className="bottom_weimai">
            微脉会保证您的信息隐私，仅自己和医生可见
        </div>
        <div className="bottom_button">
            <button
                onClick={() => {
                    if (!sendData.customerId) {
                        return Toast.info('请选择咨询用户', 1.2);
                    }
                    if (!sendData.illnessDesc) {
                        return Toast.info('请输入症状描述', 1.2);
                    }
                    //   if (type === '12' && cardStatus && !(illnessDescInput.cardInfo && illnessDescInput.cardInfo.value)) {
                    //     return Toast.info('请选择就诊卡', 2);
                    //   }
                    saveDescription(sendData).then(({ code, data }) => {
                        if (!code) {
                            location.href = `/open-consult/chat.html?doctorUserId=${data.doctorUserId}`;
                        }
                    })
                    console.log(123);
                }}
            >下一步</button>
        </div>
    </div>
}