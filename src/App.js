import "./index.less";
import React from "react";
import { init } from "@rematch/core"; // redux最佳实践
import * as models from "./models";
import { Route, Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history"; // 设置路由history模式
import { ConfigProvider } from "antd";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from "antd/es/locale/zh_CN";
import { routes } from "./router";
import Error from "@/pages/Error"; // 404页面

// 组装各个路由的model
let modelObj = {};
routes.forEach(item => {
	if (item.model) {
		modelObj = {
			...modelObj,
			...item.model
		};
	}
});
for (let k in modelObj) {
	models[k] = modelObj[k];
}
const store = init({
	models
});

const history = createBrowserHistory();

const { dispatch } = store;
window.dispatch = dispatch;

class App extends React.Component {

	render() {
		return (
			<ConfigProvider locale={zhCN}>
				<Provider store={store}>
					<Router history={history}>
						<Switch>
							{
								routes.map(route => (
									<Route key={route.path} path={route.path} component={route.component} exact={route.exact} />
								))
							}
							<Route component={Error} />
						</Switch>
					</Router>
				</Provider>
			</ConfigProvider>
		);
	}
}

export default App;
