<template>
  <div id="MangerMenu">
    <div class="tabs">
      <el-tabs class="el-tabs" @tab-click="handleClick" v-model="activetap">
        <el-tab-pane label="用户发布菜谱" name="first">
          <Umenu ref="Umenu" />
        </el-tab-pane>
        <el-tab-pane label="管理员发布菜谱" name="second">
          <AddMneu ref="add_menu" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script type="text/javascript">
import Umenu from "./child/U_menu";
import AddMneu from "./child/Add_menu";
import { count, get_lables } from "api/menu/menu";
export default {
  name: "MangerMenu",
  data() {
    return {
      activetap: "first",
      tapsatae: [true, true],
    };
  },
  components: { Umenu, AddMneu },
  created() {
    this.init();
  },
  methods: {
    init() {},
    async get_lables() {},
    handleClick(tab, event) {
      switch (tab.name) {
      }
    },
  },
};
</script>

<style scoped>
.el-tabs {
  height: 40px;
  line-height: 40px;
}
.tabs {
  height: 40px;
}
</style>
