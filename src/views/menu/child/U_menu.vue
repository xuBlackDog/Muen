<template>
  <div id="MyMenu">
    <Dialog :title="title" ref="dialog" />
    <el-button class="refs" @click="refs" type="warning">重新加载</el-button>
    <el-table
      v-loading="loading"
      :data="
        tableShowData.slice((currpage - 1) * pagesize, currpage * pagesize)
      "
      border
      height="550"
      :cell-style="rowStyle"
      style="width: 100%;font-size:12px"
    >
      <el-table-column label="序号" width="50" align="center">
        <template scope="scope">{{ serial(scope.$index) }}</template>
      </el-table-column>

      <el-table-column sortable prop="createdate" label="创建时间" width="96" align="center"></el-table-column>
      <el-table-column label="图片" width="105" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 70px; height: 70px"
            :src="url + scope.row.masterimgurl"
            :preview-src-list="srcList"
            lazy
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="dname" label="菜名" width="110" align="center">
        <template slot-scope="scope">
          <el-link @click="$refs.dialog.open_dialog(scope.row)" type="primary" class="a_link">
            {{ scope.row.dname }}
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="90" align="center">
        <template slot-scope="scope">
          {{
          scope.row.user == []
          ? "管理员"
          : '用户发布'
          }}
        </template>
      </el-table-column>
      <el-table-column label="分类标签" width="170" align="center">
        <template slot-scope="scope">
          <span v-for="item in scope.row.labels" :key="item">
            &nbsp;
            <el-tag size="mini" type="warning">{{ item }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" width="70" align="center">
        <template slot-scope="scope">{{ format(scope.row.browse) }}</template>
      </el-table-column>

      <el-table-column label="收藏量" width="70" align="center">
        <template slot-scope="scope">{{ format(scope.row.collect) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="216" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag :type="scope.row.choiceness == 0 ? 'success' : 'info'">
              {{
              scope.row.choiceness == 0 ? "精选中" : "未精选"
              }}
            </el-tag>&nbsp;
            <el-tag :type="scope.row.recommend == 0 ? 'success' : 'info'">
              {{
              scope.row.recommend == 0 ? "已推荐" : "未推荐"
              }}
            </el-tag>&nbsp;
            <el-tag
              disable-transitions
              :type="scope.row.state == 0 ? 'success' : 'info'"
            >{{ scope.row.state == 0 ? "已上架" : "未上架" }}</el-tag>&nbsp;
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <div class="edits">
            <el-button
              :icon="scope.row.icon_choiceness"
              @click="set_choiceness(scope.$index, scope.row)"
              size="mini"
              :type="scope.row.choiceness == 1 ? 'success' : 'info'"
            >{{ scope.row.choiceness == 1 ? "精选" : "取消精选" }}</el-button>

            <el-button
              :icon="scope.row.icon_medal"
              @click="set_recommend(scope.$index, scope.row)"
              size="mini"
              :type="scope.row.recommend == 1 ? 'success' : 'info'"
            >{{ scope.row.recommend == 1 ? "推荐" : "取消推荐" }}</el-button>
            <el-button
              @click="set_state(scope.$index, scope.row)"
              :icon="scope.row.icon_state"
              size="mini"
              :type="scope.row.state == 1 ? 'warning' : 'danger'"
            >{{ scope.row.state == 1 ? "上架" : "下架" }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      @handleSizeChange="handleSizeChange"
      :currentPage="currpage"
      @handleCurrentChange="handleCurrentChange"
      :total="total"
    />
  </div>
</template>

<script type="text/javascript">
import Dialog from "components/Dialog/Dialog";
import FilterContainer from "components/FilterContainer/FilterContainer";
import Pagination from "components/Pagination/Pagination";
import { count, get_menus, up_menu_st } from "api/menu/menu.js";
import { serial } from "utils/global.js";

export default {
  name: "MyMenu",
  data() {
    return {
      title: "详情",
      loading: true,
      tableShowData: [],
      currpage: 1,
      pagesize: 10,
      total: 50,
      url: null,
      srcList: [],
      row: {},
    };
  },
  components: { FilterContainer, Pagination, Dialog },
  created() {
    this.url = this.$store.state.wx_url;
    this.init();
  },

  methods: {
    refs() {
      this.init();
    },
    set_recommend(index, row) {
      let myindex =
        parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
      console.log(row, myindex);
      this.tableShowData[myindex].icon_medal = "el-icon-loading";
      console.log(row.recommend);
      if (row.recommend == "0") {
        console.log("取消推荐");
        this.encapsulation(up_menu_st(row._id, row.choiceness, "1", row.state))
          .then((res) => {
            console.log(res);
            row.recommend = 1;
            this.tableShowData.splice(myindex, 1, row);
            this.copytypetableData[myindex].recommend = this.tableShowData[
              myindex
            ].recommend;
            this.tableShowData[myindex].icon_medal = "el-icon-star-on";
            this.$message({
              type: "success",
              message: "取消推荐成功!",
            });
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("网络错误，请重试");
            this.tableShowData[myindex].icon_medal = "el-icon-star-on";
          });
      } else {
        console.log("设为推荐");
        this.encapsulation(up_menu_st(row._id, row.choiceness, "0", row.state))
          .then((res) => {
            console.log(res);
            row.recommend = 0;
            this.tableShowData.splice(myindex, 1, row);
            this.copytypetableData[myindex].recommend = this.tableShowData[
              myindex
            ].recommend;

            this.tableShowData[myindex].icon_medal = "el-icon-star-on";
            this.$message({
              type: "success",
              message: "设为推荐成功",
            });
          })
          .catch((err) => {
            this.$message.error("网络错误，请重试");
            this.tableShowData[myindex].icon_medal = "el-icon-star-on";
          });
      }
    },
    set_state(index, row) {
      let myindex =
        parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
      console.log(row, myindex);
      this.tableShowData[myindex].icon_state = "el-icon-loading";
      console.log(row.recommend);
      if (row.state == "0") {
        console.log("下架");
        this.encapsulation(
          up_menu_st(row._id, row.choiceness, row.recommend, "1")
        )
          .then((res) => {
            console.log(res);
            row.state = 1;
            this.tableShowData.splice(myindex, 1, row);
            this.copytypetableData[myindex].state = this.tableShowData[
              myindex
            ].state;
            this.tableShowData[myindex].icon_state = "el-icon-close";
            this.$message({
              type: "success",
              message: "下架成功!",
            });
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("网络错误，请重试");
            this.tableShowData[myindex].icon_state = "el-icon-close";
          });
      } else {
        console.log("上架");
        this.encapsulation(
          up_menu_st(row._id, row.choiceness, row.recommend, "0")
        )
          .then((res) => {
            console.log(res);
            row.state = 0;
            this.tableShowData.splice(myindex, 1, row);
            this.copytypetableData[myindex].state = this.tableShowData[
              myindex
            ].state;
            this.tableShowData[myindex].icon_state = "el-icon-close";
            this.$message({
              type: "success",
              message: "上架成功",
            });
          })
          .catch((err) => {
            this.$message.error("网络错误，请重试");
            this.tableShowData[myindex].icon_state = "el-icon-close";
          });
      }
    },

    serial(idnex) {
      return serial(this.currpage, this.pagesize, idnex);
    },
    set_choiceness(index, row) {
      let myindex =
        parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
      console.log(row, myindex);
      this.tableShowData[myindex].icon_choiceness = "el-icon-loading";
      if (row.choiceness == "0") {
        console.log("取消精选");
        this.encapsulation(up_menu_st(row._id, "1", row.recommend, row.state))
          .then((res) => {
            console.log(res);
            row.choiceness = 1;
            this.tableShowData.splice(myindex, 1, row);
            this.copytypetableData[myindex].choiceness = this.tableShowData[
              myindex
            ].choiceness;
            this.tableShowData[myindex].icon_choiceness = "el-icon-star-on";
            this.$message({
              type: "success",
              message: "取消成功!",
            });
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("网络错误，请重试");
            this.tableShowData[myindex].icon_choiceness = "el-icon-star-on";
          });
      } else {
        console.log("设为精选");
        this.encapsulation(up_menu_st(row._id, "0", row.recommend, row.state))
          .then((res) => {
            row.choiceness = 0;
            this.tableShowData.splice(myindex, 1, row);
            this.copytypetableData[myindex].choiceness = this.tableShowData[
              myindex
            ].choiceness;

            this.tableShowData[myindex].icon_choiceness = "el-icon-star-on";
            this.$message({
              type: "success",
              message: "精选成功",
            });
          })
          .catch((err) => {
            this.$message.error("网络错误，请重试");
            this.tableShowData[myindex].icon_choiceness = "el-icon-star-on";
          });
      }
    },

    handleSizeChange(val) {
      this.pagesize = val;
    },
    rowStyle() {
      return "height: 10px";
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.currpage = val;
      if (
        this.tableShowData[(this.currpage - 1) * this.pagesize] == "" ||
        this.tableShowData[(this.currpage - 1) * this.pagesize] == null
      ) {
      } else {
        this.loading = false;
        console.log("不空");
      }
    },

    format(param) {
      var str = param;
      if (param.length > 4) {
        var str1 = str.substring(0, str.length - 4);
        var str2 = str.substring(str1.length, 1);
        if (str2.length == 0) {
          var str3 = str1 + "." + 0 + "k";
        } else {
          var str3 = str1 + "." + str2 + "k";
        }
        return str3;
      } else {
        return param;
      }
    },

    async init() {
      this.loading = true;
      await this.get_menu_count();
    },
    get_menu_count() {
      this.encapsulation(count("menu")).then((res) => {
        this.total = res.data.count;
        // this.initialization(this.total, 0);
        this.get_menus(res.data.count, 0);
      });
    },
    get_menus(limit, skip) {
      this.encapsulation(get_menus(limit, skip)).then((res) => {
        for (let i = 0; i < this.total; i++) {
          this.tableShowData.push("");
        }
        for (let item in res.data.data) {
          let itemdata = JSON.parse(res.data.data[item]);
          itemdata.mystate = 0;
          itemdata.icon_choiceness = "el-icon-star-on";
          itemdata.icon_medal = "el-icon-medal";
          itemdata.icon_state = "el-icon-close";
          this.tableShowData.splice(item, 1, itemdata);
        }
        for (let i = 0; i < this.tableShowData.length; i++) {
          this.srcList.push(this.url + this.tableShowData[i].masterimgurl);
        }
        this.loading = false;
        this.copytypetableData = JSON.parse(JSON.stringify(this.tableShowData));
      });
    },
  },
};
</script>

<style scoped>
.refs {
  float: right;
}
.a_link {
  font-size: 12px;
}
#MyMenu {
  height: 100%;
  width: 100%;
}
.edits {
  display: flex;
}
.tags span {
  margin-right: 10px;
}
.edits button {
  flex: 1;
}
</style>
