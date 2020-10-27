<template>
  <div id="home">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="轮播图管理" name="first"><swiper /></el-tab-pane>
      <el-tab-pane label="首页热门推荐设置" name="second"
        >首页热门推荐设置</el-tab-pane
      >
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import Swiper from "./child/swiper";
export default {
  name: "home",
  data() {
    return { activeName: "first" };
  },
  components: { Swiper },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style scoped></style>
