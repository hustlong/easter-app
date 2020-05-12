<template>
    <section v-loading="loading" style="margin-top: 40px">
        <el-divider>修改基础信息</el-divider>
        <el-form
                 label-width="80px"
                 class="userinfo-update-form">
            <el-form-item label="用户昵称">
                <el-input v-model="nickname"
                          maxlength="30"
                          placeholder="起个属于你的名字吧"
                          :showWordLimit="true"></el-input>
            </el-form-item>
            <el-form-item label="个性签名">
                <el-input v-model="personalizedSignature"
                          :clearable="true"
                          maxlength="200"
                          placeholder="一句话介绍一下自己吧"
                          :showWordLimit="true"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="gender">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="城市">
                <el-input v-model="city"
                          maxlength="12"
                          placeholder="你在哪个城市呢"
                          :showWordLimit="true"></el-input>
            </el-form-item>
            <el-form-item label="职业">
                <el-input v-model="job"
                          maxlength="12"
                          placeholder="教师/学生/科研人员。。。"
                          :showWordLimit="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="phone"
                          maxlength="18"
                          placeholder=""
                          :showWordLimit="true"></el-input>
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker type="date" placeholder="选择日期" v-model="birthday"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即保存</el-button>
            </el-form-item>
        </el-form>

        <el-divider>修改头像</el-divider>
        <div class="avatar-uploader-parent">
            <el-upload
                    :before-upload="beforePicUpload"
                    :on-error="errorPic"
                    :on-success="successPic"
                    :action="uploadUrl"
                    :headers="headers"
                    :data="{type:3}"
                    class="avatar-uploader">
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
    </section>
</template>

<script>
    import {updateMemberInfo} from "@/api/login";
    import {getToken} from "@/utils/auth";

    export default {
        name: "UserInfoUpdate",
        data() {
            return {
                loading: false,
                info: this.$store.state.user.member,
                nickname: '',
                personalizedSignature: '',
                gender: 0,
                city: '',
                job: '',
                phone:'',
                birthday: '',
                // avatar
                headers: {'Authorization': getToken()},
                uploadUrl: 'http://easter.biglong.top:8085/bms/files/upload',
                // uploadUrl: 'http://192.168.1.100:8085/bms/files/upload',
            }
        },
        mounted() {
            this.nickname = this.info.nickname
            this.personalizedSignature = this.info.personalizedSignature
            this.gender = this.info.gender === 1 ? '男' : this.info.gender === 2 ? '女' : ''
            this.city = this.info.city
            this.job = this.info.job
            this.phone = this.info.phone
            this.birthday = this.info.birthday
        },
        methods: {
            update(form) {
                console.log(form)
                this.loading = true
                updateMemberInfo(form).then( rsp => {
                    this.$message({
                        message: '设置成功，正在跳转到用户信息',
                        type: "success",
                        duration: 5000
                    })
                    // 这里在跳转之前修改meta.id，刷新目标
                    this.$router.beforeEach((to, from, next) => {
                        to.meta.id = to.meta.id+1
                        next()
                    })
                    this.$router.push({path:"/settings/userinfo"})
                    this.loading = false
                }).catch(() => {this.loading = false})
            },
            onSubmit() {
                if (this.nickname == null || this.nickname.length < 2 || this.nickname.length > 30) {
                    this.$message({
                        message: '请输入昵称，长度大于3，小于30',
                        type: "warning",
                        duration: 5000
                    })
                    return;
                }
                const form = {
                    nickname: this.nickname,
                    personalizedSignature: this.personalizedSignature,
                    gender: this.gender === '男' ? 1 : 2,
                    city: this.city,
                    job: this.job,
                    phone: this.phone,
                    birthday: this.birthday
                }
                this.update(form)
            },
            successPic(response, file, picList) {
                if (response.code===200) {
                    const form = {icon: response.data.url}
                    this.update(form)
                } else {
                    console.log("error response: ", response)
                    this.$message({
                        message: '图片上传错误！',
                        type: "error",
                        duration: 5000
                    })
                }
            },
            errorPic(err, file, picList) {
                this.$message({
                    message: '图片上传错误！',
                    type: "error",
                    duration: 5000
                })
            },
            beforePicUpload(file) {
                const isJPG = file.type.startsWith('image/');
                const isLt2M = file.size / 1024 / 1024 < 10;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 10MB!');
                }

                const vali = isJPG && isLt2M;
                this.loading = vali
                return vali;
            }
        }
    }
</script>

<style scoped>
    .userinfo-update-form {
        text-align: left;
    }
    .avatar-uploader-parent {
    }
    .avatar-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 178px;
        height: 178px;
        display: block;
        margin-left: 25%;
        margin-bottom: 40px;
    }
    .avatar-uploader :hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
</style>