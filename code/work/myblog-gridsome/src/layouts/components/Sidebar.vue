<template>
  <div class="el-col el-col-6" style="padding-right: 10px">
    <div>
      <el-card shadow="never">
        <el-menu :default-active="active" @select="onSelect">
          <el-menu-item
            v-for="item in constantRouterMap"
            :key="item.path"
            :index="item.path"
          >
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-card>

      <!-- <div class="el-card is-never-shadow">
        <div class="el-card__body">
          <ul role="menubar" class="el-menu">
            <li
              v-for="item in constantRouterMap"
              :key="item.path"
              :index="item.path"
              role="menuitem"
              tabindex="-1"
              class="el-menu-item is-active"
              style="padding-left: 20px"
            >
              <i :class="item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </li>
          </ul>
        </div>
      </div> -->

      <!-- <div class="el-card is-never-shadow">
        <div class="el-card__body">
          <ul role="menubar" class="el-menu">
            <li
              role="menuitem"
              tabindex="-1"
              class="el-menu-item is-active"
              style="padding-left: 20px"
            >
              <g-link to="/new">
                <i class="el-icon-star-off"></i> <span>最新动态</span></g-link
              >
            </li>
            <li
              role="menuitem"
              tabindex="-1"
              class="el-menu-item"
              style="padding-left: 20px"
            >
              <g-link to="/social">
                <i class="el-icon-mobile-phone"></i> <span>社交圈</span>
              </g-link>
            </li>
            <li
              role="menuitem"
              tabindex="-1"
              class="el-menu-item"
              style="padding-left: 20px"
            >
              <g-link to="/blog">
                <i class="el-icon-edit-outline"></i> <span>博客列表</span>
              </g-link>
            </li>
            <li
              role="menuitem"
              tabindex="-1"
              class="el-menu-item"
              style="padding-left: 20px"
            >
              <g-link to="/project">
                <i class="el-icon-service"></i> <span>开源项目</span>
              </g-link>
            </li>
            <li
              role="menuitem"
              tabindex="-1"
              class="el-menu-item"
              style="padding-left: 20px"
            >
              <i class="el-icon-printer"></i> <span>使用帮助</span>
            </li>
            <li
              role="menuitem"
              tabindex="-1"
              class="el-menu-item"
              style="padding-left: 20px"
            >
              <i class="el-icon-document"></i> <span>README.md</span>
            </li>
          </ul>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
// import { constantRouterMap } from "../../router";
export default {
  name: "SidebarPage",
  data() {
    return {
      constantRouterMap: [
        {
          path: "/new",
          meta: {
            icon: "el-icon-star-off",
            title: "最新动态",
          },
        },
        {
          path: "/social",
          meta: {
            icon: "el-icon-mobile-phone",
            title: "社交圈",
          },
        },
        {
          path: "/blog",
          meta: {
            icon: "el-icon-edit-outline",
            title: "博客列表",
          },
        },
        {
          path: "/project",
          meta: {
            icon: "el-icon-service",
            title: "开源项目",
          },
        },
      ],
      active: "",
    };
  },
  methods: {
    onSelect(index) {
      if (index === this.active) {
        return;
      }
      this.$router.push(index);
    },
  },
  mounted() {
    let arr = this.$route.path.split("/");
    this.active = "/" + arr[1];
  },
};
</script>