<template>
    <div v-if="checkToken" class="app-wrapper" :class="classObj">
        <sidebar class="sidebar-container"></sidebar>
        <section class="main-container">
            <div class="main-title">
                <div v-if="!$route.meta.hasBack" style="display: flex">
                    <div style="min-width: 80%">{{$route.meta.title}}</div>
                    <el-button type="primary"
                               icon="el-icon-search"
                               @click="$router.push({path: '/searchuser'})"
                               round plain size="small">搜索</el-button>
                </div>
                <el-page-header  v-else @back="goBack" :content="$route.meta.title"></el-page-header>
            </div>
            <el-divider class="el-divider--horizontal"></el-divider>
            <keep-alive>
                <router-view v-if="!reloadFlag" :key="$route.name + $route.meta.id"></router-view>
            </keep-alive>
            <el-backtop ref="backtop"></el-backtop>
        </section>
        <right-sidebar class="right-sidebar-container" v-if="!ifMobile"></right-sidebar>
    </div>
</template>

<script>
    import { getToken } from '@/utils/auth'
    import Sidebar from "@/views/Sidebar";
    import ResizeMixin from './mixin/ResizeHandler'
    import RightSidebar from "@/views/RightSidebar";
    import { mapGetters } from 'vuex'
    import throttle from 'throttle-debounce/throttle';

    export default {
        name: "Home",
        components: {RightSidebar, Sidebar},
        mixins: [ResizeMixin],
        data() {
            return {
                checkToken: false
            }
        },
        created() {
            this.tokenStr = getToken();
            console.log("tokenStr: ", this.tokenStr)
            if (this.tokenStr === undefined || this.tokenStr.length !== 185) {
                this.$router.push({path: '/welcome'})
            } else {
                // 只要
                this.checkToken = true
            }
        },
        computed: {
            sidebar() {
                return this.$store.state.app.sidebar
            },
            device() {
                return this.$store.state.app.device
            },
            classObj() {
                return {
                    hideSidebar: !this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === 'mobile'
                }
            },
            ifMobile() {
                return this.device === 'mobile'
            },
            ...mapGetters([
                'reloadFlag'
            ])
        },
        mounted() {
            this.throttledScrollHandler = throttle(400, this.onScroll);
            this.el = document.documentElement
            document.addEventListener('scroll', this.throttledScrollHandler);
        },
        methods: {
            onScroll() {
                // 这里把滑动过的位置信息记录到相应的path信息里面
                const scrollTop = this.el.scrollTop;
                if (scrollTop !== undefined) {
                    this.$route.meta.scrollTop = scrollTop
                }
            },
            goBack() {
                this.$router.go(-1)
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .app-wrapper {
        height: 100%;
    }
    .main-title {
        font-size: 20px;
        color: black;
        text-align: left;
        margin: 16px;
    }
    .el-divider--horizontal {
        margin: 0;
    }
</style>