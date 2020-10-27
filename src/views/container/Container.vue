<template>
  <div id="app">
    <el-container style="height:100vh">
      <el-aside style="background-color:red" width="200px">
        <el-menu
          @select="select"
          router
          style="height:100vh"
          class="el-menu-vertical-demo"
          background-color="#fff7ff"
          active-text-color="#409EFF"
          text-color="block"
        >
          <div v-for="(item, i) in navList" :key="i">
            <el-menu-item v-if="item.child < 1" :index="item.name">
              <i :class="item.icon"></i>
              {{ item.navItem }}
            </el-menu-item>
            <el-submenu v-else :index="item.name">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.navItem }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(chileitem, i) in item.child"
                  :key="i"
                  :index="chileitem.name"
                >
                  <span :class="chileitem.icon"
                    >&nbsp; &nbsp; &nbsp;{{ chileitem.navItem }}</span
                  >
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height="56px" style="background-color: #fff;">
          <div class="crumbs">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/dashboard' }"
                >首页1</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
          <div class="manageinfo">
            <div class="userinfo">
              <img
                src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
                alt
              />
              <span>&nbsp;{{ admin_info.username }}</span>
              &emsp;
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <i class="el-icon-s-tools"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item split-button>个人资料</el-dropdown-item>
                  <el-dropdown-item split-button @click.native="quit"
                    >退出</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        <el-main style="background-color: #fff;">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script type="text/javascript">
import SvgIcon from "components/SvgIcon/index";
export default {
  name: "container",
  data() {
    return {
      admin_info: {},
      navList: [
        {
          name: "/index",
          navItem: "首页",
          icon: "el-icon-odometer",
          child: [],
        },
        {
          name: "/public",
          navItem: "公共管理",
          icon: "el-icon-s-home",
          child: [
            {
              name: "/public/home",
              navItem: "首页管理",
              icon: "el-icon-s-home",
            },
            {
              name: "/public/type",
              navItem: "分类管理",
              icon: "el-icon-menu",
            },
          ],
        },
        {
          name: "/user",
          navItem: "用户管理",
          icon: "el-icon-user-solid",
          child: [],
        },
        {
          name: "/menu",
          navItem: "菜谱管理",
          icon: "el-icon-s-order",
          child: [],
        },
        {
          name: "/table",
          navItem: "电子表格",
          icon: "el-icon-s-grid",
          child: [],
        },
      ],
      breadcrumbs: {},
    };
  },
  created() {
    this.admin_info = JSON.parse(localStorage.getItem("user"));
  },
  mounted() {},
  computed: {},
  components: {
    SvgIcon,
  },
  methods: {
    quit() {
      this.$router.push("/");
      localStorage.removeItem("user");
    },
    select(index) {},
  },
  components: {},
};
</script>

<style scoped>
.el-header {
  background-color: #fff;
}
.userinfo img {
  vertical-align: middle;
  height: 35px;
  width: 34px;
  border-radius: 20%;
}
.el-header {
  position: relative;
}
.manageinfo {
  font-size: 18px;
  float: right;
  height: 80%;
  width: 13%;

  margin: 5px 0px;
  line-height: 44px;
}
.crumbs {
  float: left;
  height: 50%;
  width: 30%;
  margin: 17px 10px;
  line-height: 34px;
}

/* .el-menu .el-menu-item,
.el-submenu {
  margin-left: -70px;
} */
.el-submenu .el-menu-item-group span {
  margin-left: 10px;
  font-size: 15px;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 33px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
