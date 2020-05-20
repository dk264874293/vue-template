<template>
  <div class="layout_content">
    <el-form :inline="true" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="roleName" placeholder="角色名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button v-loading="loading" @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" v-loading="loading" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="dataList"
      stripe
      border
      style="width: 100%;"
    >
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称"
      />
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
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
          <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="changeUpdateHandle(scope.row)">修改</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    /> -->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      :visible="updateVisible"
      :state="dataState"
      :menu-list="menuList"
      :data-form="dataForm"
      @visibleChange="updateVisibleChange"
      @submit="updateHandleSubmit"
    />
  </div>
</template>

<script>
import AddOrUpdate from './role-add-or-update'
import { isAuth } from '@/utils'
import { getSysRoleGetPage, getSysMenuList, getSysRoleGetOne,
  setSysRoleSave, setSysRoleUpdate, delSysRoleDelete } from '@/api/sys'
import { treeDataTranslate } from '@/utils'
export default {
  name: 'sys-role',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      roleName: '',
      isAuth,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      loading: false,
      updateVisible: false,
      menuList: [],
      dataState: '',
      dataForm: {
        createTime: '',
        createUserId: -1,
        id: -1,
        menuIdList: [],
        remark: null,
        roleName: '',
        updateTime: null
      }
    }
  },
  mounted() {
    this.getDataList()
    getSysMenuList()
      .then(res => {
        this.menuList = treeDataTranslate(res.data)
      })
  },
  methods: {
    // 获取数据列表
    getDataList() {
      const { roleName } = this
      this.loading = true
      // roleName, pageIndex, pageSize
      getSysRoleGetPage(roleName)
        .then(res => {
          const { records, total } = res.data
          this.dataList = records
          this.totalPage = total
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 切换状态
    updateVisibleChange() {
      const { updateVisible } = this
      this.updateVisible = !updateVisible
    },
    // 新增
    addOrUpdateHandle() {
      this.dataState = 'new'
      this.dataForm = {
        createTime: '',
        createUserId: -1,
        id: -1,
        menuIdList: [],
        remark: null,
        roleName: '',
        updateTime: null
      }
      this.updateVisibleChange()
    },
    //  修改
    changeUpdateHandle(item) {
      this.loading = true
      getSysRoleGetOne(item.id)
        .then(res => {
          this.updateVisibleChange()
          this.dataState = 'change'
          this.dataForm = { ...res.data }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 数据提交
    updateHandleSubmit(data, state) {
      const submitFn = state === 'new' ? setSysRoleSave : setSysRoleUpdate
      this.loading = true
      submitFn(data)
        .then(res => {
          this.$message.success('操作成功')
          this.getDataList()
          this.updateVisibleChange()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 删除
    deleteHandle(item) {
      this.$confirm(`确定进行[${item.roleName}]删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        delSysRoleDelete(item.id)
          .then(res => {
            this.$message.success('操作成功')
            this.getDataList()
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    // 切换每页页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 切换当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>
