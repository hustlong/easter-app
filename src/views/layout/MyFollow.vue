<template>
    <div>
        <section v-loading="loading">
            <div v-for="pojo of followList" :key="pojo.followTime">
                <el-row style="padding-top: 20px">
                    <el-col :span="4">
                        <div  @click="$router.push({path: '/userhome/'+pojo.id})">
                            <el-avatar
                                    :size="40"
                                    :src="pojo.icon"
                                    :alt="pojo.nickname">
                                {{pojo.nickname==null ? pojo.username:pojo.nickname}}
                            </el-avatar>
                        </div>
                    </el-col>
                    <el-col :span="20" class="timeline-item">
                        <el-row type="flex">
                            <div style="font-weight:bold;">{{pojo.nickname==null ? '未设置昵称':pojo.nickname}}</div>
                            <div style="margin-left: 14px; color: grey">{{pojo.username}}</div>
                            <svg-icon icon-class="gender" style="width: 20px;height: 20px;"
                                      :class="pojo.gender===1?'gender-1-boy':pojo.gender===2?'gender-2-girl':'gender-0'"></svg-icon>
                        </el-row>
                        <el-row type="flex">
                            <div style="color: grey; font-size: 14px; margin-top: 4px;">
                                {{recentTime(pojo.followTime)}}关注{{pojo.gender===1?'他':pojo.gender===2?'她':'TA'}}</div>
                            <el-button
                                    type="text"
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="confirmUnfollow(pojo.id)"
                                    round>取消关注</el-button>
                        </el-row>
                        <el-row type="flex" class="timeline-item-title">
                            <div style="color: grey">{{pojo.job}}</div>
                            <div style="color: grey; margin-left: 8px;">{{pojo.city}}</div>
                        </el-row>
                        <div style="color: grey">{{pojo.personalizedSignature}}</div>
                        <el-divider class="my-divider-no-botoom"></el-divider>
                    </el-col>
                </el-row>
            </div>
        </section>
        <div class="pageBtn">
            <el-pagination
                    background
                    :disabled="loading"
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :page-size="size"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {format} from "timeago.js";
    import {followList, unfollow} from "@/api/follow";
    import {MessageBox} from "element-ui";

    export default {
        name: "MyFollow",
        data() {
            return {
                memberId: this.$store.state.user.member.id,
                loading: true,
                total: 0,
                cur: 0,
                size: 0,
                followList: [],
            }
        },
        methods: {
            recentTime(date) {
                return format(new Date(date), 'zh_CN');
            },
            getFollow(page) {
                this.loading = true
                followList(this.memberId, page).then( response => {
                    console.log(response.data)
                    this.size = response.data.pageSize
                    this.cur = response.data.pageNum
                    this.total = response.data.total
                    this.followList = response.data.list
                    this.loading = false
                }).catch(err => {
                    console.log("followList => ", err)
                    this.loading = false
                    this.$message({
                        message: "加载失败:"+err.response.data.message,
                        type: 'error',
                        duration: 5 * 1000
                    })
                })
                this.$nextTick(() => {
                    this.$parent.$refs.backtop.scrollToTop()
                })
            },
            handleCurrentChange(val) {
                this.getFollow(val)
            },
            confirmUnfollow(memberId) {
                MessageBox.confirm('确定要取消关注吗？', '取消关注', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    unfollow(memberId).then(rsp => {
                        this.$message({
                            message: '取消关注成功',
                            type: "success",
                            duration: 3000
                        })
                        this.getFollow(this.cur)
                    })
                }).catch(() => {})
            }
        },
        mounted() {
            this.getFollow(1)
        }
    }
</script>

<style scoped>
    .timeline-item {
        text-align: left;
    }
    .timeline-item-title {
        max-font-size: 14px;
        font-size: inherit;
    }
    .my-divider-no-botoom {
        margin-bottom: 0px
    }
</style>