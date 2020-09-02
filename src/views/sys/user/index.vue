<template>
  <div class="layout_content">
    <el-form :inline="true" @keyup.enter.native="searchData()">
      <el-form-item>
        <el-input v-model="selectUserName" placeholder="用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" @click="searchData()">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="dataList"
      border
      stripe
      style="width: 100%;"
    >
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名"
      />
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="姓名"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="角色"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="scope.row.roleNames.join(',')"
          >
            <p slot="reference" class="textOverflow">{{ scope.row.roleNames.join(',') }}</p>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="组织管理"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="scope.row.partys.map(_ => _.val).join(',')"
          >
            <p slot="reference" class="textOverflow">{{ scope.row.partys.map(_ => _.val).join(',') }}</p>
          </el-popover>

        </template>
      </el-table-column>
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
          <el-button v-if="isAuth('sys:user:resetpwd')" type="text" size="small" @click="resetUser(scope.row)">重置</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="clearfix" style="margin-top:20px">
      <el-pagination
        style="float:right"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      :visible="updateVisible"
      :data-form="dataForm"
      :state="updateState"
      :party-list="partyList"
      :role-list="roleList"
      @visibleChange="changeVisible"
      @submit="updataSubmit"
    />
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import { isAuth, treeDataTranslate, RemoverRoleFilter } from '@/utils'
import { getSysUserList, getSysUserGetOne, setSysUserSave,
  setSysUserUpdate, delSysUserDelete, getSysPartyList,
  getSysRoleGetPage, setSysUserResetPwd } from '@/api/sys'
export default {
  // name: 'sys-user',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      loading: false,
      selectUserName: '',
      partyList: [],
      roleList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      updateState: '',
      updateVisible: false,
      isAuth,
      dataForm: {
        createUserId: -1,
        email: '',
        password: '',
        id: -1,
        roleIdList: null,
        salt: '',
        status: 1,
        username: '',
        name: '',
        menuIdList: []
      },
      originalMenuList: []
    }
  },
  mounted() {
    this.getDataList()
    getSysPartyList()
      .then(res => {
        this.originalMenuList = res.data
        this.partyList = treeDataTranslate(res.data)
      })
    getSysRoleGetPage('', 1, 1, false)
      .then(res => {
        this.roleList = res.data.records
      })
  },
  methods: {
    searchData() {
      this.pageIndex = 1
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.loading = true
      const { selectUserName, pageIndex, pageSize } = this
      getSysUserList(selectUserName, pageIndex, pageSize)
        .then(res => {
          const { records, total } = res.page
          this.dataList = records
          this.totalPage = total
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
        id: -1,
        partys: [],
        name: '',
        password: '',
        roleIdList: [],
        username: '',
        comfirmPassword: '',
        email: ''
      }
      this.changeVisible()
    },
    //  修改
    changeUpdateHandle(item) {
      this.loading = true
      getSysUserGetOne(item.id)
        .then(res => {
          this.updateState = 'change'
          const { partyList, originalMenuList } = this
          const { partys } = res.user
          this.dataForm = { ...res.user, password: '', partys: RemoverRoleFilter(partyList, partys.map(_ => _.key), originalMenuList) }
          this.changeVisible()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 提交
    updataSubmit(data, state) {
      const submitFn = state === 'new' ? setSysUserSave : setSysUserUpdate
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
    // 重置
    resetUser(item) {
      this.$confirm(`确定进行[${item.username}]的重置密码操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        setSysUserResetPwd(item.id)
          .then(res => {
            this.$message.success('操作成功')
            this.getDataList()
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    // 删除
    deleteHandle(item) {
      this.$confirm(`确定进行[${item.username}]的删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        delSysUserDelete(item.id)
          .then(res => {
            this.$message.success('操作成功')
            this.getDataList()
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    // 切换页数每页数
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
