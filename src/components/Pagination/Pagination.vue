<template>
  <div id="Pagination">
    <el-pagination
      @size-change="handleSizeChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Pagination",
  props: {
    total: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 30, 50, 100],
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
  },
  data() {
    return {};
  },
  components: {},
};
</script>

<style  scoped>
</style>
