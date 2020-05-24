<template>
    <div class="easter-timeline">
        <send-easter></send-easter>
        <section class="timeline-cards" v-loading="loading">
            <div v-if="!loading&&PojoTimelineList.length === 0" style="text-align: center; display: inline-grid; margin: 16px">
                <svg-icon icon-class="easter-logo" style="width: 168px;height: 168px; color: #42b983"></svg-icon>
                <span>这里什么动态都没有哦～</span>
                <span>右上角点击</span>
                <el-button type="primary"
                           icon="el-icon-search"
                           @click="$router.push({path: '/searchuser'})"
                           round plain size="small">搜索</el-button>
                <span>开启探索吧！</span>
            </div>
            <div v-else v-for="pojo of PojoTimelineList" :key="pojo.id">
                <el-row style="padding-top: 20px">
                    <el-col :span="5">
                        <div @click="$router.push({path: '/userhome/'+pojo.memberId})">
                            <el-avatar
                                    :size="56"
                                    :src="pojo.icon"
                                    :alt="pojo.nickname">
                                {{pojo.nickname}}
                            </el-avatar>
                        </div>
                    </el-col>
                    <el-col :span="19" class="timeline-item">
                        <el-row type="flex" class="timeline-item-title">
                            <div style="font-weight:bold;">{{pojo.nickname}}</div>
                            <div style="margin-left: 24px; color: grey">
                                @{{pojo.username.substr(0, pojo.username.indexOf('@'))}} · {{recentTime(pojo.createTime)}}</div>
                        </el-row>
                        <div class="timeline-item-content">
                            {{pojo.blogContent}}
                        </div>
                        <el-badge v-if="pojo.pics.length > 0"
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
                        <div v-if="pojo.files.length > 0">
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
    import SendEaster from "@/views/layout/SendEaster";
    import {timeline} from "@/api/blog";
    import { format } from 'timeago.js';

    export default {
        name: "Timeline",
        components: {SendEaster},
        data() {
            return {
                loading: false,
                cur: 0,
                total: 0,
                size: 0,
                PojoTimelineList: [],
            }
        },
        mounted() {
            this.getTimeline(1)
        },
        methods: {
            recentTime(date) {
                return format(new Date(date), 'zh_CN');
            },
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
                this.getTimeline(val)
            },
            getTimeline(num) {
                this.loading = true
                timeline(num,15).then(response => {
                    console.log(response.data)
                    this.size = response.data.pageSize
                    this.cur = response.data.pageNum
                    this.total = response.data.total
                    this.PojoTimelineList = response.data.list
                    this.loading = false
                }).catch(err => {
                    console.log("timeline => ", err)
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
            }
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
    .timeline-item-file {
        display: block;
        width: fit-content;
    }
    .timeline-item-pic-badge >>> .el-badge__content
    {
        margin-top:16px;
        margin-right: 32px;
    }

</style>