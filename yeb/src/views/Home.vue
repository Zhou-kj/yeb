<template lang="">
    <div>
        <el-container>
            <el-header class="homeHeader">
              <div class="title">在线办管理平台</div>
              <div>
                <el-button class="chat" icon="el-icon-bell" type="text" size="normal" style="color: black;margin-right: 8px;" @click="goChat"></el-button>
                
                <el-dropdown class="userInfo" @command="commandHandler">
                  <span class="el-dropdown-link">
                    {{user.name}}<i><img :src="user.userFace" alt=""></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                    <el-dropdown-item command="setting">设置</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-header>
            <el-container>
              <el-aside width="250px">
                <el-menu router unique-opened >
                    <el-submenu :index="index+''" v-for="(item, index) in routes" ::key="index" v-if="!item.hidden">
                      <template slot="title"><i :class="item.iconCls" style="color: #379BFF; margin-right: 5px;"></i>
                        <span>{{ item.name }}</span>
                      </template>
                        <el-menu-item :index="children.path" v-for="(children, index) in item.children" ::key="index">{{ children.name }}</el-menu-item>
                    </el-submenu>
                </el-menu>
              </el-aside>
              <el-main>
                <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path != '/home'">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
                </el-breadcrumb>
                <div v-else class="homeWelcome">
                  欢迎使用在线办管理系统!
                </div>
                <router-view class="homeRouterView"></router-view>
              </el-main>
            </el-container>
          </el-container>
    </div>
</template>
<script>

export default {
    name: 'Home',
    data() {
      return {
        user: JSON.parse(window.sessionStorage.getItem('user'))
      } 
    },
    methods: {
      goChat() {
        this.$router.push('/chat')
      },
      commandHandler(command) {
        if (command == 'logout') {
          this.postRequest('/logout')
          window.sessionStorage.removeItem('tokenStr')
          window.sessionStorage.removeItem('user')
          this.$router.replace('/')
        }
      }
    },
    computed: {
      routes() {
        return this.$store.state.routes
      }
    }
}
</script>
<style scoped>
  .homeHeader {
    position: relative;
    background-color: #379BFF;
    padding: 0 15px;
    justify-content: space-around;
    box-sizing: border-box;
  }

  .homeHeader .title {
    position: absolute;
    font-size: 30px;
    font-family: 楷体;
    color: white;
    top: 50%;
    left: 2%;
    transform: translate(0, -50%)
  }

  .chat{
    position: absolute;
    top: 20%;
    right: 13%;
  }

  .homeHeader .userInfo{
    cursor: pointer;
    vertical-align: middle;

  }

  .el-dropdown {
    position: absolute;
    top: 10%;
    right: 5%;
  }

  .el-dropdown img {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-left: 8px;
    vertical-align: middle;
  }

  .homeWelcome {
    padding-left: 27%;
    font-size: 30px;
    font-family: 华文楷体;
    color: #409eff;
    margin-top: 50px;
  }

  .homeRouterView {
    margin-top: 10px;
  }

</style>