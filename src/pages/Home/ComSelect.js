
import React, { PureComponent } from "react";
import { Select } from "antd";

const children = [];

for (let i = 0; i < 10000; i++) {
	children.push(
		<Select.Option value={i} key={i}>
			{`测试${i}`}
		</Select.Option>
	);
}

export default class ComSelect extends PureComponent {
	constructor(props) {
		super(props);
		console.time("commonselect");
	}

	componentDidMount() {
		console.log("结果==");
		console.timeEnd("commonselect");
	}

	render() {
		return (
			<Select
				style={{ width: "250px" }}
				dropdownMatchSelectWidth={false}
				showSearch
				optionFilterProp="children"
			>
				{children}
			</Select>
		);
	}
}
