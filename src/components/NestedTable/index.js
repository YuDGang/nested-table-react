import { useState, useEffect, useRef } from "react";
import { Table } from "antd";
import { v1 as uuidv1 } from "uuid";
import "./index.less";

export default props => {
	const {
		expandRows,
		id,
		className,
		expandedRowKeys,
		onExpand,
		expandRowByClick
	} = props;

	const {
		dataSourceIndex,
		columns,
		rowKey,
		withoutHead,
		insertFromParent
	} = expandRows;

	const [ expandedRowKeysInner, setExpandedRowKeysInner ] = useState([]);

	let tableInnerRef = useRef();

	useEffect(() => {
		fixFixedRightCell();
		// in the listening
		addResizeListener();
		addScrollListener();

		return () => {
			fixFixedRightCell();
			window.removeEventListener("resize", syncWidth);
			window.removeEventListener("scroll", syncWidth);
		};
	}, [expandedRowKeys]);

	useEffect(() => {
		tableInnerRef.current = `uuid-${uuidv1()}`;
		Object.assign(tableInnerRef, {
			// fix width, similar to 'fixed:right'
			shiftWidth: 0, // 宽度偏移
			initialWidth: 0, // 内部表格 初始宽度 未scroll时宽度
			viewWidth: 0, // 内部表格 修正scroll偏移后端真实宽度
			rightWidth: 0, // 内部表格 右侧固定宽度
			// fix height, when right col empty data
			rowHeight: 0	// 行高 fixFixedRightCell();  syncHeight();
		});
	}, []);

	// 右侧单元格宽高
	const fixFixedRightCell = () => {
	// 右侧固定列[容器宽度]
		const rightCol = document.querySelector(`.${tableInnerRef.current} tbody.ant-table-tbody tr td:last-child`);
		const row = document.querySelector(`.${tableInnerRef.current} tbody.ant-table-tbody tr`);
		const innerRights = document.querySelectorAll(`.${tableInnerRef.current} .tntx-table-expand-fixed-inner .ant-table-fixed-right td`);
		tableInnerRef.rightWidth = rightCol?.offsetWidth;
		tableInnerRef.rowHeight = row?.offsetHeight;

		innerRights.forEach(innerRight => {
			innerRight.style.width = tableInnerRef.rightWidth + "px";
			innerRight.style.height = tableInnerRef.rowHeight + "px";
		});
	};

	// toFix：内部表格初始宽度(没有滚动时、无偏移的标准宽度)
	const getInitialWidth = () => {
	// 外部表格[容器宽度] ***为容器宽度， 在触发滚动后，真实宽度保持固定，容器宽度为用户视觉宽度
		const outerTable = document.querySelector(`.${tableInnerRef.current}`);
		// 行头展开Icon列[容器宽度]
		const expandCol = document.querySelector(`.${tableInnerRef.current} tbody.ant-table-tbody tr td`);
		tableInnerRef.initialWidth = outerTable?.offsetWidth - expandCol?.offsetWidth;
	};

	const getShiftWidth = () => {
	// 计算结果
		tableInnerRef.viewWidth = tableInnerRef.initialWidth + tableInnerRef.shiftWidth;
	};

	const syncWidth = () => {
	// 内部表格[真实宽度]，操作对象
		const innerTables = document.querySelectorAll(`.${tableInnerRef.current} .tntx-table-expand-fixed-inner`);
		getInitialWidth();
		getShiftWidth();

		innerTables.forEach(innerTable =>{
			innerTable.style.width = tableInnerRef.viewWidth + "px";
		});
	};

	// listener
	const addScrollListener = () => {
	document.querySelector(`.${tableInnerRef.current} .ant-table-scroll .ant-table-body`)?.addEventListener("scroll", (event)=>{
		tableInnerRef.shiftWidth = event.target.scrollLeft;
		syncWidth();
	}, true);
	};
	const addResizeListener = () => {
		window.addEventListener("resize", syncWidth);
	};

	const syncHeight = (rowNum) => {
		const height = rowNum * tableInnerRef.rowHeight;
		const innerRows = document.querySelectorAll(`.${tableInnerRef.current} .ant-table-expanded-row`);

		innerRows.forEach(item => {
			item.style.height = height + "px";
		});
	};

	// Table for expanding rows
	const expandedRowRender = (record, index, indent, expanded) => {
		let parentProp = {};	// insert from parent
		let dataSource = [];	// Ant Table dataSource (Inner)

		// made a insert Array
		insertFromParent.length &&
		insertFromParent.map(insert=> {
			parentProp[insert] = record?.[insert];
		});

		// finishing dataSource...
		const dataClone = record?.[dataSourceIndex]?.concat();
		// remove the first data ? yes : no		// why slice : cause it has an impact on the number of rows in the table
		dataSource = dataClone?.slice(withoutHead ? 1 : 0, dataClone.length).map(item=>(
			{
				...item,
				parentProp
			}
		));

		// fix width height
		expanded &&
				setTimeout(()=>{
					fixFixedRightCell();
					syncWidth();
					syncHeight(dataSource?.length);
				}, 0);

		// when 'dataSource === []'
		if (!dataSource?.length) {
			return <p>暂无更多</p>;
		}

		return (
			<Table
				id = "tntx-table-expand-fixed-inner"
				className = "tntx-table-expand-fixed-inner"
				rowKey = {rowKey && rowKey}
				columns = {columns && columns}
				dataSource = {dataSource && dataSource}
				showHeader = {false}
				pagination = {false}
			/>
		);
	};

	const updateExpandedRowKeys = (record) => {
		let idArray = [];
		if (expandedRowKeysInner[0] !== record?.id) {
			idArray = record.id ? [record.id] : [];
		};
		setExpandedRowKeysInner(idArray);
	};

	const handleOnExpand = (expended, record) => {
		// if since from the second data
		if (withoutHead) {
			if (record?.[dataSourceIndex]?.length <= 1) return;
		}
		updateExpandedRowKeys(record);
		onExpand && onExpand(expended, record);
	};

	const expandIcon = (props) => {
		const { record } = props;
		// Icon or not ?
		if ((withoutHead && record?.[dataSourceIndex]?.length <= 1) ||
		record?.[dataSourceIndex]?.length < 1) {
			return (
				<div class="ant-table-row-expand-icon ant-table-row-collapsed ant-table-row-disabled" role="button" tabindex="0" aria-label="展开行">
				</div>
			);
		};
		if (props.expanded) {
			return (
				<div class="ant-table-row-expand-icon ant-table-row-expanded" role="button" tabindex="0" aria-label="展开行">
				</div>
			);
		} else {
			return (
				<div class="ant-table-row-expand-icon ant-table-row-collapsed" role="button" tabindex="0" aria-label="展开行">
				</div>
			);
		}
	};

	return (
		<Table
			{...props}
			id = {id}
			className = {`${className ? className : ""} tntx-table-expand-fixed ${tableInnerRef.current}`}
			expandedRowKeys = {expandedRowKeys || expandedRowKeysInner}
			expandedRowRender = {expandedRowRender}
			onExpand = {(expended, record) => handleOnExpand(expended, record)}
			expandIcon = {(record) => expandIcon(record)}
			expandRowByClick = {expandRowByClick !== false}
		/>
	);
};
