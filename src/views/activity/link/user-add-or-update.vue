<template>
  <el-dialog
    :title="state ==='new' ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="false"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="登录帐号" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="姓名" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="state ==='new'" label="密码" prop="password">
        <el-input v-model="dataForm.password" type="password" placeholder="密码" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="state ==='new'" label="确认密码" prop="comfirmPassword">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码" />
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item size="mini" label="组织">
        <el-tree
          ref="partyList"
          :data="partyList"
          :props="menuListTreeProps"
          node-key="id"
          show-checkbox
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('visibleChange')">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail } from '@/utils/validate'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    state: {
      type: String,
      default: ''
    },
    partyList: {
      type: Array,
      default: () => []
    },
    roleList: {
      type: Array,
      default: () => []
    },
    dataForm: {
      type: Object,
      default: () => ({
        id: -1,
        partys: [],
        password: '',
        roleIdList: [],
        username: '',
        name: '',
        comfirmPassword: '',
        createUserId: '',
        email: ''
      })
    }
  },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (this.state === 'new' && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (this.state === 'new' && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value === '' || isEmail(value)) {
        callback()
      } else {
        callback('请输入正确的邮箱')
      }
    }
    return {
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataRule: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { required: this.state === 'new', validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { required: this.state === 'new', validator: validateComfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible(newData, oldData) {
      if (newData) {
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          if (this.state === 'change') {
            this.$refs.partyList.setCheckedKeys(this.dataForm.partys.map(_ => _.key))
          } else {
            this.$refs.partyList.setCheckedKeys([])
          }
        })
      }
    }
  },
  methods: {
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          const partyList = this.$refs['partyList'].getCheckedNodes()
          const { dataForm, state } = this
          this.$emit('submit', { ...dataForm, partys: partyList.map(_ => ({ key: _.id, val: _.name })) }, state)
        }
      })
    }
  }
}
</script>
