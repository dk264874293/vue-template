<template>
  <div class="login-container">
    <div class="login-header clearfix">
      <img src="../../assets/pic_logo@2x.png" alt="">
    </div>
    <div class="login-body">
      <div class="login-content">
        <img src="../../assets/pic_Illustration_logon@2x.png" alt="">

        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
          @keyup.enter.native="handleLogin"
        >
          <div class="title-container">
            <h3 class="title">欢迎使用宏原SCRM系统
            </h3>
          </div>
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
            />
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="18">
              <el-form-item prop="captcha">
                <el-input
                  ref="captcha"
                  v-model="loginForm.captcha"
                  placeholder="请输入验证码"
                  name="captcha"
                  tabindex="3"
                  auto-complete="on"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <img :src="captchaPath" class="login-captcha" alt @click="getCaptcha()">
            </el-col>
          </el-row>
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            @click.native.prevent="handleLogin"
          >登录</el-button>
        </el-form>
      </div>

    </div>
    <div class="login-floot">
      沪ICP备案13038549号    上海宏原信息科技有限公司SCRM系统
    </div>
  </div>

</template>

<script>
import { getUUID } from '@/utils'
import { baseURL } from '@/utils/request'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        uuid: ''
      },
      captchaPath: '',
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' }
        ],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.loginForm.username = 'testWang'
      this.loginForm.password = '123456'
    }
    // [][(([]+![])[+!![]+!![]+!![]])+(([]+{})[+!![]])+(([]+!![])[+!![]])+(([]+!![])[+[]])][(([]+{})[+!![]+!![]+!![]+!![]+!![]])+(([]+{})[+!![]])+(([]+[][[]])[+!![]])+(([]+![])[+!![]+!![]+!![]])+(([]+!![])[+[]])+(([]+!![])[+!![]])+(([]+[][[]])[+[]])+(([]+{})[+!![]+!![]+!![]+!![]+!![]])+(([]+!![])[+[]])+(([]+{})[+!![]])+(([]+!![])[+!![]])]((([]+!![])[+!![]])+(([]+!![])[+!![]+!![]+!![]])+(([]+!![])[+[]])+(([]+[][[]])[+[]])+(([]+!![])[+!![]])+(([]+[][[]])[+!![]])+(([]+{})[+!![]+!![]+!![]+!![]+!![]+!![]+!![]])+(([]+[][[]])[+[]])+(([]+[][[]])[+!![]])+(([]+!![])[+!![]+!![]+!![]])+(([]+![])[+!![]+!![]+!![]])+(([]+{})[+!![]+!![]+!![]+!![]+!![]])+(([]+![])[+!![]])+((+([]+(+!![]+!![])+(+!![]+!![]+!![]+!![]+!![])))[(([]+!![])[+[]])+(([]+{})[+!![]])+(([]+([]+[])[(([]+{})[+!![]+!![]+!![]+!![]+!![]])+(([]+{})[+!![]])+(([]+[][[]])[+!![]])+(([]+![])[+!![]+!![]+!![]])+(([]+!![])[+[]])+(([]+!![])[+!![]])+(([]+[][[]])[+[]])+(([]+{})[+!![]+!![]+!![]+!![]+!![]])+(([]+!![])[+[]])+(([]+{})[+!![]])+(([]+!![])[+!![]])])[+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]])+(([]+!![])[+[]])+(([]+!![])[+!![]])+(([]+[][[]])[+!![]+!![]+!![]+!![]+!![]])+(([]+[][[]])[+!![]])+(([]+([]+[])[(([]+{})[+!![]+!![]+!![]+!![]+!![]])+(([]+{})[+!![]])+(([]+[][[]])[+!![]])+(([]+![])[+!![]+!![]+!![]])+(([]+!![])[+[]])+(([]+!![])[+!![]])+(([]+[][[]])[+[]])+(([]+{})[+!![]+!![]+!![]+!![]+!![]])+(([]+!![])[+[]])+(([]+{})[+!![]])+(([]+!![])[+!![]])])[+([]+(+!![])+(+!![]+!![]+!![]+!![]))])](+([]+(+!![]+!![]+!![])+(+!![]+!![]+!![]+!![]+!![]+!![]))))+(([]+!![])[+!![]+!![]+!![]]))()(('%'+([]+(+!![]+!![]+!![]+!![]+!![]+!![]+!![]))+([]+(+!![]+!![])))+('%'+([]+(+!![]+!![]+!![]+!![]+!![]+!![]))+([]+(+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])))+('%'+([]+(+!![]+!![]+!![]+!![]+!![]+!![]))+([]+(+!![]+!![]+!![])))+('%'+([]+(+!![]+!![]+!![]+!![]+!![]+!![]))+([]+(+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]))))

    this.getCaptcha()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
              // (!~+[] + {})[--[~+""][+[]] * [~+[]] + ~~!+[]] + ({} + [])[[~!+[]] * ~+[]]
            })
            .catch(() => {
              this.getCaptcha()
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCaptcha() {
      const nUUID = getUUID()
      this.loginForm.uuid = nUUID
      this.captchaPath = `${baseURL}/sys/captcha.jpg?uuid=${nUUID}`
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {

  .el-input {
    display: inline-block;
    height: 40px;
    width: 90%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 40px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border:1px solid rgba(255,255,255,0.5);
    background:rgba(255,255,255,0.06);
    border-radius: 4px;
    color: #454545;
    margin-bottom: 20px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  flex:1;
  display: flex;
  flex-direction: column;

  .login-header{
    width: 100%;
    // height: 60px;
    padding: 10px 20px;
    background-color: #fff;;
    img{
      width:160px;
      height:40px;
      float: left;
    }
  }
  .login-body{
    flex:1;
    background-image: url('../../assets/pic_bgd_logon@2x.jpg');
    background-size: cover;
    position: relative;
    background-size: cover;
    overflow: hidden;
    .login-content{
      width:1180px;
      height: 540px;
      position: absolute;
      top:50%;
      left: 50%;
      margin-top: -270px;;
      margin-left: -590px;
      img{
        width: 750px;
      }
      .login-form {
        margin-top: 70px;;
        float: right;
        width:420px;
        box-sizing: border-box;
        background:linear-gradient(180deg,rgba(255,255,255,0.2) 0%,rgba(255,255,255,0.1) 100%);
        box-shadow:2px 6px 24px 0px rgba(0,0,0,0.08),1px 1px 2px 0px rgba(255,255,255,0.5);
        border-radius:10px;
        padding:60px 44px;
        .login-captcha {
          width: 100%;
          height: 42px;
          border-radius:4px;
        }
        .login-btn{
          width: 100%;
          margin-top: 20px;
        }
      }
    }

  }
  .login-floot{
    width:100%;
    height:60px;
    text-align: center;
    line-height: 60px;
    font-size: 16px;
    color: #909398;
    background-color: #fff;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 24px;
      color: #fff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
