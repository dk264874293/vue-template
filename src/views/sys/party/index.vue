<template>
  <div class="layout_content">
    <el-form :inline="true" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="dataList"
      row-key="id"
      stripe
      border
      style="width: 100%;"
    >
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="组织名称"
      />
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="说明"
      />
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
      />
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="changeUpdateHandle(scope.row)">修改</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <partyUpdata
      :visible="updateVisible"
      :state="updateState"
      :menu-list="dataList"
      :data-form="dataForm"
      @visibleChange="changeVisible"
      @submit="updataSubmit"
    />
    <!-- 弹窗, 新增 / 修改 -->

  </div>
</template>

<script>
import partyUpdata from './partyUpdata'
import { isAuth } from '@/utils'
import { treeDataTranslate } from '@/utils'
import { getSysPartyList,
  addSysPartySave, setSysPartyUpdate, delSysPartyDelete } from '@/api/sys'
export default {
  name: 'sys-party',
  components: {
    partyUpdata
  },
  data() {
    return {
      loading: false,
      dataList: [],
      updateState: '',
      updateVisible: false,
      isAuth,

      dataForm: {
        'id': 0,
        'name': '',
        'orderNum': 0,
        'parentId': 0,
        'parentName': '',
        'remark': ''
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.loading = true
      getSysPartyList()
        .then(res => {
          this.dataList = treeDataTranslate(res.data)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 切换状态
    changeVisible() {
      const { updateVisible } = this
      this.updateVisible = !updateVisible
    },
    // 新增
    addOrUpdateHandle() {
      this.updateState = 'new'
      this.dataForm = {
        'id': 0,
        'name': '',
        'orderNum': 0,
        'parentId': -1,
        'parentName': '',
        'remark': ''
      }
      this.changeVisible()
    },
    //  修改
    changeUpdateHandle(item) {
      this.updateState = 'change'
      this.dataForm = { ...item }
      this.changeVisible()
    },
    // 提交
    updataSubmit(data, state) {
      const submitFn = state === 'new' ? addSysPartySave : setSysPartyUpdate
      this.loading = true

      submitFn(data)
        .then(res => {
          this.$message.success('操作成功')
          this.getDataList()
          this.changeVisible()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 删除
    deleteHandle(item) {
      this.$confirm(`确定进行[${item.name}]的删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        delSysPartyDelete(item.id)
          .then(res => {
            this.$message.success('操作成功')
            this.getDataList()
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
