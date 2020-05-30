
import { useMemo, useEffect, useState } from 'react';

import urlparams from '@utils/urlparams';

import { getAreaList, getDeptmentList } from '@services/module/doctorlist';

import './style';

export default ({ onChange }) => {

    const { type } = urlparams;

    const [showAreaModal, setShowAreaModal] = useState(false);

    const [areaList, setAreaList] = useState([]);

    const [areaId, setAreaId] = useState(urlparams.areaId || 0);

    const [showDeptModal, setShowDeptModal] = useState(type === 'department');

    const [deptList, setDeptList] = useState([]);

    const [deptParentId, setDeptParentId] = useState(0);

    const [deptmentId, setDeptmentId] = useState(urlparams.operateId);

    useEffect(async () => {
        const { code, data } = await getAreaList({
            provinceId: 100000
        });
        if (!code) {
            const list = [
                {
                    areaName: '#',
                    initials: '#',
                },
                {
                    areaId: '0',
                    areaName: "全国",
                    inputCode: '#',
                }
            ];
            data.forEach(item => {
                if (!item.inputCode) {
                    return;
                }
                if (list[list.length - 1].initials === item.inputCode.charAt(0)) {
                    list.push({
                        areaId: item.areaId,
                        areaName: item.areaName,
                        initials: item.inputCode.charAt(0),
                    });
                } else {
                    list.push({
                        areaName: item.inputCode.charAt(0),
                        initials: item.inputCode.charAt(0),
                    }, {
                        areaId: item.areaId,
                        areaName: item.areaName,
                        initials: item.inputCode.charAt(0),
                    });
                }

            })
            setAreaList(list);
        }
    }, [])

    useEffect(() => {
        if (showAreaModal || showDeptModal) {
            document.documentElement.style.overflowY = 'hidden';
        } else {
            document.documentElement.style.overflowY = 'auto';
        }
    }, [showAreaModal, showDeptModal]);

    useEffect(() => {
        getDeptmentList({
            areaId
        }).then(({ code, data }) => {
            if (!code) {
                setDeptList(data);
                if (deptmentId) {
                    data.forEach(parent => {
                        if (parent.operationDptId === deptmentId) {
                            setDeptParentId(parent.operationDptId);
                        }
                        (parent.childDptList || []).forEach(item => {
                            if (item.operationDptId === deptmentId) {
                                setDeptParentId(parent.operationDptId);
                            }
                        })
                    })
                }
            }
        });
    }, [areaId]);

    const cityItem = useMemo(() => {
        if (Number(urlparams.areaId) || urlparams.hosId) {
            return null;
        }
        let areaName = '全国';
        areaList.forEach(item => {
            if (item.areaId === areaId) {
                areaName = item.areaName;
            }
        })
        return <div
            className="condition_item"
            onClick={() => {
                setShowAreaModal(!showAreaModal);
                setShowDeptModal(false);
            }}
        >
            <span>{areaName}</span>
            {
                showAreaModal ?
                    <svg className="am-icon am-icon-up am-icon-xxs" color="#ccc">
                        <use href="#up"></use>
                    </svg> : <svg className="am-icon am-icon-down am-icon-xxs" color="#ccc">
                        <use href="#down"></use>
                    </svg>
            }
        </div>
    }, [areaId, areaList, showAreaModal]);

    const deptItem = useMemo(() => {
        let deptName = '全部科室';
        let children = [];

        deptList.forEach(item => {
            if (item.operationDptId === deptParentId) {
                deptName = item.operationDptName;
                children = item.childDptList || [];
            }
        });

        children.forEach(item => {
            if (item.operationDptId === deptmentId) {
                deptName = item.operationDptName;
            }
        });

        return <div
            className="condition_item"
            onClick={() => {
                setShowDeptModal(!showDeptModal);
                setShowAreaModal(false);
            }}
        >
            <span>{deptName}</span>
            {
                showDeptModal ?
                    <svg className="am-icon am-icon-up am-icon-xxs" color="#ccc">
                        <use href="#up"></use>
                    </svg> : <svg className="am-icon am-icon-down am-icon-xxs" color="#ccc">
                        <use href="#down"></use>
                    </svg>
            }
        </div>
    }, [deptmentId, deptList, showDeptModal, deptParentId]);

    const areaModal = useMemo(() => {
        if (!showAreaModal) {
            return null;
        }
        return <div className="modal_mask">
            <div className="rect" />
            {
                areaList.map(item => <div
                    key={item.initials + item.areaId}
                    className={`area_item ${item.areaId ? '' : 'area_item_mark'}`}
                    onClick={() => {
                        if (item.areaId) {
                            setDeptParentId(0);
                            setDeptmentId(0);
                            setAreaId(item.areaId);
                            setShowAreaModal(false);
                            onChange && onChange({
                                areaId: item.areaId,
                            });
                        }
                    }}
                >{item.areaName}</div>)
            }
        </div>;
    }, [showAreaModal, areaList]);

    const deptModal = useMemo(() => {
        if (!showDeptModal) {
            return null;
        }
        if (!deptList.length) {
            return <div className="modal_mask dept_mask_modal_box">
                <div className="empty_class">
                    <img src={`//cdn.myweimai.com/images/1309014684b50e07dfb64c40dc0b40d1_240x240.png`} />
                    <p>暂无数据</p>
                </div>
            </div>
        }
        let children = [];
        deptList.forEach(item => {
            if (item.operationDptId === deptParentId) {
                children = item.childDptList || [];
            }
        })
        return <div className="modal_mask dept_mask_modal_box">
            <div className="dept_parent">
                <div className="rect" />
                {
                    deptList.map(item => <div
                        key={item.operationDptId}
                        className={`dept_item ${item.operationDptId === deptParentId ? 'active' : ''}`}
                        onClick={() => {
                            setDeptParentId(item.operationDptId);
                        }}
                    >{item.operationDptName}</div>)
                }
            </div>
            <div className="dept_children">
                <div className="rect" />
                {
                    children.map(item => <div
                        key={item.operationDptId}
                        className={`dept_item ${item.operationDptId === deptmentId ? 'active' : ''}`}
                        onClick={() => {
                            setDeptmentId(item.operationDptId);
                            setShowDeptModal(false);
                            onChange && onChange({
                                departmentId: item.operationDptId,
                            });
                        }}
                    >{item.operationDptName}</div>)
                }
            </div>
        </div>;
    }, [showDeptModal, deptList, deptParentId, deptmentId]);

    return <div className="search_condition_box">
        {areaModal}
        {deptModal}
        <div className="search_bar_rect" />
        <div className="search_condition">
            {cityItem}
            {deptItem}
        </div>
    </div >
}