<template>
    <div>
        <el-timeline class="my-comment-timeline" v-loading="loading">
            <el-timeline-item
                    v-for="pojo of commentList"
                    :key="pojo.id"
                    type="primary"
                    icon="el-icon-time"
                    size="large"
                    :timestamp="recentTime(pojo.createTime)"
                    placement="top">
                <div class="timeline-item-content">
                    {{pojo.comment}}
                    <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-delete"
                            @click="confirmDelete(pojo.id)"
                            round>删除</el-button>
                </div>
                <div class="timeline-item-content-blog-desc">
                    原文：{{pojo.blogDesc}}
                </div>
                <el-divider></el-divider>
            </el-timeline-item>
        </el-timeline>
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
    import {commentDelete, commentSent} from "@/api/comment";
    import {MessageBox} from "element-ui";

    export default {
        name: "MyComment",
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
            getCommentSent(page) {
                this.loading = true
                commentSent(page).then( response => {
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
                this.getCommentSent(val)
            },
            confirmDelete(commentId) {
                MessageBox.confirm('确定要删除该评论吗？', '删除评论', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    commentDelete(commentId).then(rsp => {
                        this.$message({
                            message: '删除成功',
                            type: "success",
                            duration: 3000
                        })
                        this.getCommentSent(this.cur)
                    })
                }).catch(() => {})
            }
        },
        mounted() {
            this.getCommentSent(1)
        }
    }
</script>

<style scoped>
    .timeline-item {
        text-align: left;
    }
    .my-comment-timeline {
        margin-top: 8px;
        text-align: left;
        margin-right: 8px;
        margin-left: -16px;
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