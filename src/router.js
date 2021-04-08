import Loadable from "react-loadable";
import Home from "@/pages/Home/model";

const Loading = ({ isLoading, error }) => {
	if (isLoading) {
		// return <div>Loading...</div>;
		return null;
	} else if (error) {
		return <div>Sorry, there was a problem loading the page.</div>;
	} else {
		return null;
	}
};

const dynamic = (loader) => {
	return Loadable({
		loader,
		loading: Loading
	});
};

export const routes = [
	{
		path: "/",
		exact: true,
		component: dynamic(() => import("@/pages/Home")),
		model: { home: Home }
	},
	{
		path: "/page1",
		component: dynamic(() => import("@/pages/Page1"))
	}
];
