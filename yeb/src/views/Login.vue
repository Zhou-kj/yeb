<template>
    <div>
        <el-form :rules="rules" :model="loginForm" ref="loginForm" class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名" auto-complete="false">
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" auto-complete="false">
                </el-input>
            </el-form-item>
            <!-- <el-form-item prop="code">
                <el-input type="text" v-model="loginForm.code" placeholder="点击图片更换验证码" auto-complete="false"
                    style="width: 200px; margin-right: 10px;"></el-input>
                <img :src="captchaUrl" @click="updateCaptcha">
            </el-form-item> -->
            <el-checkbox type="checked" v-model="checked" class="rememberMe">记住我</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>

export default {
    name: 'Login',
    data() {
        return {
            captchaUrl: '',
            loginForm: {
                username: 'admin',
                password: '123',
                /* code: '' */
            },
            checked: true,
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            }
        }
    },

    methods: {
        updateCaptcha() {
            this.captchaUrl = ''
        },
        submitLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.postRequest('/login', this.loginForm).then(resp => {
                        if (resp) {
                            const tokenStr = resp.token
                            window.sessionStorage.setItem('tokenStr', tokenStr)
                            // 页面跳转
                            const path = this.$route.query.redirect
                            this.$router.replace((path ==  '/' || path == undefined)? '/home' : path)
                        }
                    })
                } else {
                    this.$message.error('请输入所需字段！')
                    return false
                }
            })
        }
    },
}
</script>

<style scoped>
.loginContainer {
    border-radius: 15px;
    background-clip: border-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px;
    background: #fff;
    border: 1px solid skyblue;
    box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
    margin: 0 auto 30px auto;
    text-align: center;
}

.rememberMe {
    margin-bottom: 15px;
}

.el-form-item__content {
    display: flex;
    align-items: center;
}
</style>