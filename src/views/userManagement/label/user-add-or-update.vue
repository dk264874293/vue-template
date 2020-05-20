<template>
  <el-dialog
    :title="state ==='new' ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="false"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="标签名称" autocomplete="off" />
      </el-form-item>
      <el-form-item label="标签分组" prop="name">
        <el-select v-model="dataForm.organizeId" filterable placeholder="请选择">
          <el-option
            v-for="item in selectList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button style="margin-left:10px" type="text" @click="newOrganisze">+ 创建</el-button>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('visibleChange')">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { setOrganizeSave } from '@/api/userManagement'
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
    selectList: {
      type: Array,
      default: () => []
    },
    dataForm: {
      type: Object,
      default: () => ({
        anum: 0,
        gnum: 0,
        id: -1,
        name: '',
        organizeId: -1,
        organizedName: '',
        pnum: 0
      })
    }
  },
  data() {
    return {
      dataRule: {
        name: [
          { required: true, message: '标签名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const { dataForm, state } = this
          this.$emit('submit', dataForm, state)
        }
      })
    },
    newOrganisze() {
      this.$prompt('标签分组名称', '创建分组标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (val) => {
          return val === '' ? '请输入标签分组名' : true
        },
        inputValue: '',
        inputErrorMessage: '分组名称不能为空'
      }).then(({ value }) => {
        setOrganizeSave(value)
          .then(res => {
            this.$emit('initSelect')
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  }
}
</script>
