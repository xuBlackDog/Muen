<template>
  <div id="food">
    <div class="addtype">
      <div class="filter">
        <filter-container
          :types="types"
          :placeholder="placeholder"
          @searchbut="searchbut"
          @refresh="refresh"
          @searchall="searchall"
        >
          <div class="solo" slot="select">
            <el-select
              @change="firstSelectChange"
              class="searchselect"
              v-model="firstSelect"
              placeholder="请选择一级分类"
            >
              <el-option
                v-for="item in this.$store.state.TabModule.types"
                :key="item.type"
                :label="item.type"
                :value="item.type"
              ></el-option>
            </el-select>
            <el-select class="searchselect" v-model="secondSelect" placeholder="请选择二级分类">
              <el-option
                v-for="item in activeType"
                :key="item.type"
                :label="item.type"
                :value="item.type"
              ></el-option>
            </el-select>
          </div>
        </filter-container>
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
          <el-select
            class="myinput"
            @change="add_firstSelectChange"
            v-model="add_firstSelect"
            placeholder="请选择"
          >
            <el-option
              v-for="item in this.$store.state.TabModule.types"
              :key="item.type"
              :label="item.type"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select class="myinput" v-model="add_secondSelect" placeholder="请选择">
            <el-option
              v-for="item in add_activeType"
              :key="item.type"
              :label="item.type"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级级分类">
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
        <template slot-scope="scope">{{scope.row.tas[0].type}}</template>
      </el-table-column>
      <el-table-column label="二级分类" width="220" align="center">
        <template slot-scope="scope">{{scope.row.ftas[0].type}}</template>
      </el-table-column>
      <el-table-column label="三级分类" width="220" align="center">
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
      <el-table-column label="操作" width="280" align="center">
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
          <el-button
            @click="del_food(scope.$index, scope.row)"
            icon="el-icon-delete"
            size="mini"
            type="danger"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      @handleSizeChange="handleSizeChange"
      :currentPage="currpage"
      @handleCurrentChange="handleCurrentChange"
      :total="total"
    />
    <!-- <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :total="total"></el-pagination> -->
  </div>
</template>

<script type="text/javascript">
import FilterContainer from "components/FilterContainer/FilterContainer";
import Pagination from "components/Pagination/Pagination";
import { Throttle, serial } from "utils/global.js";

import {
  queryfoodtable,
  querytypetable,
  count,
  updatafood,
  addfood,
  del_food,
} from "api/public/type.js";
import { isType } from "utils/validate.js";
export default {
  name: "food",
  data() {
    return {
      types: [],
      searchselect: "",
      firstSelect: "",
      secondSelect: "",
      activeType: [],
      add_activeType: [],
      dialogAddgsVisible: false,
      loading: true,
      placeholder: "请输入三级分类",
      add_firstSelect: "",
      add_secondSelect: "",
      searchbutst: 0,
      copytypetableData: [],
      tableShowData: [],
      all: "全部",
      total: 50,
      addForm: {
        type: "",
      },
      title: "新增",
      currpage: 1,
      pagesize: 10,
      mytypes: [],
      accomplish: "el-icon-edit",
    };
  },
  components: { FilterContainer, Pagination },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
    },
    refresh: Throttle(function () {
      this.tableShowData = [];
      this.copytypetableData = [];
      this.loading = false;
      this.count("food");
      this.loading = true;
    }, 3000),
    del_food(index, row) {
      this.$confirm("此操作将永久该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.encapsulation(del_food(row._id))
            .then((res) => {
              console.log(res);
              for (let item in this.tableShowData) {
                if (row._id == this.tableShowData[item]._id) {
                  this.tableShowData.splice(item, 1);
                }
              }
              for (let item in this.copytypetableData) {
                if (row._id == this.copytypetableData[item]._id) {
                  this.copytypetableData.splice(item, 1);
                }
              }
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    serial(currpage, pagesize, idnex) {
      return serial(currpage, pagesize, idnex);
    },
    saveAddForm(aaa) {
      this.$refs[aaa].validate((valid) => {
        let type = this.$refs[aaa].model.type;
        let _fid = ""; //二级
        let _ftid = ""; // 一级
        let types = this.$store.state.TabModule.types;
        for (let item in types) {
          if (this.add_firstSelect == types[item].type) {
            _ftid = types[item]._id;
          }
        }
        for (let item in this.add_activeType) {
          if (this.add_secondSelect == this.add_activeType[item].type) {
            _fid = this.add_activeType[item]._id;
          }
        }
        console.log(_fid, _ftid);
        if (
          isType(type) &&
          this.add_firstSelect != "" &&
          this.add_secondSelect != ""
        ) {
          this.encapsulation(addfood(type, _ftid, _fid))
            .then((res) => {
              if (res.data.errmsg == "ok" && res.data.resp_data == "null") {
                this.$message.error("类型重复，请重试");
              } else {
                console.log(res);
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
                this.dialogAddgsVisible = false;
                let newdata = {
                  _id: JSON.parse(res.data.resp_data)._id,

                  type,
                  state: 0,
                  _ftid,
                  _fid,
                  ftas: [{ type: this.add_secondSelect, _id: _fid }],
                  tas: [{ type: this.add_firstSelect, _id: _ftid }],
                };
                console.log(newdata);
                this.tableShowData.push(newdata);
                let newdata2 = JSON.parse(JSON.stringify(newdata));
                this.copytypetableData.push(newdata2);
                this.total++;
                console.log(this.tableShowData);
                console.log(this.copytypetableData);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("网络出错了，请重试");
            });
        } else {
          console.log(type);
          this.$message({
            message: "请输入正确的类型",
            type: "warning",
          });
        }
      });
    },
    resetTotal() {
      this.total = this.tableShowData.length;
    },
    copyTableInfo() {
      this.tableShowData = JSON.parse(JSON.stringify(this.copytypetableData));
    },
    filterinput(input) {
      console.log("文本框不为空");
      for (let i = 0; i < this.tableShowData.length; i++) {
        if (this.tableShowData[i].type.indexOf(input) < 0) {
          this.tableShowData.splice(i, 1);
          i--;
        }
      }
      console.log(this.tableShowData);
    },
    eq_firstSelect() {
      console.log(this.tableShowData);
      for (let i = 0; i < this.tableShowData.length; i++) {
        if (this.tableShowData[i].tas[0].type != this.firstSelect) {
          this.tableShowData.splice(i, 1);
          i--;
        }
      }
      console.log(this.tableShowData);
    },
    eq_secondSelect() {
      console.log(this.tableShowData);
      for (let i = 0; i < this.tableShowData.length; i++) {
        if (this.tableShowData[i].ftas[0].type != this.secondSelect) {
          this.tableShowData.splice(i, 1);
          i--;
        }
      }
      console.log(this.tableShowData);
    },
    searchbut(searchinput) {
      this.copyTableInfo();
      console.log(this.tableShowData);
      if (this.firstSelect == "" && this.secondSelect == "") {
        this.searchbutst = 0;
      } else if (this.firstSelect != "" && this.secondSelect == "") {
        this.searchbutst = 1;
      } else if (this.firstSelect != "" && this.secondSelect != "") {
        this.searchbutst = 2;
      }
      console.log(this.searchbutst);
      switch (this.searchbutst) {
        case 0:
          if (searchinput != "") {
            this.filterinput(searchinput);
          }
          this.resetTotal();
          break;
        case 1:
          //  一级==肉类  二级==null
          this.eq_firstSelect();
          if (searchinput != "") {
            this.filterinput(searchinput);
          }
          this.resetTotal();
          break;
        case 2:
          this.eq_secondSelect();
          if (searchinput != "") {
            this.filterinput(searchinput);
          }
          this.resetTotal();
          // 一级==肉类  二级==猪肉
          break;
      }
      this.currpage = 1;
    },
    addgsForm() {
      this.dialogAddgsVisible = true;
      this.title = "新增三级分类";
    },
    searchall() {
      this.copyTableInfo();
      this.resetTotal();
      this.firstSelect = "";
      this.secondSelect = "";
    },
    closeDialogAddgsVisible() {},
    add_firstSelectChange(active) {
      this.add_activeType = [];
      this.add_secondSelect = "";
      let foodtypes = this.$store.state.TabModule.foodtypes;
      for (let index = 0; index < foodtypes.length; index++) {
        if (foodtypes[index].fatype[0] == active) {
          this.add_activeType.splice(index, 0, foodtypes[index]);
        }
      }
    },
    firstSelectChange(active) {
      console.log(active);
      this.activeType = [];
      this.secondSelect = "";
      let foodtypes = this.$store.state.TabModule.foodtypes;
      for (let index = 0; index < foodtypes.length; index++) {
        if (foodtypes[index].fatype[0] == active) {
          this.activeType.splice(index, 0, foodtypes[index]);
        }
      }
      console.log(this.activeType);
    },

    async init() {
      await this.count("food");
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
                updatafood(
                  this.tableShowData[myindex]._id,
                  this.tableShowData[myindex].type
                )
              )
                .then((res) => {
                  if (res.data.errmsg == "ok" && res.data.resp_data == "null") {
                    this.$message.error("类型重复，请重试");
                    this.accomplish = "el-icon-edit";
                    row.state = 0;
                    this.tableShowData[myindex].type = this.copytypetableData[
                      myindex
                    ].type;
                  } else {
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
                  }
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
          } else {
            row.state = 0;
          }
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
      } else {
        this.loading = false;
        console.log("不空");
      }
    },
    count(foodtype) {
      this.encapsulation(count(foodtype)).then((res) => {
        this.total = res.data.count;
        this.initialization(50, 0);
        this.initialization(this.total, 0);
      });
    },
    initialization(limit, skip) {
      this.encapsulation(queryfoodtable(limit, skip))
        .then((res) => {
          if (res.data.resp_data.length > 50) {
            this.tableShowData = [];
          }
          let alldata = JSON.parse(res.data.resp_data).data.list;
          for (let i = 0; i < alldata.length; i++) {
            this.tableShowData.push("");
          }
          for (let item in alldata) {
            alldata[item].state = 0;
            this.tableShowData.splice(item, 1, alldata[item]);
          }
          console.log(this.tableShowData);
          this.loading = false;
          this.copytypetableData = JSON.parse(
            JSON.stringify(this.tableShowData)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    findtypes(limit, skip) {
      console.log(limit);
      this.encapsulation(querytypetable(limit, skip)).then((res) => {
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

    typecount(type) {
      this.encapsulation(count(type)).then((res) => {
        console.log(res);
        this.mytypecount = res.data.count;
        console.log(this.mytypecount);
      });
    },
    myindex(index) {
      return parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
    },
  },
  filters: {
    myid(id) {
      let myid = id + "";
      return myid.substring(myid.length - 5, myid.length);
    },
  },
};
</script>

<style  scoped>
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
.solo {
  float: left;
}
.myinput {
  width: 300px;
}
.searchselect {
  float: left;
  width: 160px;
  margin: 0px 10px;
}
</style>
