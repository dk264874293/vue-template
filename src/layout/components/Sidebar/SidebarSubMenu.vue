<template>
  <el-submenu
    v-if="menu.list && menu.list.length >= 1 && filterMenu(menu)"
    :index="menu.id + ''"
  >
    <template slot="title">
      <SvgIcon :icon-class="menu.icon || ''" />
      <!-- <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon" /> -->
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu
      v-for="item in menu.list"
      :key="item.id"
      :menu="item"
      :dynamic-menu-routes="dynamicMenuRoutes"
    />
  </el-submenu>
  <el-menu-item v-else-if="dynamicMenuRoutes.includes(menu.url.replace('/', '-')) " :index="'/' + menu.url.replace('/', '-')" @click="gotoRouteHandle(menu)">
    <SvgIcon :icon-class="menu.icon || ''" />
    <!-- <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon" /> -->
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './SidebarSubMenu'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'SubMenu',
  components: {
    SubMenu, SvgIcon
  },
  props: {
    menu: {
      type: Object,
      required: true
    },
    dynamicMenuRoutes: {
      type: Array,
      required: true
    }
  },
  methods: {
    filterMenu(item) {
      const { dynamicMenuRoutes } = this
      let flag = false
      for (const list of item.list) {
        if (dynamicMenuRoutes.includes(list.url.replace('/', '-'))) {
          flag = true
        }
      }
      return flag
    },
    gotoRouteHandle(menu) {
      this.$router.push(menu.url.replace('/', '-'))
    }
  }
}
</script>
