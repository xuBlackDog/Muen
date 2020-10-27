<template>
  <div id="typeManage">
    <div class="tabs">
      <el-tabs class="el-tabs" @tab-click="handleClick" v-model="activetap">
        <el-tab-pane label="三级分类" name="first">
          <food ref="food" />
        </el-tab-pane>
        <el-tab-pane label="二级分类" name="second">
          <foodtype-table ref="foodtype" />
        </el-tab-pane>
        <el-tab-pane label="一级分类" name="third">
          <type-table ref="type" />
        </el-tab-pane>
        <el-tab-pane label="标签管理" name="four">
          <labels ref="labels" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script type="text/javascript">
import TypeTable from "./child/TypeTable";
import FoodtypeTable from "./child/FoodtypeTable";
import Food from "./child/Food";
import Labels from "./child/Label";
import { count, querytable, queryfoodtypetable } from "api/public/type.js";
export default {
  name: "type",
  data() {
    return {
      activetap: "first",
      tapsatae: [true, true, true],
    };
  },

  components: { TypeTable, FoodtypeTable, Food, Labels },

  methods: {
    async init() {
      await this.$refs.food.init();
      await this.getCount();
      await this.getFoodTyoe();
    },

    getFoodTyoe() {
      this.encapsulation(count("foodtype")).then((res) => {
        this.getFoodTypes(res.data.count, 0);
      });
    },
    getFoodTypes(limit, skip) {
      this.encapsulation(queryfoodtypetable(limit, skip))
        .then((res) => {
          let types = [];
          for (let i = 0; i < this.total; i++) {
            types.push("");
          }
          for (let item in res.data.data) {
            let itemdata = JSON.parse(res.data.data[item]);
            itemdata.state = 0;
            types.splice(item, 1, itemdata);
          }
          console.log(types);
          this.$store.commit("SET_FOODTYPES", types);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getCount() {
      this.encapsulation(count("type")).then((res) => {
        // this.$store.commit("SET_COUNT", res.data.count);
        this.getTypes(res.data.count, 0);
      });
    },
    getTypes(limit, skip) {
      console.log(limit, skip);
      this.encapsulation(querytable("type", limit, skip)).then((res) => {
        let types = [];
        console.log(res);
        for (let item in res.data.data) {
          let itemdata = JSON.parse(res.data.data[item]);
          itemdata.state = 0;
          itemdata.text = itemdata.type;
          itemdata.value = itemdata.type;
          types.splice(item, 1, itemdata);
        }
        console.log(types);
        this.$store.commit("SET_TYPE", types);
      });
    },
    handleClick(tab, event) {
      switch (tab.name) {
        case "second":
          if (this.tapsatae[0]) {
            this.tapsatae[0] = false;
            this.$refs.foodtype.init();
          }
          break;
        case "third":
          if (this.tapsatae[1]) {
            this.$refs.type.init();
            this.tapsatae[1] = false;
          }
          break;
        case "four":
          if (this.tapsatae[2]) {
            this.$refs.labels.init();
            this.tapsatae[2] = false;
          }
          break;
      }
    },
  },
  mounted: function() {
    this.init();
  },
};
</script>

<style scoped>
.el-tabs {
  height: 50px;
  line-height: 40px;
}
.tabs {
  height: 50px;
}
</style>
