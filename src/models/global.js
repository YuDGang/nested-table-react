export default {
	state: {
		count: 0
	},
	effects: {

	},
	reducers: {
		updateState(state, action) {
			return {
				...state,
				...action
			};
		}
	}
};
