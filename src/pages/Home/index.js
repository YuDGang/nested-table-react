import NestedTable from "@/components/NestedTable";

const dataSource = [
	{
		"id": "000",
		"parentVersion": "1",
		"parentName": "标尺0",
		"innerList": [
			{
				"id": "000-0",
				"createUser": "admin",
				"long": "longlonglonglonglonglonglonglong"
			}, {
				"id": "000-1",
				"createUser": "admin",
				"long": "long"
			}, {
				"id": "000-2",
				"createUser": "admin",
				"long": "longlonglonglonglonglonglonglong"
			}
		]
	}, {
		"id": "001",
		"parentVersion": "1",
		"parentName": "标尺1",
		"innerList": [
			{
				"id": "001-0",
				"createUser": "admin"
			}
		]
	}
];

const columns = [
	{
		title: "标识",
		width: "300px",
		dataIndex: "id"
	}, {
		title: "版本",
		width: "300px",
		dataIndex: "parentVersion"
	}, {
		title: "名称",
		width: "300px",
		dataIndex: "parentName"
	}, {
		title: "操作",
		width: "200px",
		fixed: "right"
	}
];

const columnsInner = [
	{
		width: "300px",
		dataIndex: "id"
	}, {
		width: "300px"	// 空列给予宽度占位 以保证对齐
		// dataIndex: "createUser"
	}, {
		width: "300px",
		render: record => <>{record.parentProp.parentName}</>
	}, {
		title: "操作",
		width: "200px",
		fixed: "right"
	}
];

const expandRows = {
	rowKey: "id",
	columns: columnsInner,
	dataSourceIndex: "innerList",
	// withoutHead: true,
	insertFromParent: ["parentName", "parentVersion"]
};

export default () => {
	return (
		<>
			<NestedTable
				rowKey="id"
				columns={columns}
				dataSource={dataSource}
				expandRows={expandRows}
				scroll={{"x": "1100"}}
			/>
			<div style={{background: "red", width: "100px"}}>
			</div>
		</>
	);
};
