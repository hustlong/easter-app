import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
    state: {
        token: getToken(),
        member: {}
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_MEMBER: (state, member) => {
            state.member = member
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    const data = response.data
                    const tokenStr = data.tokenHead+data.token
                    setToken(tokenStr)
                    commit('SET_TOKEN', tokenStr)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo().then(response => {
                    const data = response.data
                    commit('SET_MEMBER', data)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user