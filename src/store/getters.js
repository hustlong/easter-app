const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    member: state => state.user.member,
    reloadFlag: state => state.app.reloadFlag
}
export default getters