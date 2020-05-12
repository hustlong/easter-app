<template>
    <section v-loading="loading" style="margin-top: 40px">
        <el-form label-width="80px">
            <el-form-item label="注册邮箱">
                <el-input v-model="email" disabled></el-input>
            </el-form-item>
            <el-form-item label="验证码" >
                <el-input v-model="authCode" placeholder="去邮箱查看6位验证码吧"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="password" :show-password="true"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round
                           :disabled="sent"
                           :loading="sendLoading"
                           @click="sendAuthCode">发送验证码</el-button>
                <el-button type="primary" round
                           @click="sendPassword">确认更改</el-button>
            </el-form-item>
        </el-form>

    </section>
</template>

<script>
    import {authCode, updatePassword} from "@/api/login";
    import {removeToken} from "@/utils/auth";
    import Cookies from 'js-cookie'

    export default {
        name: "PasswordUpdate",
        data() {
            return {
                loading: false,
                email: this.$store.state.user.member.email,
                authCode: '',
                password: '',
                sent: false,
                sendLoading: false,
            }
        },
        methods: {
            sendAuthCode() {
                this.sendLoading = true
                authCode(this.email).then(rsp => {
                    this.$message.success("验证码发送成功")
                    this.sent = true;
                    this.sendLoading = false
                }).catch(err => {
                    this.$message.error("验证码发送失败！")
                    this.sendLoading = false
                })
            },
            sendPassword() {
                if (this.password == null || this.password.length < 6 || this.password.length > 18) {
                    this.$message.warning("密码长度应该在6～18位")
                    return
                }
                if (this.authCode == null || this.authCode.length !== 6) {
                    this.$message.warning("验证码长度为6位")
                    return
                }
                this.loading = true;
                console.log(this.email)
                console.log(this.authCode)
                console.log(this.password)
                updatePassword(this.email, this.password, this.authCode).then( rsp => {
                    this.loading = false
                    removeToken();
                    Cookies.remove("password")
                    this.$message.success("密码修改成功！")
                    this.$router.push("/login")
                }).catch( err => {
                    this.loading = false
                    this.$message.error("密码修改失败！")
                })
            }
        }
    }
</script>

<style scoped>

</style>