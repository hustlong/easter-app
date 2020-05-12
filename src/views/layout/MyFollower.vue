<template>
    <div>
        <section v-loading="loading">
            <div v-for="pojo of followerList" :key="pojo.followTime">
                <el-row style="padding-top: 20px">
                    <el-col :span="4">
                        <div>
                            <el-avatar
                                    :size="40"
                                    :src="pojo.icon"
                                    :alt="pojo.nickname">
                                {{pojo.nickname==null||pojo.nickname==='' ? pojo.username:pojo.nickname}}
                            </el-avatar>
                        </div>
                    </el-col>
                    <el-col :span="20" class="timeline-item">
                        <el-row type="flex">
                            <div style="font-weight:bold;">{{pojo.nickname==null||pojo.nickname==='' ? '未设置昵称':pojo.nickname}}</div>
                            <div style="margin-left: 24px; color: grey">{{pojo.username}}</div>
                            <svg-icon icon-class="gender" style="width: 20px;height: 20px;"
                                      :class="pojo.gender===1?'gender-1-boy':pojo.gender===2?'gender-2-girl':'gender-0'"></svg-icon>
                        </el-row>
                        <el-row type="flex">
                            <div style="color: grey; font-size: 14px; margin-top: 4px;">{{recentTime(pojo.followTime)}}关注你</div>
                            <el-button
                                    type="text"
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="confirmRemove(pojo.id)"
                                    round>移除粉丝</el-button>
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
    import {followerList, remove} from "@/api/follow";
    import {MessageBox} from "element-ui";

    export default {
        name: "MyFollower",
        data() {
            return {
                memberId: this.$store.state.user.member.id,
                loading: true,
                total: 0,
                cur: 0,
                size: 0,
                followerList: [],
            }
        },
        methods: {
            recentTime(date) {
                return format(new Date(date), 'zh_CN');
            },
            getFollower(page) {
                this.loading = true
                followerList(this.memberId, page).then( response => {
                    console.log(response.data)
                    this.size = response.data.pageSize
                    this.cur = response.data.pageNum
                    this.total = response.data.total
                    this.followerList = response.data.list
                    this.loading = false
                }).catch(err => {
                    console.log("followerList => ", err)
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
                this.getFollower(val)
            },
            confirmRemove(memberId) {
                MessageBox.confirm('确定要移除粉丝吗？', '移除粉丝', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    remove(memberId).then(rsp => {
                        this.$message({
                            message: '移除粉丝成功',
                            type: "success",
                            duration: 3000
                        })
                        this.getFollow(this.cur)
                    })
                }).catch(() => {})
            }
        },
        mounted() {
            this.getFollower(1)
        }
    }
</script>

<style scoped>
    .gender-1-boy {
        color: mediumspringgreen;
    }
    .gender-2-girl {
        color: orangered;
    }
    .gender-0 {
        color: lightgrey;
    }
    .timeline-item {
        text-align: left;
    }
    .timeline-item-title {
        max-font-size: 14px;
        font-size: inherit;
    }
</style>