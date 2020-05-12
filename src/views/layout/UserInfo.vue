<template>
    <section v-loading="loading" class="user-info">
        <el-avatar
                :fit="'cover'"
                :src="icon"
                :size="80">
            {{nickname}}
        </el-avatar>
        <el-divider>基础信息</el-divider>
        <div>我的昵称：{{nickname}}</div>
        <div>我的签名：{{personalizedSignature}}</div>
        <div>性别：{{gender}}</div>
        <div>所在城市：{{city}}</div>
        <div>我的职业：{{job}}</div>
        <div>手机号码：{{phone}}</div>
        <div>生日：{{formatDateStr(birthday, 'yyyy-MM-dd')}}</div>

        <el-divider>注册信息</el-divider>
        <div>我是本站第 {{id-9}} 位注册用户</div>
        <div>注册于{{recentTime(createTime)}}</div>
        <div>注册日期： {{formatDateStr(createTime, 'yyyy-MM-dd hh:mm:ss')}}</div>
        <div>注册邮箱： {{email}}</div>
<!--        <div>注册账号： {{username}}</div>-->

        <el-divider>成就信息</el-divider>
        <div>我一共发送了 {{sendCount}} 条想法</div>
        <div>关注了 {{followCount}} 个用户，拥有 {{followerCount}} 个粉丝</div>
        <div>收到了 {{commentMeCount}} 条评论，发出 {{meCommentCount}} 条评论</div>
        <div>收藏了 {{meCollectCount}} 条想法，我的想法被收藏 {{collectMeCount}}次 </div>
        <div>一共登录了 {{loginCount}} 次 </div>
    </section>
</template>

<script>
    import {formatDate} from "@/utils/date"
    import {statistics} from "@/api/login";
    import {Message} from "element-ui";
    import {format} from "timeago.js";

    /**
     *   birthday: null
         city: "shenzhen"
         createTime: "2020-04-08T15:10:59.000+0000"
         email: "biglongcc@qq.com"
         gender: 1
         icon: "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2659970355,719899345&fm=26&gp=0.jpg"
         id: 10
         job: "student"
         nickname: "biglong"
         personalizedSignature: "走自己的路"
         phone: "17671650807"
         username: "long.yang"
     */
    export default {
        name: "UserInfo",
        data() {
            return {
                loading: true,
                // 用户信息
                icon: '',
                birthday: '',
                city: '',
                gender:'',
                job:'',
                nickname:'',
                personalizedSignature:'',
                phone:'',
                // unchangeable
                id:'',
                createTime: '',
                email:'',
                username:'',
                // statistics
                collectMeCount: 0,
                commentMeCount: 3,
                followCount: 1,
                followerCount: 2,
                loginCount: 28,
                meCollectCount: 0,
                meCommentCount: 3,
                sendCount: 16
            }
        },
        mounted() {
            this.$store.dispatch('GetInfo', this.loginForm).then(response => {
                const data = response.data
                this.icon = data.icon
                this.birthday = data.birthday
                this.city = data.city == null ? '未设置' : data.city
                this.gender = data.gender === 1 ? '男' : data.gender === 2 ? '女' : '未设置'
                this.job = data.job == null ? '未设置' : data.job
                this.nickname = data.nickname == null ? '未设置' : data.nickname
                this.personalizedSignature = data.personalizedSignature == null ? '一句话介绍自己吧' : data.personalizedSignature
                this.phone = data.phone == null ? '未设置' : data.phone
                this.id = data.id
                this.createTime = data.createTime
                this.email = data.email
                this.username = data.username
                // get statistics
                this.getStatistics(this.id)
            }).catch(error => {
                console.log("GetInfo->", error)
            })
        },
        methods: {
            recentTime(date) {
                return format(new Date(date), 'zh_CN');
            },
            getStatistics(userId) {
                statistics(userId).then(response => {
                    const data = response.data;
                    this.collectMeCount = data.collectMeCount == null ? 0 : data.collectMeCount
                    this.commentMeCount = data.commentMeCount == null ? 0 : data.commentMeCount
                    this.followCount = data.followCount == null ? 0 : data.followCount
                    this.followerCount = data.followerCount == null ? 0 : data.followerCount
                    this.loginCount = data.loginCount == null ? 0 : data.loginCount
                    this.meCollectCount = data.meCollectCount == null ? 0 : data.meCollectCount
                    this.meCommentCount = data.meCommentCount == null ? 0 : data.meCommentCount
                    this.sendCount = data.sendCount == null ? 0 : data.sendCount
                    // 加载完毕
                    this.loading = false
                }).catch(error => {
                    console.log("getStatistics->", error)
                    this.loading = false
                    // 用户信息加载失败
                    Message({
                        message: "用户信息加载失败，请尝试刷新",
                        type: 'error',
                        duration: 5 * 1000
                    })
                })
            },
            formatDateStr(datestr, fmt) {
                if (datestr === undefined || datestr == null || datestr === '') return '未设置'
                return formatDate(new Date(datestr), fmt)
            }
        }
    }
</script>

<style scoped>
    .user-info {
        margin-top: 16px;
        margin-bottom: 24px;
    }
</style>