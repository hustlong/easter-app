import store from '@/store'
import el from "element-ui/src/locale/lang/el";

const { body } = document
const WIDTH = 1024
const RATIO = 3

export default {
    watch: {
        // $route(route) {
        //     if (this.device === 'mobile' && this.sidebar.opened) {
        //         store.dispatch('CloseSideBar', { withoutAnimation: false })
        //     }
        // }
    },
    beforeMount() {
        window.addEventListener('resize', this.resizeHandler)
        this.resizeHandler()
    },
    mounted() {
        // const isMobile = this.isMobile()
        // if (isMobile) {
        //     store.dispatch('ToggleDevice', 'mobile')
        //     store.dispatch('CloseSideBar', { withoutAnimation: true })
        // }
    },
    methods: {
        isMobile() {
            const rect = body.getBoundingClientRect()
            return rect.width - RATIO < WIDTH
        },
        resizeHandler() {
            if (!document.hidden) {
                const isMobile = this.isMobile()
                const originSate = this.device === 'mobile'

                if (isMobile !== originSate) {
                    console.log("尺寸改变：isMobile=", isMobile)
                    store.dispatch('ToggleDevice', isMobile ? 'mobile' : 'desktop')
                    if (isMobile) {
                        store.dispatch('CloseSideBar', { withoutAnimation: true })
                    } else {
                        store.dispatch('OpenSideBar', { withoutAnimation: true })
                    }
                }
            }
        }
    }
}