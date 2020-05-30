import { useMemo, useEffect, useState } from 'react';
import { getFamilyCustomerList } from '@services/module/descript';
import urlparams from '@utils/urlparams';

export default (props) => {

    const [data, setData] = useState([]);
    const [id, setId] = useState(urlparams.familyId);

    const getList = () => {
        getFamilyCustomerList({}).then(content => {
            if (!content.code) {
                setData(content.data || []);
            }
        })
    }

    useEffect(() => {
        getList();
    }, [])

    const list = useMemo(() => {
        return <div className="member_list">
            {
                data.map(item => {
                    if (id === item.customerId) {
                        props.onSelect && props.onSelect(item);
                    }
                    return <div
                        className={`member_item ${id === item.customerId ? 'active' : ''}`}
                        key={item.customerId}
                        onClick={() => {
                            setId(item.customerId);
                        }}
                    >{item.realName}</div>
                })
            }
            <div className="member_item add_item">+添加</div>
        </div>
    }, [data, id])

    return <div className="member_box">
        <div className="member_title">您要为谁咨询</div>
        {list}
    </div>
}