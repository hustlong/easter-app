<template>
    <div>
        <el-page-header @back="loading?'':$router.go(-1)" content="登录" style="padding-top: 30px"></el-page-header>
        <el-card class="login-form-layout">
            <el-form autoComplete="on"
                     :model="loginForm"
                     :rules="loginRules"
                     ref="loginForm"
                     label-position="left">
                <div style="text-align: center">
                    <svg-icon icon-class="easter-logo" style="width: 60px;height: 60px; color: #42b983"></svg-icon>
                </div>
                <h2 class="login-title color-main">EASTer 平台</h2>
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
                              autoComplete="on"
                              placeholder="请输入密码">
                        <span slot="prefix"><svg-icon icon-class="password" style="color: #42b983"></svg-icon></span>
                        <span slot="suffix" @click="showPwd"><svg-icon icon-class="eye" style="color: #42b983"></svg-icon></span>
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 60px;text-align: center">
                    <el-button style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import {isvalidUsername} from '../utils/validate';
    import {setCookie,getCookie} from '../utils/support';

    export default {
        name: "Login",
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
            return {
                loginForm: {
                    username: '',
                    password: '',
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    password: [{required: true, trigger: 'blur', validator: validatePass}]
                },
                loading: false,
                pwdType: 'password',
                dialogVisible:false,
                supportDialogVisible:false
            }
        },
        created() {
            this.loginForm.username = getCookie("username");
            this.loginForm.password = getCookie("password");
            if(this.loginForm.username === undefined||this.loginForm.username==null||this.loginForm.username===''){
                this.loginForm.username = '';
            }
            if(this.loginForm.password === undefined||this.loginForm.password==null){
                this.loginForm.password = '';
            }
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
                        this.$store.dispatch('Login', this.loginForm).then(() => {
                            this.loading = false;
                            setCookie("username", this.loginForm.username, 15);
                            setCookie("password", this.loginForm.password, 15);
                            this.$router.push({path: '/'})
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        console.log('登录参数验证不合法！');
                        return false
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .login-form-layout {
        position: absolute;
        left: 0;
        right: 0;
        width: 360px;
        margin: 100px auto;
        border-top: 10px solid #42b983;
    }
    .login-title {
        text-align: center;
    }
</style>