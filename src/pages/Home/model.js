export default {
	state: {
		homeCount: 1
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
