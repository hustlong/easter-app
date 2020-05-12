<template>
    <section v-loading="loading">
        <section style="margin-top: 16px; margin-bottom: 64px" v-loading="searchLoading">
            <el-input
                    placeholder="搜索用户（邮箱）"
                    maxlength="64"
                    resize="none"
                    :clearable = "true"
                    @clear="handleClear"
                    class="el-input-no-border"
                    v-model="email">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
<!--            // 搜索结果-->
            <div v-if="showSearchResult">
                <el-divider>搜索结果</el-divider>
                <span v-if="searchResult.length===0">没有找到符合条件的用户</span>
                <div v-else v-for="pojo of searchResult" :key="pojo.id" class="timeline-item">
                    <el-row style="padding-top: 12px; padding-bottom: 12px; display: flex">
                        <el-avatar
                                :size="28"
                                :src="pojo.icon"
                                :alt="pojo.nickname">
                            {{pojo.nickname==null||pojo.nickname==='' ? pojo.username:pojo.nickname}}
                        </el-avatar>
                        <div style="font-weight:bold;margin-left: 8px;">
                            {{pojo.nickname==null||pojo.nickname==='' ? '未设置':pojo.nickname}}
                        </div>
                        <div style="font-weight:bold;" v-if="pojo.id === selfId">（我）</div>
                        <div style="margin-left: 14px; color: grey">{{pojo.username}}</div>
                        <svg-icon icon-class="gender" style="width: 20px;height: 20px;"
                                  :class="pojo.gender===1?'gender-1-boy':pojo.gender===2?'gender-2-girl':'gender-0'">
                        </svg-icon>
                        <el-link type="primary" v-if="pojo.id !== selfId" @click="followTa(pojo.id)">
                            关注{{pojo.gender===1?'他':pojo.gender===2?'她':'TA'}}
                        </el-link>
                    </el-row>
                </div>
            </div>
        </section>

        <el-divider>
            粉丝排行榜(每十分钟刷新)<el-button round size="mini" @click="rankingFans">刷新</el-button>
        </el-divider>
        <section style="margin-top: 48px" v-loading="rankLoading">
            <div v-for="pojo of hot" :key="pojo.member.id">
                <el-row style="padding-top: 8px">
                    <el-col :span="4">
                        <div style="display: inline-grid">
                            <el-avatar
                                    :size="40"
                                    :src="pojo.member.icon"
                                    :alt="pojo.member.nickname">
                                {{pojo.member.nickname==null||pojo.member.nickname==='' ? pojo.member.username:pojo.member.nickname}}
                            </el-avatar>
                            <el-link type="primary" v-if="pojo.member.id !== selfId" @click="followTa(pojo.member.id)">
                                关注{{pojo.member.gender===1?'他':pojo.member.gender===2?'她':'TA'}}
                            </el-link>
                        </div>
                    </el-col>
                    <el-col :span="20" class="timeline-item">
                        <el-row type="flex">
                            <div style="font-weight:bold;">
                                {{pojo.member.nickname==null||pojo.member.nickname==='' ? '未设置昵称':pojo.member.nickname}}</div>
                            <div style="font-weight:bold;" v-if="pojo.member.id === selfId">（我）</div>
                            <div style="margin-left: 14px; color: grey">{{pojo.member.username}}</div>
                            <svg-icon icon-class="gender" style="width: 20px;height: 20px;"
                                      :class="pojo.member.gender===1?'gender-1-boy':pojo.member.gender===2?'gender-2-girl':'gender-0'"></svg-icon>
                        </el-row>
                        <el-row type="flex" class="timeline-item-title">
                            <div style="color: grey">博客 {{pojo.info.sendCount==null?0:pojo.info.sendCount}}</div>
                            <div style="color: grey; margin-left: 12px;">关注 {{pojo.info.followCount==null?0:pojo.info.followCount}}</div>
                            <div style="color: grey; margin-left: 12px;">粉丝 {{pojo.info.followerCount==null?0:pojo.info.followerCount}}</div>
                        </el-row>
                        <el-row type="flex" class="tag-group">
                            <el-tag v-if="pojo.member.job" type="info" effect="plain" size="small">{{pojo.member.job}}</el-tag>
                            <el-tag v-if="pojo.member.city" type="info" effect="plain" size="small">{{pojo.member.city}}</el-tag>
                            <el-tag v-if="pojo.member.personalizedSignature" type="success" effect="light" size="small">
                                {{pojo.member.personalizedSignature}}</el-tag>
                        </el-row>

                        <el-divider class="my-divider-no-botoom"></el-divider>
                    </el-col>
                </el-row>
            </div>
        </section>
    </section>
</template>

<script>
    import {rankingFans, searchUser} from "@/api/login";
    import {follow} from "@/api/follow";

    export default {
        name: "SearchUser",
        data() {
            return {
                loading: false,
                searchLoading: false,
                showSearchResult: false,
                rankLoading: false,
                email: '',
                searchResult: [],
                hot: [],
                selfId: this.$store.state.user.member.id
            }
        },
        methods: {
            search() {
                if (this.email == null || this.email.length < 2) {
                    this.$message.warning('请至少输入2个字符')
                    return
                }
                this.searchLoading = true
                searchUser(this.email).then( rsp => {
                    this.searchResult = rsp.data
                    this.searchLoading = false
                    this.showSearchResult = true
                }).catch(()=>{this.searchLoading = false})
            },
            rankingFans() {
                this.rankLoading = true
                rankingFans().then( rsp => {
                    this.rankLoading = false
                    this.hot = rsp.data
                }).catch(() => {this.rankLoading = false})
            },
            handleClear() {
                this.showSearchResult = false
            },
            followTa(memberId) {
                this.loading = true
                follow(memberId).then( rsp => {
                    this.loading = false
                    this.$message.success("关注成功")
                }).catch(()=>{this.loading = false})
            }
        },
        mounted() {
            this.rankingFans()
        }
    }
</script>

<style scoped>

</style>