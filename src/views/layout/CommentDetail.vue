<template>
    <div>
        <div v-if="showInput" style="margin-top: 16px">
            <el-input
                    placeholder="说说你的看法..."
                    maxlength="150"
                    resize="none"
                    class="el-input-no-border"
                    v-model="comment">
                <el-button slot="append" icon="el-icon-s-promotion" @click="summitEaster"></el-button>
            </el-input>
        </div>
        <section v-loading="loading">
            <div v-for="pojo of list" :key="pojo.id">
                <el-row style="padding-top: 20px">
                    <el-col :span="4">
                        <div>
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
                            <div style="font-weight:bold;" v-if="pojo.memberId === selfId">（我）</div>
                            <div style="margin-left: 16px; color: grey">{{recentTime(pojo.createTime)}}</div>
                            <el-button
                                    type="text"
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="confirmDelete(pojo.id)"
                                    round>删除</el-button>
                        </el-row>
                        <div class="timeline-item-content">
                            {{pojo.comment}}
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
    import {comment, commentDelete, commentOfBlog} from "@/api/comment";
    import {format} from "timeago.js";
    import {Message, MessageBox} from "element-ui";
    import {publish} from "@/api/blog";

    export default {
        name: "CommentDetail",
        computed: {
            id() {
                const path = this.$route.path
                return Number(path.substr(path.lastIndexOf('/')+1))
            },
        },
        data() {
            return {
                loading: false,
                total: 0,
                cur: 1,
                size: 0,
                list: [],
                comment: '',
                showInput: false,
                selfId: this.$store.state.user.member.id
            }
        },
        mounted() {
            if (this.id > 0) {
                this.getList(this.cur)
            } else {
                this.$message.error("不合法路径界面")
            }
        },
        methods: {
            recentTime(date) {
                return format(new Date(date), 'zh_CN');
            },
            getList(page) {
                this.loading = true
                commentOfBlog(this.id, page).then( response => {
                    console.log(response.data)
                    this.size = response.data.pageSize
                    this.cur = response.data.pageNum
                    this.total = response.data.total
                    this.list = response.data.list
                    this.loading = false
                    this.showInput = true
                }).catch( err => {
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
                if (this.id > 0) {
                    this.getList(this.cur)
                } else {
                    this.$message.error("不合法路径界面")
                }
            },
            confirmDelete(commentId) {
                MessageBox.confirm('确定要删除吗？', '删除评论', {
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
                        this.getList(this.cur)
                    })
                }).catch(() => {})
            },
            summitEaster() {
                if (this.comment === null
                    || this.comment === undefined
                    || this.comment.trim().length === 0) {
                    return this.$message({
                        message: '内容不能为空哦',
                        type: 'error',
                        duration: 3 * 1000
                    })
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在发布评论',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                comment(this.id, this.comment).then(response => {
                    loading.close();
                    Message({
                        message: '评论发送成功',
                        type: 'success',
                        duration: 3 * 1000
                    })
                    // 这里在跳转之前修改meta.id，刷新目标
                    this.$route.meta.id = this.$route.meta.id+1
                    // reload
                    this.$store.dispatch('SetReloadFlag', true)
                    this.$nextTick(() => {this.$store.dispatch('SetReloadFlag', false)})
                }).catch(error => {
                    console.log("sendEaster->", error)
                    loading.close();
                })
            }
        },
        beforeRouteLeave(to,from,next) {
            from.meta.id = from.meta.id + 1
            next()
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
    .el-input-no-border {
        font-size: 16px;
    }
</style>