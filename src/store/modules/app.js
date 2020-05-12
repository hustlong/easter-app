import Cookies from 'js-cookie'

const app = {
    state: {
        sidebar: {
            opened: !+Cookies.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop',
        reloadFlag: true
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
            state.sidebar.opened = !state.sidebar.opened
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 1)
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
        },
        OPEN_SIDEBAR: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 0)
            state.sidebar.opened = true
            state.sidebar.withoutAnimation = withoutAnimation
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
        SET_RELOAD_FLAG: (state, flag) => {
            state.reloadFlag = flag
        }
    },
    actions: {
        ToggleSideBar: ({ commit }) => {
            commit('TOGGLE_SIDEBAR')
        },
        CloseSideBar({ commit }, { withoutAnimation }) {
            commit('CLOSE_SIDEBAR', withoutAnimation)
        },
        OpenSideBar({ commit }, { withoutAnimation }) {
            commit('OPEN_SIDEBAR', withoutAnimation)
        },
        ToggleDevice({ commit }, device) {
            commit('TOGGLE_DEVICE', device)
        },
        SetReloadFlag({ commit }, flag) {
            commit('SET_RELOAD_FLAG', flag)
        }
    }
}

export default app