
import { useMemo, useState } from 'react';
import Upload from '@utils/uploadFileToOSS';
import ossprocess from '@utils/ossprocess';
import { baseURL } from '@services/config.js';

const list = [];

export default (props) => {

    const [key, setKey] = useState([]);

    return <div className="upload_box">
        <div
            className="upload_title"
            onClick={() => {
                new Upload(
                    {
                        getConfigUrl: `${baseURL}open-middle/contentcenter/api/oss/signature/generate`,
                        businessType: '00108',
                        uploadTerminal: '2',
                        type: 'image',
                        maxLength: 1,
                        beforeUpload: files => {
                            let sizes = 0;
                            files.forEach(file => {
                                sizes += file.size || 0;
                            });
                            if (30000 * 1000 < sizes) {
                                message.error('文件最大上传30MB');
                                return false;
                            }
                        },
                        ratio: 0.95, //图片质量
                    },
                    content => {
                        const { fileList } = content;
                        list.push(...fileList);
                        setKey(Math.random());
                        props.onChange && props.onChange(list);
                    }
                );
            }}
        >上传图片</div>
        {
            useMemo(() => {
                return <div className="image_list">
                    {
                        list.map((item, idx) => <div className="image_item" key={item.index}>
                            <img src={ossprocess.optimizationImg(
                                item.url,
                                { resize: `w_${60}` }
                            )} />
                            <span
                                className="delete"
                                onClick={() => {
                                    list.splice(idx, 1);
                                    setKey(Math.random());
                                    props.onChange && props.onChange(list);
                                }}
                            />
                        </div>)
                    }
                </div>
            }, [key])
        }
        <hr />
    </div>
}