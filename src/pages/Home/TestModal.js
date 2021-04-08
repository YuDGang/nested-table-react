import { useEffect, useState } from "react";
import { Input, Select, message, Modal, Table } from "antd";
import VirtualSelect from "@/components/VirtualSelect";
import ComSelect from "./ComSelect";

const children = [];

for (let i = 0; i < 10000; i++) {
	children.push(
		<VirtualSelect.Option value={i} key={i}>
			{`测试${i}`}
		</VirtualSelect.Option>
	);
}

const HookModal = props => {
	const { visible, onCancel } = props;

	const onOk = () => { };
	const afterClose = () => { };

	const [data, setData] = useState([]);

	useEffect(() => {
		let arr = [];
		for (let i = 0; i < 100; i++) {
			arr.push({
				name: `测试${i}`
			});
		}
		setData(arr);

		return () => {
			setData([]);
		};
	}, []);

	const columns = [
		{
			title: "系统字段",
			dataIndex: "name",
			key: "name",
			render: (text, record, index) => {
				return (
					<VirtualSelect
						style={{ width: "250px" }}
						dropdownMatchSelectWidth={false}
						maxWidth={400}
						showSearch
						optionFilterProp="children"
						value={text ? text : undefined}
						title={text}
						onChange={(val) => changeField(val, index)}
					>
						{children}
					</VirtualSelect>
					// <ComSelect />
				);
			}
		}
	];

	const changeField = (val, index) => {
		let copyData = data.concat([]);
		copyData[index].name = val;
		setData(copyData);
	};

	return (
		<div className="hook-modal">
			<Modal
				title="HOOK弹窗"
				visible={visible}
				onOk={onOk}
				onCancel={onCancel}
				afterClose={afterClose}
			>
				<Table
					dataSource={data}
					columns={columns}
					rowKey="name"
				/>
			</Modal>
		</div>
	);
};

export default HookModal;
