<template>
    <section class="my-blog-list" v-loading="loading">
        <el-timeline class="my-blog-timeline">
            <el-timeline-item
                    v-for="pojo of blogList"
                    :key="pojo.id"
                    type="primary"
                    icon="el-icon-time"
                    size="large"
                    :timestamp="recentTime(pojo.createTime)"
                    placement="top">
                <div class="timeline-item-content">
                    {{pojo.blogContent}}
                    <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-delete"
                            @click="confirmDelete(pojo.id)"
                            round>删除
                    </el-button>
                </div>
                <el-badge v-if="pojo.pics != null && pojo.pics.length > 0"
                          type="primary"
                          class="timeline-item-pic-badge"
                          :value="badgeNum(pojo.pics)">
                    <el-image
                            style="max-height: 600px; margin-right: 8px"
                            fit="cover"
                            :src="picList(pojo.pics)[0]"
                            :preview-src-list="picList(pojo.pics)">
                    </el-image>
                </el-badge>
                <div v-if="pojo.files != null && pojo.files.length > 0">
                    <el-link
                            class="timeline-item-file"
                            icon="el-icon-folder"
                            v-for="file of fileList(pojo.files)"
                            :key="file"
                            :href="file">{{fileName(file)}}</el-link>
                </div>
                <el-row type="flex">
                    <el-button size="small"
                               type="primary"
                               icon="el-icon-collection-tag"
                               :disabled="!pojo.collectStatus"
                               @click="$message.info('收藏功能正在开发ing')"
                               plain
                               round>{{pojo.collectCount}}</el-button>
                    <el-button size="small"
                               type="primary"
                               icon="el-icon-chat-round"
                               :disabled="!pojo.commentStatus"
                               @click="$router.push({path: '/comments/'+pojo.id})"
                               plain
                               round>{{pojo.commentCount}}</el-button>
                </el-row>
                <el-divider class="my-divider"></el-divider>
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
    </section>

</template>

<script>
    import {blogDelete, blogList} from "@/api/blog";
    import {format} from "timeago.js";
    import {MessageBox} from "element-ui";
    import {commentDelete} from "@/api/comment";

    export default {
        name: "MyBlog",
        data() {
            return {
                memberId: this.$store.state.user.member.id,
                loading: true,
                // blog list
                total: 0,
                cur: 0,
                size: 0,
                blogList: [],
            }
        },
        mounted() {
            this.getBlogList(1)
        },
        methods: {
            picList(pics) {
                const picArr = pics.split(",")
                if (picArr[picArr.length-1] === '') {
                    return picArr.splice(0, picArr.length-1)
                }
                return picArr
            },
            badgeNum(pics) {
                const num = this.picList(pics).length
                if (num === 1) return ''
                return num + '张'
            },
            fileList(files) {
                const fileArr = files.split(",")
                if (fileArr[fileArr.length-1] === '') {
                    return fileArr.splice(0, fileArr.length-1)
                }
                return fileArr
            },
            fileName(file) {
                return file.substr(file.lastIndexOf("-")+1)
            },
            handleCurrentChange(val) {
                this.getBlogList(val)
            },
            getBlogList(page) {
                this.loading = true
                blogList(this.memberId, page).then( response => {
                    console.log(response.data)
                    this.size = response.data.pageSize
                    this.cur = response.data.pageNum
                    this.total = response.data.total
                    this.blogList = response.data.list
                    this.loading = false
                }).catch(err => {
                    console.log("blogList => ", err)
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
            recentTime(date) {
                return format(new Date(date), 'zh_CN');
            },
            confirmDelete(blogId) {
                MessageBox.confirm('确定要删除该博客吗？', '删除博客', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    blogDelete(blogId).then(rsp => {
                        this.$message({
                            message: '删除成功',
                            type: "success",
                            duration: 3000
                        })
                        this.getBlogList(this.cur)
                    })
                }).catch(() => {})
            }
        }
    }
</script>

<style scoped>
    .my-blog-list {
        display: block;
        text-align: center;
    }
    .my-blog-timeline {
        margin-top: 8px;
        text-align: left;
        margin-right: 8px;
        margin-left: -16px;
    }
    .timeline-item-pic-badge >>> .el-badge__content
    {
        margin-top:16px;
        margin-right: 32px;
    }
    .my-divider {
        margin-bottom: 0px;
        margin-top: 16px;
    }
    .timeline-item-content {
        margin-top: 8px;
        margin-bottom: 8px;
        font-size: 16px;
        color: #1f2d3d;
    }
    .timeline-item-file {
        display: block;
        width: fit-content;
    }
</style>