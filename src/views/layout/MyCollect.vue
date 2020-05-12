<template>
    <div>
        <el-timeline class="my-comment-timeline" v-loading="loading">
            <el-timeline-item
                    v-for="pojo of list"
                    :key="pojo.id"
                    type="primary"
                    icon="el-icon-time"
                    size="large"
                    :timestamp="recentTime(pojo.createTime)"
                    placement="top">
                <div class="timeline-item-content">
                    {{pojo.notes}}
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
    import {MessageBox} from "element-ui";
    import {collectDelete, collectList} from "@/utils/collect";

    export default {
        name: "MyCollect",
        data() {
            return {
                loading: true,
                total: 0,
                cur: 0,
                size: 0,
                list: [],
            }
        },
        methods: {
            recentTime(date) {
                return format(new Date(date), 'zh_CN');
            },
            getList(page) {
                this.loading = true
                collectList(page).then( response => {
                    console.log(response.data)
                    this.size = response.data.pageSize
                    this.cur = response.data.pageNum
                    this.total = response.data.total
                    this.list = response.data.list
                    this.loading = false
                }).catch(err => {
                    console.log("collectList => ", err)
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
                this.getList(val)
            },
            confirmDelete(id) {
                MessageBox.confirm('确定要删除该收藏吗？', '删除收藏', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    collectDelete(id).then(rsp => {
                        this.$message({
                            message: '删除成功',
                            type: "success",
                            duration: 3000
                        })
                        this.getList(this.cur)
                    })
                }).catch(() => {})
            }
        },
        mounted() {
            this.getList(1)
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