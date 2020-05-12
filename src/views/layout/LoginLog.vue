<template>
    <section v-loading="loading">
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="recent"
                    label="时间"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="ip"
                    label="IP地址"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="客户端"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="time"
                    label="日期"
                    min-width="100">
            </el-table-column>
        </el-table>
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
    import {format} from "timeago.js";
    import {listLoginLog} from "@/api/login";
    import {formatDate} from "@/utils/date";

    /**
     {
        "city": "string",
        "createTime": "2020-05-02T01:29:29.114Z",
        "id": 0,
        "ip": "string",
        "loginType": 0,
        "memberId": 0,
        "province": "string"
      }
     */

    export default {
        name: "LoginLog",
        data() {
            return {
                loading: true,
                total: 0,
                cur: 0,
                size: 0,
                tableData: [],
            }
        },
        methods: {
            recentTime(date) {
                return format(new Date(date), 'zh_CN');
            },
            getList(page) {
                this.loading = true
                listLoginLog(page).then( response => {
                    console.log(response.data)
                    this.size = response.data.pageSize
                    this.cur = response.data.pageNum
                    this.total = response.data.total
                    // format list
                    const data = []
                    for (let i=0; i<response.data.list.length; i++) {
                        const ori = response.data.list[i]
                        const col = {
                            recent: this.recentTime(ori.createTime),
                            time: formatDate(new Date(ori.createTime)),
                            ip: ori.ip,
                            type: this.getType(ori.loginType)
                        }
                        data.push(col)
                    }
                    this.tableData = data
                    this.loading = false
                }).catch(err => {
                    console.log("collectList => ", err)
                    this.loading = false
                    this.$message.error("加载失败:"+err.response.data.message)
                })
            },
            handleCurrentChange(val) {
                this.getList(val)
            },
            getType(type) {
                // 登录类型：-1->unknow; 0->windows；1->android;2->iphone;3->weixin;4->ipad;5->mac;6->linux
                switch (type) {
                    case 0: return 'Windows'
                    case 1: return 'Android'
                    case 2: return 'iPhone'
                    case 3: return 'WeiXin'
                    case 4: return 'iPad'
                    case 5: return 'Mac'
                    case 6: return 'Linux'
                    default: return '未知'
                }
            }
        },
        mounted() {
            this.getList(1)
        }
    }
</script>

<style scoped>

</style>