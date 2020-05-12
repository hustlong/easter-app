<template>
  <div class="home">
    <div id="nav">
      <router-link to="/login" style="font-size: 1.5em">登录</router-link> |
      <router-link to="/register" style="font-size: 1.5em">注册</router-link>
    </div>
    <svg-icon icon-class="easter-logo" style="width: 125px;height: 125px; color: #42b983"></svg-icon>
    <div class="hello">
      <h1>欢迎加入 EASTer 实验信息交流平台</h1>
      <p>
        EASTer 实验信息交流平台是为了方便工作人员
        <a class="el-message--error">参与核聚变实验、获取实验数据、交流试验结果</a>而搭建的及时社交系统。<br><br>
        查看API文档
        <a href="http://easter.biglong.top:8085/swagger-ui.html" target="_blank" rel="noopener">easter api documentation</a>.<br><br>
        如果你热衷于技术贡献，愿意参与开发后台服务、小程序、Android、iOS、WebApp等<br>
        请联系<a class="el-link--primary">long.yang@ipp.ac.cn</a>.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
