import { useMemo, useState, useEffect } from 'react';
import ossprocess from '@utils/ossprocess';
import route from '@route';
import Upload from '@utils/uploadFileToOSS';
import { baseURL } from '@services/config.js';
import urlparams from '@utils/urlparams';

import { repuestConsultStatus } from '@services/module/chat';

let mesEle = {};

const domain = `//${urlparams.domain || location.host}`;

export default (props) => {
	const [showInfo, setShowInfo] = useState(true);
	const [showBtn, setShowBtn] = useState(false);
	const [showTool, setShowTool] = useState(false);
	const { order = {}, endTips = [], buttons = [] } = props.data;

	useEffect(() => {
		const ele = document.getElementsByClassName('message_list');
		if (ele.length) {
			ele[0].addEventListener('click', (e) => {
				setShowTool(false);
			})
		}
	}, []);

	const getConsultStatus = async () => {
		const { doctor = {}, customer = {} } = props.data;

		repuestConsultStatus({
			doctorUserId: urlparams.doctorUserId,
			customerRegId: customer.customerRegId,
		}).then(({ code, data }) => {
			if (!code) {
				switch (data.adviceStatus) {
					case 2: {
						// const { confirmMsg, serviceDetailId } = JSON.parse(data.relatedData);
						// this.confirmModal(confirmMsg, serviceDetailId);
						break;
					}
					case 3: { // 服务中间页
						const { employeeId } = JSON.parse(data.relatedData);
						route.push(`${domain}/open/local_health.html?id=${employeeId}`)
						break;
					}
					case 4: { // 医生主页
						const { employeeId } = JSON.parse(data.relatedData);
						route.push(`${domain}/open/doctor_home.html?id=${employeeId}`);
						break;
					}
					case 5: {
						route.push(`${domain}/open/select_doctor.html`);
						break;
					}
					case 12: {
						const { businessId } = JSON.parse(data.relatedData);
						route.push(`${domain}/open/situation_desc.html?orderId=${businessId}`);
						break;
					}
				}
			}
		})
	}

	const placeholder = useMemo(() => {
		if (showInfo) {
			return <span className="placeholder">请输入你的内容</span>;
		}
	}, [showInfo]);

	const btn = useMemo(() => {
		if (showBtn) {
			return <button
				onClick={() => {
					const message = (mesEle.innerText || '').trim();
					mesEle.innerText = '';
					setShowInfo(true);
					setShowTool(false);
					setShowBtn(false);
					if (message) {
						props.IM.sendMessage({ content: message });
					}
				}}
			>发送</button>;
		}
		return <img
			src={ossprocess.optimizationImg(
				'//cdn.myweimai.com/images/5adf00440f825b5e5ea202fcd64164da_60x60.png',
				{ resize: `w_${30}` }
			)}
			onClick={() => {
				setShowTool(!showTool);
			}}
		/>;
	}, [showBtn, showTool]);

	const tools = useMemo(() => {
		if (showTool) {
			return <div className="tools_part">
				<div
					className="tool_item"
				>
					<img
						src={ossprocess.optimizationImg(
							'//cdn.myweimai.com/images/d6e7fc723f3f90634858c1e383a30def_120x120.png',
							{ resize: `w_${60}` }
						)}
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
									props.IM.sendMessage({
										type: 'images',
										imageUrl: fileList[0].url
									});
									setShowTool(false);
								}
							);
						}}
					/>
					<p>图片</p>
				</div>
			</div>
		}
	}, [showTool])

	if ([1].includes(order.statusCode)) {
		return <div
			className="footer_part"
		>
			<div className="main_part">
				<div
					className="input_part"
				>
					{placeholder}
					<div
						contentEditable={true}
						className="message_input"
						ref={c => mesEle = c}
						onFocus={() => {
							setShowInfo(false);
						}}
						onBlur={() => {
							const message = mesEle.innerText;
							if (!message) {
								setShowInfo(true);
							}
						}}
						onInput={() => {
							const message = mesEle.innerText;
							if (message && !showBtn) {
								setShowBtn(true);
							} else if (!message && showBtn) {
								setShowBtn(false);
							}
						}}
					/>
				</div>
				<div className="opear_part">
					{btn}
				</div>
			</div>
			{tools}
		</div>
	} else if ([2, 3].includes(order.statusCode)) {
		return <div className="footer_part">
			{
				endTips[0] ? <div className="chat_status_tips">
					{endTips[0]}
				</div> : null
			}
			<div className="btn_list">
				{
					buttons.map(({ mode, content, type, parameter }, idx) => <div
						key={idx}
						className={`btn_item ${[0, 27].includes(mode) ? 'btn_item disabled' : ''}`}
						onClick={() => {
							if (mode === 22) { // 跳转首页
								route.push(`${domain}/open/select_doctor.html`);
								return;
							} else if (mode === 99) { // 病情描述
								const { businessId } = JSON.parse(parameter);
								route.push(`${domain}/open/situation_desc.html?orderId=${businessId}`);
								return;
							} else if (type === 3) { // 跳转至导诊台，帮助中心
								route.push(`${domain}/open/help_questions.html`);
							} else if (type === 2) { // 下一步
								// const { employeeId } = JSON.parse(parameter);
								getConsultStatus();
							} else if ([0, 27].includes(mode)) { // 送心意
								route.push(`${domain}/open/select_doctor.html`);
								// location.href = `${this.domain}${getPageUrl('doctor_home')}?id=${doctor.employeeId}`;
							} else { // 跳转医生主页
								const { employeeId } = JSON.parse(parameter);
								route.push(`${domain}/open/doctor_home.html?id=${employeeId}`);
							}
						}}
					>{content}</div>)
				}
			</div>
		</div>
	} else {
		return null;
	}
}