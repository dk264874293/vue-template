<template>
  <div class="layout_content">
    <el-button v-if="isAuth('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      row-key="id"
      stripe
      border
      style="width: 100%;margin-top:22px "
    >
      <el-table-column
        prop="name"
        header-align="center"
        min-width="150"
        label="名称"
      />
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单"
      >
        <template slot-scope="scope">
          {{ scope.row.parentId === 0 ? '一级菜单': scope.row.parentName }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="图标"
      >
        <template slot-scope="scope">
          <SvgIcon :icon-class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序号"
      />
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      />
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
      />
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="changeOrUpdateHandle(scope.row)">修改</el-button>
          <el-button v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      :visible="updateVisible"
      :data-form="dataForm"
      :data-state="dataFormState"
      :menu-list="menuList"
      @visibleChange="updateVisibleChange"
      @submit="updateSubmit"
    />
  </div>
</template>

<script>
import AddOrUpdate from './menu-add-or-update'
import SvgIcon from '@/components/SvgIcon'
import { treeDataTranslate, isAuth } from '@/utils'
import { getSysMenuList, getSysMenuSelect,
  addSysMenu, changeSysMenu, delSysMenuDelete } from '@/api/sys'
export default {
  name: 'sys-menu',
  components: {
    AddOrUpdate,
    SvgIcon
  },
  data() {
    return {
      dataList: [],
      dataListLoading: false,
      updateVisible: false,
      isAuth,
      dataFormState: '',
      dataForm: {
        id: 0,
        type: 1,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      },
      menuList: []
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getSysMenuList()
        .then(({ data }) => {
          this.dataList = treeDataTranslate(data, 'id')
          this.dataListLoading = false
        })
      getSysMenuSelect()
        .then(res => {
          this.menuList = treeDataTranslate(res.menuList, 'id')
        })
    },
    // 切换状态
    updateVisibleChange() {
      const { updateVisible } = this
      this.updateVisible = !updateVisible
    },
    // 新增
    addOrUpdateHandle() {
      this.updateVisibleChange()
      this.dataFormState = 'new'
      this.dataForm = {
        id: 0,
        type: 1,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      }
    },
    // 修改
    changeOrUpdateHandle(item) {
      this.updateVisibleChange()
      this.dataFormState = 'change'
      const { parentName, parentId } = item
      this.dataForm = { ...item, parentName: parentId === 0 ? '一级菜单' : parentName }
    },
    // 提交
    updateSubmit(data, state) {
      let submitFn
      if (state === 'new') {
        submitFn = addSysMenu
      } else {
        submitFn = changeSysMenu
      }
      this.dataListLoading = true
      submitFn(data)
        .then(res => {
          this.$message.success('操作成功！')
          this.updateVisibleChange()
          this.getDataList()
        })
        .finally(() => {
          this.dataListLoading = false
        })
    },
    // 删除
    deleteHandle(item) {
      this.$confirm(`确定对[${item.name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dataListLoading = true
          delSysMenuDelete(item.id)
            .then(res => {
              this.$message.success('删除成功')
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
