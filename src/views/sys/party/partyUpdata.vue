<template>
  <el-dialog
    :title="state === 'new' ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible="visible"
    :show-close="false"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="组织名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" />
      </el-form-item>
      <el-form-item size="mini" label="上级组织">
        <el-tree
          ref="menuListTree"
          :data="menuList"
          :props="menuListTreeProps"
          node-key="id"
          default-expand-all
          highlight-current
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
        'id': 0,
        'name': '',
        'orderNum': 0,
        'parentId': 0,
        'parentName': '',
        'remark': 0
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
        name: [
          { required: true, message: '组织名称不能为空', trigger: 'blur' }
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
            const { parentId } = this.dataForm
            if (parentId === 0) {
              this.$refs.menuListTree.setCurrentKey()
            } else {
              this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
            }
          } else {
            this.$refs.menuListTree.setCurrentKey()
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
          const currenKey = this.$refs.menuListTree.getCurrentKey()
          const { parentId } = this.dataForm
          if (!currenKey && parentId !== 0) {
            this.$message.error('请选择上级组织')
            return
          }
          const { dataForm, state } = this
          this.$emit('submit', {
            ...dataForm, parentId: parentId === 0 ? 0 : currenKey
          }, state)
        }
      })
    }
  }
}
</script>
