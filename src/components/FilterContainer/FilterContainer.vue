<template>
  <div id="filterContainer">
    <slot name="input">
      <el-input v-model="searchinput" class="searchinput" :placeholder="placeholder"></el-input>
    </slot>
    <slot name="select">
      <el-select class="searchselect" v-model="searchselect" placeholder="请选择一级分类">
        <el-option :value="all">全部</el-option>
        <el-option v-for="item in types" :key="item.type" :label="item.type" :value="item.type"></el-option>
      </el-select>
    </slot>
    <el-button @click.native="searchbut" icon="el-icon-search" type="success">搜索</el-button>
    <el-button @click="searchall" icon="el-icon-search" type="success">查询全部</el-button>
    <el-button @click="refresh" icon="el-icon-refresh" type="warning">刷新</el-button>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "filterContainer",
  props: {
    types: {
      tyep: Array,
      default: [],
    },
    placeholder: {
      type: String,
      default: "请输入二级分类",
    },
  },
  data() {
    return {
      all: "全部",
      searchinput: "",
      searchselect: "",
    };
  },
  methods: {
    searchbut() {
      this.$emit("searchbut", this.searchinput, this.searchselect);
    },
    searchall() {
      this.$emit("searchall");
    },
    refresh() {
      this.$emit("refresh");
    },
  },
};
</script>

<style scoped>
.searchselect {
  width: 160px;
  margin: 0px 10px;
}
.searchinput {
  float: left;
  width: 270px;
}
</style>
