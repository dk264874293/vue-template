<template>
  <div class="layout_content">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-loading="dataListLoading" type="primary" @click="configVisibleChange()">云存储配置</el-button>
        <el-button v-loading="dataListLoading" type="primary" @click="uploadVisibleChange()">上传文件</el-button>
        <el-button v-loading="dataListLoading" type="danger" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID"
      />
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="URL地址"
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
          <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:10px"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <!-- 弹窗, 云存储配置 -->
    <config
      ref="config"
      :visible="configVisible"
      @visibleChange="configVisibleChange"
    />
    <!-- 弹窗, 上传文件 -->
    <upload
      ref="upload"
      :visible="uploadVisible"
      @refreshData="refreshData"
      @visibleChange="uploadVisibleChange"
    />
  </div>
</template>

<script>
import Config from './oss-config'
import Upload from './oss-upload'

import { getSysOssGetPage, defSysOssDelete } from '@/api/sys'
export default {
  components: {
    Config,
    Upload
  },
  data() {
    return {
      dataForm: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      configVisible: false,
      uploadVisible: false
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      const { pageIndex, pageSize } = this
      getSysOssGetPage(pageIndex, pageSize)
        .then(res => {
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
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 切换云存储配置
    configVisibleChange() {
      const { configVisible } = this
      this.configVisible = !configVisible
    },
    uploadVisibleChange() {
      const { uploadVisible } = this
      this.uploadVisible = !uploadVisible
    },
    refreshData() {
      this.uploadVisibleChange()
      this.getDataList()
    },
    // 删除
    deleteHandle(item) {
      const items = item ? [item] : this.dataListSelections
      this.$confirm(`确定对[i${items.map(_ => _.name).join(',')}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dataListLoading = true
        defSysOssDelete(items.map(_ => _.id))
          .then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getDataList()
          })
          .finally(() => {
            this.dataListLoading = false
          })
      })
    }
  }
}
</script>
