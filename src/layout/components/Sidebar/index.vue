<!--
 * @Descripttion:
 * @version:
 * @Author: peiliang.wang
 * @Date: 2020-05-16 14:24:51
 * @LastEditors: peiliang.wang
 * @LastEditTime: 2020-05-18 10:26:06
 * @Description:
 * @Version:
 * @Autor: peiliang.wang
-->
<template>
  <div>
    <div v-show="!isCollapse" class="title">宏原SCRM系统</div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarSubMenu
          v-for="menu of roles"
          :key="menu.menuId"
          :menu="menu"
          :dynamic-menu-routes="permission_routes"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarSubMenu from './SidebarSubMenu'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarSubMenu },
  computed: {
    ...mapGetters([
      'roles',
      'sidebar',
      'permission_routes'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  background-color: #3674EF;
  line-height: 60px;
  font-size: 22px;
  color: #fff;
  text-align: center;
  // font-weight:bold;
}
</style>
