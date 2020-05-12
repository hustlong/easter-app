<template>
    <div>
        <div class="app-container">
            <img :src="img_404" alt="404" class="img-style">
            <div style="margin-top: 60px">
                <h1 class="color-main">OOPS!</h1>
                <h2 style="color: #606266">很抱歉，页面它不小心迷路了！</h2>
                <div style="color:#909399;font-size: 14px">请检查您输入的网址是否正确，请点击以下按钮返回主页</div>
                <el-button style="margin-top: 20px" type="primary" round @click="handleGoMain">返回首页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import img_404 from '@/assets/images/gif_404.gif';

    export default {
        name: 'wrongPage',
        data() {
            return {
                img_404
            }
        },
        methods: {
            handleGoMain() {
                this.$router.push({path: '/'})
            }
        },
    }
</script>

<style scoped>
    .app-container {
        width: 80%;
        margin: 48px auto;
    }

    .img-style {
        width: auto;
        height: auto;
        max-width: 60%;
        max-height: 60%;
    }
</style>