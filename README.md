# Nested Table 嵌套表格

基于Ant3开发的嵌套表格，用于弥补`<Table>`中 `expandedRowRender = { return <Table> }` 时无法同时使用Column.fixed='right'的缺陷。

缺陷表现为表格整列消失、样式错乱等，参见官方提示：
``` javascript
(Warning: [antd: Table] `expandedRowRender` and `Column.fixed` are not compatible. Please use one of them at one time.)",
```
        
## 更新日志
- 1.0.9 删除部分依赖
- 1.0.8 修复了在同页面有两个及以上 NestedTable 且来回切换时宽度值互相干扰的问题;  
- 1.0.7 提升了兼容性;  
- 1.0.6 更名参数 insertFromRecord 为 insertFromParent ;  
- 1.0.4 性能优化;  
...

## API  
参数均同Ant3 Table，`expandedRowRender` 不可用，其余参数正常。 以下为新增参数
|      参数         |       说明          |    类型        |
|      ----         |        ----         |      ----      |
|   expandRows      |   内表格的配置描述，具体项见下表    | Object |
### expandRows
|      参数         |       说明                |    类型        |
|      ----         |        ----               |      ----      |
|  dataSourceIndex |   内表格的数据源索引         |   string      |
|  columns         |   为内表格配置其columns  |   columnsType[] |
|   rowKey          |   为内表格指定其rowKey  |   string      |
|   withoutHead     |   去除内表格的第一行数据，常用于内表格数据源的第一条与外表格当前行数据重复时  | boolean |
|   ~~insertFromRecord~~|   ~~已更改为insertFromParent~~  | ~~insertIndex["index0","index1"...]~~ | 
|   insertFromParent|   从**点击行的record**中获取并插入数据至**展开行的record**，并可以用record.parentProp访问，常用于内表格数据中缺少某些需要使用的当前行数据时  | insertIndex["index0","index1"...] | 
        
## 何时使用  
当需要指定表格的展开行仍为表格，且需要最右侧列固定时。
        
## 如何使用
* 数据源：将内表格数据源`dataSourceIndex`指定为外表格数据源`dataSource`中的相应索引；  
* 对　齐：为外表格和内表格分别指定其 `columns` ，为需要对齐的列指定相同宽度；
**若需要跨行或空行，将宽度转加在其他列**；  
* 固　定：**同时**为外表格和内表格的最右侧列配置 `Columns.fixed: "right"`， 并在外表格指定 `scroll`
        
## 代码演示
``` javascript
import NestedTable from "@tntx/nested-table";

const dataSource = [
	{
		"id": "000",
		"parentVersion": "1",
		"parentName": "标尺0",
		"innerList": [
			{
				"id": "000-0",
				"createUser": "admin"
			}, {
				"id": "000-1",
				"createUser": "admin"
			}, {
				"id": "000-2",
				"createUser": "admin"
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
		width: "300px"	// 空列给予宽度占位，以保证对齐
	}, {
		width: "300px",
		render: record => <>{record.parentProp.parentName}</>
	}, {
		title: "操作",
		width: "200px",
		fixed: "right",
		render: record => <a>操作</a>
	}
];

const expandRows = {
	rowKey: "id",
	columns: columnsInner,
	dataSourceIndex: "innerList",
	withoutHead: true,
	insertFromParent: ["parentName", "parentVersion"]
};

export default () => {
	return (
		<NestedTable
			rowKey="id"
			columns={columns}
			dataSource={dataSource}
			expandRows={expandRows}
			scroll={{"x": "1100"}}
		/>
	);
};
```
