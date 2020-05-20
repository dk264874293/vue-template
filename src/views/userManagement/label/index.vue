<template>
  <div class="layout_content">
    <el-form :inline="true" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="selectName" placeholder="用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('userManagement:label:save')" type="primary" @click="addOrUpdateHandle()">新增标签</el-button>
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
        prop="name"
        header-align="center"
        align="center"
        label="标签名称"
      />
      <el-table-column
        prop="organizedName"
        header-align="center"
        align="center"
        label="标签分组"
      />
      <el-table-column
        prop="pnum"
        header-align="center"
        align="center"
        label="使用用户"
      />
      <el-table-column
        prop="pnum"
        header-align="center"
        align="center"
        label="渠道统计"
      >
        <template slot-scope="scope">
          <span>公众号:{{ scope.row.gnum }}</span><br>
          <span>个号:{{ scope.row.pnum }}</span><br>
          <span>活动:{{ scope.row.anum }}</span><br>
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
          <el-button v-if="isAuth('userManagement:label:update')" type="text" size="small" @click="changeUpdateHandle(scope.row)">修改</el-button>
          <el-button v-if="isAuth('userManagement:label:delete')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      :visible="updateVisible"
      :data-form="dataForm"
      :state="updateState"
      :select-list="organizeList"
      @initSelect="getSelectList"
      @visibleChange="changeVisible"
      @submit="updataSubmit"
    />
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import { isAuth } from '@/utils'
import {
  getSysLabelList, getOrganizeList, setSysLabelUpdate,
  setSysLabelSave, delSysLabelDelete } from '@/api/userManagement'
export default {
  name: 'userManagement-label',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      loading: false,
      selectName: '',
      dataList: [],
      organizeList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      updateState: '',
      updateVisible: false,
      isAuth,
      dataForm: {
        anum: 0,
        gnum: 0,
        id: -1,
        name: '',
        organizeId: 1,
        organizedName: '',
        pnum: 0
      }
    }
  },
  mounted() {
    this.getDataList()
    this.getSelectList()
  },
  methods: {
    getSelectList() {
      getOrganizeList().then(res => {
        this.organizeList = res.data
      })
    },
    // 获取数据列表
    getDataList() {
      this.loading = true
      const { selectName, pageIndex, pageSize } = this
      getSysLabelList(selectName, pageIndex, pageSize)
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
    changeVisible() {
      const { updateVisible } = this
      this.updateVisible = !updateVisible
    },
    // 新增
    addOrUpdateHandle() {
      this.updateState = 'new'
      this.dataForm = {
        anum: 0,
        gnum: 0,
        id: -1,
        name: '',
        organizeId: null,
        organizedName: '',
        pnum: 0
      }
      this.changeVisible()
    },
    //  修改
    changeUpdateHandle(item) {
      this.changeVisible()
      this.updateState = 'change'
      this.dataForm = { ...item }
    },
    // 提交
    updataSubmit(data, state) {
      const submitFn = state === 'new' ? setSysLabelSave : setSysLabelUpdate
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
        delSysLabelDelete(item.id)
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
