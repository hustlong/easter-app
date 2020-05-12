<template>
    <div>
        <el-page-header @back="loading?'':$router.go(-1)" content="注册" style="padding-top: 30px"></el-page-header>
        <el-card class="login-form-layout">
            <el-form autoComplete="on"
                     :model="loginForm"
                     :rules="loginRules"
                     ref="loginForm"
                     label-position="left">
                <div style="text-align: center">
                    <svg-icon icon-class="easter-logo" style="width: 60px;height: 60px; color: #42b983"></svg-icon>
                </div>
                <h2 class="login-title color-main">注册 EASTer</h2>
                <el-form-item prop="username">
                    <el-input name="username"
                              type="text"
                              v-model="loginForm.username"
                              autoComplete="on"
                              placeholder="请输入邮箱">
                        <span slot="prefix"><svg-icon icon-class="email" style="color: #42b983"></svg-icon></span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password"
                              :type="pwdType"
                              @keyup.enter.native="handleLogin"
                              v-model="loginForm.password"
                              placeholder="请输入密码">
                        <span slot="prefix"><svg-icon icon-class="password" style="color: #42b983"></svg-icon></span>
                        <span slot="suffix" @click="showPwd"><svg-icon icon-class="eye" style="color: #42b983"></svg-icon></span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="authCode">
                    <el-input name="authCode"
                              type="text"
                              v-model="loginForm.authCode"
                              placeholder="请输入验证码">
                        <span slot="prefix"><svg-icon icon-class="authcode" style="color: #42b983"></svg-icon></span>
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 60px;text-align: center">
                    <el-button type="primary"
                               :loading="sendLoading"
                               :disabled="sent"
                               @click.native.prevent="handleAuthCode">
                        获取验证码
                    </el-button>
                    <el-button type="primary" :loading="loading" @click.native.prevent="handleLogin">
                        注册
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import {isvalidUsername} from "@/utils/validate";
    import {setCookie} from "@/utils/support";
    import Cookies from 'js-cookie'
    import {authCode, register} from "@/api/login"

    export default {
        name: "Register",
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!isvalidUsername(value)) {
                    callback(new Error('请输入正确的用户邮箱'))
                } else {
                    callback()
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('密码不能小于6位'))
                } else {
                    callback()
                }
            };
            const validateAuthCode = (rule, value, callback) => {
                if (value==null || value.length !== 6) {
                    callback(new Error('验证码长度为6位'))
                } else {
                    callback()
                }
            };
            return {
                loginForm: {
                    username: '',
                    password: '',
                    authCode: ''
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    password: [{required: true, trigger: 'blur', validator: validatePass}],
                    authCode: [{required: true, trigger: 'blur', validator: validateAuthCode}],
                },
                loading: false,
                pwdType: 'password',
                sendLoading: false,
                sent: false
            }
        },
        created() {
        },
        methods: {
            showPwd() {
                if (this.pwdType === 'password') {
                    this.pwdType = ''
                } else {
                    this.pwdType = 'password'
                }
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        register(this.loginForm.username
                            , this.loginForm.password
                            , this.loginForm.username
                            , this.loginForm.authCode
                        ).then( rsp => {
                            this.loading = false;
                            this.$message.success('注册成功！');
                            setCookie("username", this.loginForm.username, 15);
                            Cookies.remove('password')
                            this.$router.push({path: '/login'})
                        }).catch( err => {
                            this.loading = false;
                            // this.$message.error(err.response.data.message);
                        })
                    } else {
                        this.$message.warning('登录参数验证不合法！');
                    }
                })
            },
            handleAuthCode() {
                this.$confirm("请确认邮箱 " + this.loginForm.username +" 是否正确?", {
                    confirmButtonText: '正确',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sendAuthCode()
                }).catch(()=>{})

            },
            sendAuthCode() {
                this.sendLoading = true
                authCode(this.loginForm.username).then(rsp => {
                    this.$message.success("验证码发送成功")
                    this.sent = true;
                    this.sendLoading = false
                }).catch(err => {
                    this.$message.error("验证码发送失败！")
                    this.sendLoading = false
                })
            },
        }
    }
</script>

<style scoped>
    .login-form-layout {
        position: absolute;
        left: 0;
        right: 0;
        width: 360px;
        margin: 80px auto;
        border-top: 10px solid #42b983;
    }
    .login-title {
        text-align: center;
    }
</style>