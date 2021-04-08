"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

require("antd/es/table/style");

var _table = _interopRequireDefault(require("antd/es/table"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _uuid = require("uuid");

require("./index.less");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _default = function _default(props) {
  var expandRows = props.expandRows,
      id = props.id,
      className = props.className,
      expandedRowKeys = props.expandedRowKeys,
      onExpand = props.onExpand,
      expandRowByClick = props.expandRowByClick;
  var dataSourceIndex = expandRows.dataSourceIndex,
      columns = expandRows.columns,
      rowKey = expandRows.rowKey,
      withoutHead = expandRows.withoutHead,
      insertFromParent = expandRows.insertFromParent;

  var _useState = (0, _react.useState)([]),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      expandedRowKeysInner = _useState2[0],
      setExpandedRowKeysInner = _useState2[1];

  var tableInnerRef = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    fixFixedRightCell(); // in the listening

    addResizeListener();
    addScrollListener();
    return function () {
      fixFixedRightCell();
      window.removeEventListener("resize", syncWidth);
      window.removeEventListener("scroll", syncWidth);
    };
  }, [expandedRowKeys]);
  (0, _react.useEffect)(function () {
    tableInnerRef.current = "uuid-".concat((0, _uuid.v1)());
    Object.assign(tableInnerRef, {
      // fix width, similar to 'fixed:right'
      shiftWidth: 0,
      // 宽度偏移
      initialWidth: 0,
      // 内部表格 初始宽度 未scroll时宽度
      viewWidth: 0,
      // 内部表格 修正scroll偏移后端真实宽度
      rightWidth: 0,
      // 内部表格 右侧固定宽度
      // fix height, when right col empty data
      rowHeight: 0 // 行高 fixFixedRightCell();  syncHeight();

    });
  }, []); // 右侧单元格宽高

  var fixFixedRightCell = function fixFixedRightCell() {
    // 右侧固定列[容器宽度]
    var rightCol = document.querySelector(".".concat(tableInnerRef.current, " tbody.ant-table-tbody tr td:last-child"));
    var row = document.querySelector(".".concat(tableInnerRef.current, " tbody.ant-table-tbody tr"));
    var innerRights = document.querySelectorAll(".".concat(tableInnerRef.current, " .tntx-table-expand-fixed-inner .ant-table-fixed-right td"));
    tableInnerRef.rightWidth = rightCol === null || rightCol === void 0 ? void 0 : rightCol.offsetWidth;
    tableInnerRef.rowHeight = row === null || row === void 0 ? void 0 : row.offsetHeight;
    innerRights.forEach(function (innerRight) {
      innerRight.style.width = tableInnerRef.rightWidth + "px";
      innerRight.style.height = tableInnerRef.rowHeight + "px";
    });
  }; // toFix：内部表格初始宽度(没有滚动时、无偏移的标准宽度)


  var getInitialWidth = function getInitialWidth() {
    // 外部表格[容器宽度] ***为容器宽度， 在触发滚动后，真实宽度保持固定，容器宽度为用户视觉宽度
    var outerTable = document.querySelector(".".concat(tableInnerRef.current)); // 行头展开Icon列[容器宽度]

    var expandCol = document.querySelector(".".concat(tableInnerRef.current, " tbody.ant-table-tbody tr td"));
    tableInnerRef.initialWidth = (outerTable === null || outerTable === void 0 ? void 0 : outerTable.offsetWidth) - (expandCol === null || expandCol === void 0 ? void 0 : expandCol.offsetWidth);
  };

  var getShiftWidth = function getShiftWidth() {
    // 计算结果
    tableInnerRef.viewWidth = tableInnerRef.initialWidth + tableInnerRef.shiftWidth;
  };

  var syncWidth = function syncWidth() {
    // 内部表格[真实宽度]，操作对象
    var innerTables = document.querySelectorAll(".".concat(tableInnerRef.current, " .tntx-table-expand-fixed-inner"));
    getInitialWidth();
    getShiftWidth();
    innerTables.forEach(function (innerTable) {
      innerTable.style.width = tableInnerRef.viewWidth + "px";
    });
  }; // listener


  var addScrollListener = function addScrollListener() {
    var _document$querySelect;

    (_document$querySelect = document.querySelector(".".concat(tableInnerRef.current, " .ant-table-scroll .ant-table-body"))) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.addEventListener("scroll", function (event) {
      tableInnerRef.shiftWidth = event.target.scrollLeft;
      syncWidth();
    }, true);
  };

  var addResizeListener = function addResizeListener() {
    window.addEventListener("resize", syncWidth);
  };

  var syncHeight = function syncHeight(rowNum) {
    var height = rowNum * tableInnerRef.rowHeight;
    var innerRows = document.querySelectorAll(".".concat(tableInnerRef.current, " .ant-table-expanded-row"));
    innerRows.forEach(function (item) {
      item.style.height = height + "px";
    });
  }; // Table for expanding rows


  var expandedRowRender = function expandedRowRender(record, index, indent, expanded) {
    var _record$dataSourceInd, _dataSource2;

    var parentProp = {}; // insert from parent

    var dataSource = []; // Ant Table dataSource (Inner)
    // made a insert Array

    insertFromParent.length && insertFromParent.map(function (insert) {
      parentProp[insert] = record === null || record === void 0 ? void 0 : record[insert];
    }); // finishing dataSource...

    var dataClone = record === null || record === void 0 ? void 0 : (_record$dataSourceInd = record[dataSourceIndex]) === null || _record$dataSourceInd === void 0 ? void 0 : _record$dataSourceInd.concat(); // remove the first data ? yes : no		// why slice : cause it has an impact on the number of rows in the table

    dataSource = dataClone === null || dataClone === void 0 ? void 0 : dataClone.slice(withoutHead ? 1 : 0, dataClone.length).map(function (item) {
      return _objectSpread({}, item, {
        parentProp: parentProp
      });
    }); // fix width height

    expanded && setTimeout(function () {
      var _dataSource;

      fixFixedRightCell();
      syncWidth();
      syncHeight((_dataSource = dataSource) === null || _dataSource === void 0 ? void 0 : _dataSource.length);
    }, 0); // when 'dataSource === []'

    if (!((_dataSource2 = dataSource) !== null && _dataSource2 !== void 0 && _dataSource2.length)) {
      return React.createElement("p", null, "\u6682\u65E0\u66F4\u591A");
    }

    return React.createElement(_table["default"], {
      id: "tntx-table-expand-fixed-inner",
      className: "tntx-table-expand-fixed-inner",
      rowKey: rowKey && rowKey,
      columns: columns && columns,
      dataSource: dataSource && dataSource,
      showHeader: false,
      pagination: false
    });
  };

  var updateExpandedRowKeys = function updateExpandedRowKeys(record) {
    var idArray = [];

    if (expandedRowKeysInner[0] !== (record === null || record === void 0 ? void 0 : record.id)) {
      idArray = record.id ? [record.id] : [];
    }

    ;
    setExpandedRowKeysInner(idArray);
  };

  var handleOnExpand = function handleOnExpand(expended, record) {
    // if since from the second data
    if (withoutHead) {
      var _record$dataSourceInd2;

      if ((record === null || record === void 0 ? void 0 : (_record$dataSourceInd2 = record[dataSourceIndex]) === null || _record$dataSourceInd2 === void 0 ? void 0 : _record$dataSourceInd2.length) <= 1) return;
    }

    updateExpandedRowKeys(record);
    onExpand && onExpand(expended, record);
  };

  var _expandIcon = function expandIcon(props) {
    var _record$dataSourceInd3, _record$dataSourceInd4;

    var record = props.record; // Icon or not ?

    if (withoutHead && (record === null || record === void 0 ? void 0 : (_record$dataSourceInd3 = record[dataSourceIndex]) === null || _record$dataSourceInd3 === void 0 ? void 0 : _record$dataSourceInd3.length) <= 1 || (record === null || record === void 0 ? void 0 : (_record$dataSourceInd4 = record[dataSourceIndex]) === null || _record$dataSourceInd4 === void 0 ? void 0 : _record$dataSourceInd4.length) < 1) {
      return React.createElement("div", {
        "class": "ant-table-row-expand-icon ant-table-row-collapsed ant-table-row-disabled",
        role: "button",
        tabindex: "0",
        "aria-label": "\u5C55\u5F00\u884C"
      });
    }

    ;

    if (props.expanded) {
      return React.createElement("div", {
        "class": "ant-table-row-expand-icon ant-table-row-expanded",
        role: "button",
        tabindex: "0",
        "aria-label": "\u5C55\u5F00\u884C"
      });
    } else {
      return React.createElement("div", {
        "class": "ant-table-row-expand-icon ant-table-row-collapsed",
        role: "button",
        tabindex: "0",
        "aria-label": "\u5C55\u5F00\u884C"
      });
    }
  };

  return React.createElement(_table["default"], (0, _extends2["default"])({}, props, {
    id: id,
    className: "".concat(className ? className : "", " tntx-table-expand-fixed ").concat(tableInnerRef.current),
    expandedRowKeys: expandedRowKeys || expandedRowKeysInner,
    expandedRowRender: expandedRowRender,
    onExpand: function onExpand(expended, record) {
      return handleOnExpand(expended, record);
    },
    expandIcon: function expandIcon(record) {
      return _expandIcon(record);
    },
    expandRowByClick: expandRowByClick !== false
  }));
};

exports["default"] = _default;