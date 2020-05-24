<template>
    <div>
        <section v-loading="loading">
            <div v-for="pojo of commentList" :key="pojo.id">
                <el-row style="padding-top: 20px">
                    <el-col :span="4">
                        <div @click="$router.push({path: '/userhome/'+pojo.memberId})">
                            <el-avatar
                                    :size="40"
                                    :src="pojo.memberIcon"
                                    :alt="pojo.memberNickname">
                                {{pojo.memberNickname}}
                            </el-avatar>
                        </div>
                    </el-col>
                    <el-col :span="20" class="timeline-item">
                        <el-row type="flex" class="timeline-item-title">
                            <div style="font-weight:bold;">{{pojo.memberNickname}}</div>
                            <div style="margin-left: 24px; color: grey">{{recentTime(pojo.createTime)}}</div>
                        </el-row>
                        <div class="timeline-item-content">
                            {{pojo.comment}}
                        </div>
                        <div class="timeline-item-content-blog-desc">
                            原文：{{pojo.blogDesc}}
                        </div>
                        <el-divider></el-divider>
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
    import {commentRcv} from "@/api/comment";

    export default {
        name: "CommentMe",
        data() {
            return {
                loading: true,
                total: 0,
                cur: 0,
                size: 0,
                commentList: [],
            }
        },
        methods: {
            recentTime(date) {
                return format(new Date(date), 'zh_CN');
            },
            getCommentRcv(page) {
                this.loading = true
                commentRcv(page).then( response => {
                    console.log(response.data)
                    this.size = response.data.pageSize
                    this.cur = response.data.pageNum
                    this.total = response.data.total
                    this.commentList = response.data.list
                    this.loading = false
                }).catch(err => {
                    console.log("commentList => ", err)
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
                this.getCommentRcv(val)
            },
        },
        mounted() {
            this.getCommentRcv(1)
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
    .timeline-item-content {
        margin-top: 8px;
        margin-bottom: 8px;
        font-size: 16px;
        color: #1f2d3d;
    }
    .timeline-item-content-blog-desc {
        margin-top: 4px;
        margin-bottom: 4px;
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 4px;
        padding-right: 4px;
        font-size: 14px;
        color: grey;
        background-color: #e6e6e6;
    }
</style>