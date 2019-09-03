export default {
    namespace: 'global',

    state: {
        loading: false
    },

    reducers: {
        loading(state, { status = false }) {
            return { ...state, loading: status };
        }
    }
};
