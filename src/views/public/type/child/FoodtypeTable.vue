<template>
  <div id="foodTable">
    <div class="addtype">
      <div class="filter">
        <filter-container
          :types="types"
          @refresh="refresh"
          @searchbut="searchbut"
          @searchall="searchall"
        />
      </div>
      <el-button
        claas="addbut"
        @click="addgsForm"
        :visible.sync="dialogAddgsVisible"
        type="primary"
        icon="el-icon-plus"
      >新增</el-button>
    </div>
    <el-dialog :title="title" :visible.sync="dialogAddgsVisible" @close="closeDialogAddgsVisible">
      <el-form class="myform" :model="addForm" ref="addForm">
        <el-form-item label="一级分类">
          <el-select class="myinput" v-model="selectvalue" placeholder="请选择">
            <el-option v-for="item in types" :key="item.type" :label="item.type" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-input class="myinput" v-model="addForm.type"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="dialogAddgsVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      class="typetable"
      height="580"
      :data="tableShowData.slice((currpage - 1) * pagesize, currpage * pagesize)"
      border
      style="width: 100%"
    >
      <el-table-column label="序号" width="180" align="center">
        <template scope="scope">{{serial(currpage,pagesize,scope.$index)}}</template>
      </el-table-column>
      <el-table-column label="一级分类" width="220" align="center">
        <template slot-scope="scope">{{scope.row.fatype[0]}}</template>
      </el-table-column>
      <el-table-column label="二级分类" width="220" align="center">
        <template scope="scope">
          <el-input
            v-show="scope.row.state == 1"
            class="typetableinput"
            size="small"
            v-model="scope.row.type"
            placeholder="请输入内容"
          ></el-input>
          <span
            v-show="tableShowData[myindex(scope.$index)].state == 0"
            class="tablespan"
          >{{ scope.row.type }}</span>
          <el-button
            v-show="tableShowData[myindex(scope.$index)].state == 1"
            style="float:right"
            icon="el-icon-refresh"
            type="warning"
            size="mini"
            @click="handlebutton(scope.$index, scope.row, 1)"
          >取消</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="246" align="center">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.state == 0"
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="handlebutton(scope.$index, scope.row, 0)"
          >编辑</el-button>
          <el-button
            v-show="scope.row.state == 1"
            :icon="accomplish"
            type="success"
            size="mini"
            @click="handlebutton(scope.$index, scope.row, 2)"
          >完成</el-button>
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
import FilterContainer from "components/FilterContainer/FilterContainer";
import Pagination from "components/Pagination/Pagination";
import {
  isObjectValueEqual,
  myindexOf,
  Throttle,
  serial,
} from "utils/global.js";
import { isType } from "utils/validate.js";

import {
  queryfoodtypetable,
  querytable,
  count,
  updatafoodtype,
  addfoodtype,
} from "api/public/type.js";
export default {
  name: "app",
  data() {
    return {
      types: [],
      selectvalue: "",
      searchbutst: 0,
      all: "全部",
      mytypecount: 0,
      title: "新增",
      dialogAddgsVisible: false,
      addForm: {
        type: "",
      },
      copytypetableData: [],
      tableShowData: [],
      total: 50,
      currpage: 1,
      pagesize: 10,
      loading: true,
      ftid: 0,
      mytypes: [],
      accomplish: "el-icon-edit",
    };
  },
  components: {
    FilterContainer,
    Pagination,
  },
  filters: {
    myid(id) {
      let myid = id + "";
      return myid.substring(myid.length - 5, myid.length);
    },
  },

  methods: {
    refresh: Throttle(function () {
      console.log("刷新");
      this.tableShowData = [];
      this.copytypetableData = [];
      this.count("foodtype");
      this.typecount("type");
    }, 3000),
    // async refresh() {

    // },
    resetTotal() {
      this.total = this.tableShowData.length;
    },
    copyTableInfo() {
      this.tableShowData = JSON.parse(JSON.stringify(this.copytypetableData));
    },
    equSearchInput(searchinput) {
      for (let i = 0; i < this.tableShowData.length; i++) {
        console.log(this.tableShowData[i], searchinput);
        if (this.tableShowData[i].type.indexOf(searchinput) < 0) {
          this.tableShowData.splice(i, 1);
          i--;
        }
      }
    },
    equSearchSelect(searchselect) {
      for (let i = 0; i < this.tableShowData.length; i++) {
        console.log(this.tableShowData[i].fatype[0], searchselect);
        if (this.tableShowData[i].fatype[0] != searchselect) {
          this.tableShowData.splice(i, 1);
          i--;
        }
      }
    },
    searchbut(searchinput, searchselect) {
      this.tableShowData = JSON.parse(JSON.stringify(this.copytypetableData));
      if (searchinput == "" && searchselect == "") {
        this.searchbutst = 0;
      } else if (searchinput == "" && searchselect != "") {
        this.searchbutst = 1;
      } else if (searchinput != "" && searchselect == "") {
        this.searchbutst = 2;
      } else if (searchinput != "" && searchselect != "") {
        this.searchbutst = 3;
      }

      switch (this.searchbutst) {
        case 0:
          this.copyTableInfo();
          this.resetTotal();
          break;
        case 1:
          console.log(searchselect);
          if (searchselect == "全部") {
            this.copyTableInfo();
          } else {
            this.equSearchSelect(searchselect);
          }
          this.resetTotal();
          break;
        case 2:
          this.equSearchInput(searchinput);
          this.resetTotal();
          break;
        case 3:
          if (searchselect == "全部") {
            this.copyTableInfo();
            this.equSearchInput(searchinput);
            this.total = this.tableShowData.length;
          } else {
            this.equSearchSelect(searchselect);
            this.equSearchInput(searchinput);
            this.resetTotal();
          }
          break;
      }
    },
    searchall() {
      this.copyTableInfo();
      this.resetTotal();
    },

    filterTag(value, row) {
      console.log(value);
      console.log(row);
      return this.types.type === value;
    },
    addgsForm() {
      this.dialogAddgsVisible = true;
      this.title = "新增二级分类";
    },
    serial(currpage, pagesize, idnex) {
      return serial(currpage, pagesize, idnex);
    },
    closeDialogAddgsVisible() {
      this.$refs.addForm.resetFields(); //element封装的方法,清空模态框的值
      this.title = ""; //初始化title的值
      this.selectvalue = "";
      this.addForm = {
        //初始化addForm中的值
        type: "",
      };
    },
    saveAddForm(aaa) {
      this.$refs[aaa].validate((valid) => {
        let type = this.$refs[aaa].model.type;
        this.mytypes = [];
        for (let item in this.types) {
          this.mytypes.push(this.types[item].type);
        }
        console.log(this.mytypes);

        for (let item in this.mytypes) {
          if (this.mytypes[item] == this.selectvalue) {
            this.ftid = this.types[item]._id;
            console.log("一样");
          }
        }
        if (isType(type) && this.selectvalue != "") {
          this.encapsulation(addfoodtype(type, this.ftid))
            .then((res) => {
              if (res.data.errmsg == "ok" && res.data.resp_data == "null") {
                this.$message.error("类型重复，请重试");
              } else {
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
                this.dialogAddgsVisible = false;

                let newdata = {
                  _id: JSON.parse(res.data.resp_data)._id,
                  type: type,
                  state: 0,
                  fatype: [this.selectvalue],
                  ft_id: { $numberLong: this.ftid },
                };
                this.tableShowData.push(newdata);
                this.$store.commit("PUSH_FOODTYPES", newdata);
                let newdata2 = JSON.parse(JSON.stringify(newdata));
                console.log(newdata2);
                this.copytypetableData.push(newdata2);
                this.total++;
              }
            })
            .catch((err) => {
              this.$message.error("网络出错了，请重试");
            });
        } else {
          this.$message({
            message: "请输入正确的类型",
            type: "warning",
          });
        }
      });
    },
    async init() {
      let foodtypes = this.$store.state.TabModule.foodtypes;
      if (foodtypes.length > 0) {
        console.log(1);
        this.total = foodtypes.length;
        for (let i = 0; i < this.total; i++) {
          this.tableShowData.push("");
        }
        for (let item in foodtypes) {
          foodtypes[item].state = 0;
          this.tableShowData.splice(item, 1, foodtypes[item]);
        }
        this.loading = false;
        this.copytypetableData = JSON.parse(JSON.stringify(this.tableShowData));
        let types = this.$store.state.TabModule.types;
        this.mytypecount = types.length;
        for (let item in types) {
          types[item].state = 0;
          types[item].text = types[item].type;
          types[item].value = types[item].type;
          this.types.splice(item, 1, types[item]);
        }
      } else {
        await this.count("foodtype");
        await this.typecount("type");
      }
    },
    findtypes(limit, skip) {
      console.log(limit);
      this.encapsulation(querytable(limit, skip)).then((res) => {
        console.log(res);
        for (let item in res.data.data) {
          let itemdata = JSON.parse(res.data.data[item]);
          itemdata.state = 0;
          itemdata.text = itemdata.type;
          itemdata.value = itemdata.type;
          this.types.splice(item, 1, itemdata);
        }
        console.log(this.types);
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    typecount(type) {
      this.encapsulation(count(type)).then((res) => {
        this.mytypecount = res.data.count;
        this.findtypes(this.mytypecount, 0);
      });
    },
    handlebutton(index, row, type) {
      let myindex =
        parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
      console.log(myindex);
      console.log(
        this.tableShowData[myindex].type,
        this.copytypetableData[myindex].type
      );
      switch (type) {
        case 0:
          row.state = 1;
          console.log("编辑");
          console.log(myindex);
          this.tableShowData.splice(myindex, 1, row);
          break;
        case 1:
          row.state = 0;
          console.log("取消");
          this.tableShowData.splice(myindex, 1, row);
          console.log(
            this.tableShowData[myindex].type,
            this.copytypetableData[myindex].type
          );
          for (let item in this.copytypetableData) {
            if (
              this.copytypetableData[item]._id ==
              this.tableShowData[myindex]._id
            ) {
              this.tableShowData[myindex].type = this.copytypetableData[
                item
              ].type;
            }
          }
          this.$message({
            message: "类型已恢复为原始值",
            type: "warning",
          });
          break;
        case 2:
          console.log("完成");
          if (
            this.tableShowData[myindex].type !=
            this.copytypetableData[myindex].type
          ) {
            if (isType(this.tableShowData[myindex].type)) {
              this.accomplish = "el-icon-loading";
              this.encapsulation(
                updatafoodtype(
                  this.tableShowData[myindex]._id,
                  this.tableShowData[myindex].type
                )
              )
                .then((res) => {
                  this.accomplish = "el-icon-edit";
                  row.state = 0;
                  // this.tableShowData.splice(myindex, 1, row);
                  this.$message({
                    message: "类型修改成功",
                    type: "success",
                  });
                  this.copytypetableData[myindex].type = this.tableShowData[
                    myindex
                  ].type;
                })
                .catch((err) => {
                  row.state = 0;
                  this.$message.error("网络出错了，请重试");
                });
            } else {
              this.tableShowData[myindex].type = this.copytypetableData[
                myindex
              ].type;
              this.$message({
                message: "类型错误，请重试",
                type: "warning",
              });
              row.state = 0;
            }
          }
          row.state = 0;
          break;
      }
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.currpage = val;
      if (
        this.tableShowData[(this.currpage - 1) * this.pagesize] == "" ||
        this.tableShowData[(this.currpage - 1) * this.pagesize] == null
      ) {
        this.encapsulation(
          queryfoodtypetable(this.pagesize, (this.currpage - 1) * this.pagesize)
        )
          .then((res) => {
            console.log(res);
            for (let item in res.data.data) {
              let itemdata = JSON.parse(res.data.data[item]);
              itemdata.state = 0;
              this.tableShowData.splice(
                parseInt(item) + parseInt((this.currpage - 1) * this.pagesize),
                1,
                itemdata
              );
            }
            this.loading = false;
            this.copytypetableData = JSON.parse(
              JSON.stringify(this.tableShowData)
            );
            console.log(this.tableShowData);
            console.log(this.copytypetableData);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.loading = false;
        console.log("不空");
      }
    },
    myindex(index) {
      return parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
    },
    count(foodtype) {
      this.loading = true;
      this.encapsulation(count(foodtype)).then((res) => {
        this.total = res.data.count;
        this.initialization(this.total, 0);
      });
    },
    initialization(limit, skip) {
      this.loading = true;
      this.encapsulation(queryfoodtypetable(limit, skip))
        .then((res) => {
          console.log(res);
          for (let i = 0; i < this.total; i++) {
            this.tableShowData.push("");
          }
          for (let item in res.data.data) {
            let itemdata = JSON.parse(res.data.data[item]);
            itemdata.state = 0;
            this.tableShowData.splice(item, 1, itemdata);
          }
          this.loading = false;
          this.copytypetableData = JSON.parse(
            JSON.stringify(this.tableShowData)
          );
          console.log(this.tableShowData);
          console.log(this.copytypetableData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style  scoped>
.myform {
  width: 50%;
  margin: 0 auto;
}
.myinput {
  width: 300px;
}
.tablespan {
  height: 32px;
  display: inline-block;
}

.typetableinput {
  width: 100px;
}
.filter {
  float: left;
  margin-right: 10px;
}
.addbut {
  float: left;
}
.addtype {
  float: left;
}
</style>
