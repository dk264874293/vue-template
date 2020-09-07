<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          {{ name }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="visible = true">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="visible"
      width="480px"
    >
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="password">
          <el-input v-model.number="ruleForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-loading="loading" @click="visible = false">取 消</el-button>
        <el-button v-loading="loading" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { setSysUserPassword } from '@/api/sys'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      loading: false,
      ruleForm: {
        password: '',
        newPassword: '',
        checkPass: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请重复新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 修改密码提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { password, newPassword } = this.ruleForm
          this.loading = true
          setSysUserPassword(this.$store.getters.user_id, password, newPassword)
            .then(res => {
              this.$message.success('修改成功！')
              this.$refs[formName].resetFields()
              this.visible = false
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    // 退出登录
    logout() {
      this.$confirm('确认退出登录吗？')
        .then(() => {
          this.$store.dispatch('user/logout')
            .then(() => {
              this.$router.push(`/login`)
            })
        })
        .catch(_ => {})
    }
    // async logout() {
    //   await this.$store.dispatch('user/logout')
    //   this.$router.push(`/login`)
    // }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  padding-right: 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

  }
  .avatar-container{
    cursor: pointer;
  }
}
</style>
