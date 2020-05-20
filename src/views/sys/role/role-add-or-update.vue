<template>
  <el-dialog
    :title="state === 'new' ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible="visible"
    :show-close="false"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" />
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          ref="menuListTree"
          :data="menuList"
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
    menuList: {
      type: Array,
      default: () => []
    },
    dataForm: {
      type: Object,
      default: () => ({
        createTime: '',
        createUserId: -1,
        id: -1,
        menuIdList: [],
        remark: null,
        roleName: '',
        updateTime: null
      })
    }
  },
  data() {
    return {
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  watch: {
    visible(newData, oldData) {
      if (newData) {
        this.$nextTick(() => {
          if (this.state === 'change') {
            this.$refs.menuListTree.setCheckedKeys(this.dataForm.menuIdList)
          } else {
            this.$refs.menuListTree.setCheckedKeys([])
          }
        })
      }
    }
  },
  methods: {
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const { dataForm, state } = this
          this.$emit('submit', {
            ...dataForm, 'menuIdList': this.$refs.menuListTree.getCheckedKeys()
          }, state)
        }
      })
    }
  }
}
</script>
