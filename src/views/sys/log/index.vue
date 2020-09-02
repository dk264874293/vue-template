<template>
  <div class="layout_content">
    <el-form :inline="true" @keyup.enter.native="searchData()">
      <el-form-item>
        <el-input v-model="key" placeholder="用户名／用户操作" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="dataListLoading" @click="searchData()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID"
      />
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名"
      />
      <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        label="用户操作"
      />
      <el-table-column
        prop="method"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="请求方法"
      />
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="请求参数"
      />
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="执行时长(毫秒)"
      />
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        width="150"
        label="IP地址"
      />
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
      />
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
  </div>
</template>

<script>
import { getSysLogList } from '@/api/sys'
export default {
  name: 'sys-log',
  data() {
    return {
      key: '',
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      selectionDataList: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    searchData() {
      this.pageIndex = 1
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      const { key, pageIndex, pageSize } = this
      getSysLogList(key, pageIndex, pageSize)
        .then(res => {
          console.log(res)
          const { records, total } = res.page
          this.dataList = records
          this.totalPage = total
        })
        .finally(() => {
          this.dataListLoading = false
        })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>
