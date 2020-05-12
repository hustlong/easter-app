<template>
    <div class="easter-send-easter">
        <el-input
                type="textarea"
                placeholder="写下此刻的想法..."
                maxlength="800"
                resize="none"
                show-word-limit
                class="el-input-no-border"
                v-model="blogContent">
        </el-input>
        <el-row :gutter="10">
            <el-col :span="10" style="text-align: left">
                <el-upload
                        :before-upload="beforePicUpload"
                        :on-error="errorPic"
                        :on-success="successPic"
                        :on-remove="removePic"
                        :action="uploadUrl"
                        :headers="headers"
                        :data="{type:1}"
                        :file-list="picList"
                        :limit="6"
                        :on-exceed="picExceed"
                        list-type="picture">
                    <el-button icon="el-icon-camera" circle></el-button>
                </el-upload>
            </el-col>
            <el-col :span="10" style="text-align: left">
                <el-upload
                        :before-upload="beforeFileUpload"
                        :on-error="errorFile"
                        :on-success="successFile"
                        :on-remove="removeFile"
                        :action="uploadUrl"
                        :headers="headers"
                        :data="{type:2}"
                        :limit="6"
                        :on-exceed="fileExceed"
                        :file-list="fileList">
                    <el-button icon="el-icon-folder-add" circle></el-button>
                </el-upload>
            </el-col>
            <el-col :span="4" style="text-align: right">
                <el-button type="primary" icon="el-icon-position" circle @click="summitEaster"></el-button>
            </el-col>
        </el-row>
        <el-divider class="el-divider--horizontal"></el-divider>
    </div>
</template>

<script>
    import { getToken } from '@/utils/auth'
    import {Message} from "element-ui";
    import {publish} from "@/api/blog";

    export default {

        name: "SendEaster",
        data() {
            return {
                headers: {'Authorization': getToken()},
                uploadUrl: 'http://easter.biglong.top:8085/bms/files/upload',
                // uploadUrl: 'http://192.168.1.100:8085/bms/files/upload',
                blogContent: '',
                picList: [],
                fileList: [],
            }
        },
        methods: {
            picExceed() {
                Message({
                    message: '图片数量限制6张',
                    type: 'warning',
                    duration: 3 * 1000
                })
            },
            fileExceed() {
                Message({
                    message: '文件数量限制6个',
                    type: 'warning',
                    duration: 3 * 1000
                })
            },
            summitEaster() {
                if (this.blogContent === null
                    || this.blogContent === undefined
                    || this.blogContent.trim().length === 0) {
                    return this.$message({
                        message: '内容不能为空哦',
                        type: 'error',
                        duration: 3 * 1000
                    })
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在发布 EASTer',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                publish(this.blogContent, this.picList, this.fileList).then(response => {
                    loading.close();
                    Message({
                        message: 'EASTer发送成功',
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
            },
            successPic(response, file, picList) {
                if (response.code===200) {
                    this.picList.push({name: response.data.name, url:response.data.url})
                } else {
                    console.log("error response: ", response)
                }
            },
            errorPic(err, file, picList) {
                console.log("err", err)
            },
            removePic(pic, picList) {
                // let pos = 0
                // for (; pos<this.picList.length; pos++) {
                //     if (pic.url === picList[pos].url) break;
                // }
                // this.picList.splice(pos, 1)
                this.picList = picList;
            },
            successFile(response, file, fileList) {
                if (response.code===200) {
                    this.fileList.push({name: response.data.name, url:response.data.url})
                } else {
                    console.log("error response: ", response)
                }
            },
            errorFile(err, file, fileList) {
                console.log("err", err)
            },
            removeFile(file, fileList) {
                // let pos = 0
                // for (; pos<this.fileList.length; pos++) {
                //     if (file.url === fileList[pos].url) break;
                // }
                // this.fileList.splice(pos, 1)
                this.fileList = fileList;
            },
            beforePicUpload(file) {
                console.log(file.type)
                const isJPG = file.type.startsWith('image/');
                const isLt2M = file.size / 1024 / 1024 < 10;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG/PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 10MB!');
                }
                return isJPG && isLt2M;
            },
            beforeFileUpload(file) {
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                    this.$message.error('上传文件大小不能超过 10MB!');
                }
                return isLt10M;
            }
        }
    }
</script>

<style scoped>
    .el-input-no-border >>> textarea{
        border-width: 0;
        min-height: 80px;
    }
    .el-input-no-border {
        min-height: 80px;
        font-size: 16px;
    }
    .el-divider--horizontal {
        margin: 2px;
    }
</style>