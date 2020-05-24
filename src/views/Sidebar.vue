<template>
    <scroll-bar>
        <el-menu
                v-loading="loading"
                :default-active="$route.path"
                 @select="handleMenuSelect"
                 :collapse="isCollapse">
            <a :href="publicPath" style="margin-top: 32px; margin-bottom: 32px"  ref="empty">
                <svg-icon icon-class="easter-logo" style="width: 40px;height: 40px; color: #42b983"></svg-icon>
            </a>
            <el-menu-item index="/home">
                <i class="el-icon-s-home"></i>
                <span slot="title">科研动态</span>
            </el-menu-item>
            <el-menu-item index="/myblog">
                <i class="el-icon-orange"></i>
                <span slot="title">我的主页 ({{sendCount}})</span>
            </el-menu-item>
            <el-menu-item index="/commentme">
                <i class="el-icon-chat-line-round"></i>
                <span slot="title">评论我的 ({{commentMeCount}})</span>
            </el-menu-item>
            <el-menu-item index="/mycomment">
                <i class="el-icon-chat-round"></i>
                <span slot="title">我的评论 ({{meCommentCount}})</span>
            </el-menu-item>
            <el-menu-item index="/myfollow">
                <i class="el-icon-user"></i>
                <span slot="title">我的关注 ({{followCount}})</span>
            </el-menu-item>
            <el-menu-item index="/myfollower">
                <i class="el-icon-star-off"></i>
                <span slot="title">我的粉丝 ({{followerCount}})</span>
            </el-menu-item>
            <el-menu-item index="/mycollect">
                <i class="el-icon-collection-tag"></i>
                <span slot="title">我的收藏 ({{meCollectCount}})</span>
            </el-menu-item>
            <el-submenu index="/settings">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>设置中心</span>
                </template>
                <el-menu-item index="/settings/userinfo">
                    <i class="el-icon-s-custom"></i>
                    <span slot="title">用户信息</span>
                </el-menu-item>
                <el-menu-item index="/settings/userinfo-update">
                    <i class="el-icon-edit"></i>
                    <span slot="title">修改信息</span>
                </el-menu-item>
                <el-menu-item index="/settings/password-update">
                    <i class="el-icon-view"></i>
                    <span slot="title">修改密码</span>
                </el-menu-item>
                <el-menu-item index="/settings/login-log">
                    <i class="el-icon-date"></i>
                    <span slot="title">登录日志</span>
                </el-menu-item>
            </el-submenu>

            <el-divider></el-divider>
            <div @click="handleMenuSelect('/settings/userinfo')">
                <el-avatar
                        :src="avatar"
                        :alt="nickname">
                    {{nickname}}
                </el-avatar>
            </div>
            <div v-show="!isCollapse">
                <span class="el-page-header__title" id="nickname">{{nickname}}</span>
                <span class="el-textarea">{{mail}}</span>
                <span class="el-textarea">{{yourwords}}</span>
            </div>
            <el-divider></el-divider>
            <el-button @click.native.prevent="handleLogout" round type="primary" :size="isCollapse?'mini':'medium'">
                退出
            </el-button>
        </el-menu>
    </scroll-bar>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { removeToken } from '@/utils/auth'
    import { statistics } from '@/api/login'
    import ScrollBar from "@/components/ScrollBar/index";
    import { Message } from 'element-ui'

    import {publicPath} from '../../vue.config'

    export default {
        name: "Sidebar",
        components: {ScrollBar},
        computed: {
            ...mapGetters([
                'sidebar','reloadFlag'
            ]),
            isCollapse() {
                return !this.sidebar.opened
            }
        },
        data() {
            return {
                loading: true,
                sendCount: 0,
                commentMeCount: 0,
                meCommentCount: 0,
                followCount: 0,
                followerCount: 0,
                meCollectCount: 0,
                avatar:'',
                nickname: '用户昵称',
                mail: '...@...',
                yourwords: '一句话介绍自己吧',
            }
        },
        mounted() {
            // 设置为loading状态，同时隐藏右侧 AppMain 部分
            this.loading = true
            this.$store.dispatch('SetReloadFlag', true)
            // 发起请求
            this.$store.dispatch('GetInfo', this.loginForm).then(response => {
                const data = response.data;
                if (data !== undefined) {
                    if (data.nickname !== undefined && data.nickname !== '') {
                        this.nickname = data.nickname
                    }
                    if (data.personalizedSignature !== undefined && data.personalizedSignature !== '') {
                        this.yourwords = data.personalizedSignature
                    }
                    this.avatar = data.icon
                    console.log("this.avatar = ", this.avatar)
                    this.mail = data.email;
                    if (data.id >= 10) {
                        this.getStatistics(data.id)
                    }
                }
            }).catch(error => {
                console.log("GetInfo->", error)
            })
        },
        methods: {
            handleLogout() {
                removeToken();
                this.$router.push({path: '/welcome'})
            },
            getStatistics(userId) {
                statistics(userId).then(response => {
                    const data = response.data;
                    this.sendCount = data.sendCount == null ? 0 : data.sendCount;
                    this.commentMeCount = data.commentMeCount == null ? 0 : data.commentMeCount;
                    this.meCommentCount = data.meCommentCount == null ? 0 : data.meCommentCount;
                    this.followCount = data.followCount == null ? 0 : data.followCount;
                    this.followerCount = data.followerCount == null ? 0 : data.followerCount;
                    this.meCollectCount = data.meCollectCount == null ? 0 : data.meCollectCount;
                    // 加载完毕
                    this.loading = false
                    this.$store.dispatch('SetReloadFlag', false)
                }).catch(error => {
                    console.log("sidebar->", error)
                    this.loading = false
                    // 用户信息加载失败
                    Message({
                        message: "用户信息加载失败，请尝试刷新",
                        type: 'error',
                        duration: 5 * 1000
                    })
                })
            },
            handleMenuSelect(indexPath) {
                console.log("indexPath=",indexPath)
                if ((this.$route.path === indexPath)) {
                    this.$route.meta.id = this.$route.meta.id+1
                    this.$store.dispatch('SetReloadFlag', true)
                    this.$nextTick(() => {
                        this.$store.dispatch('SetReloadFlag', false)
                        // this.$parent.$refs.backtop.scrollToTop()
                    })
                } else {
                    this.$router.push({path: indexPath})
                }
                // 尝试消除 el-menu 的 popover
                setTimeout(()=>{
                    // this.$refs.empty.focus()
                    this.$refs.empty.focus()
                }, 800)
            }
        }
    }
</script>

<style scoped>

</style>