<template>
  <div id="typetable">
    <div class="statusbar">
      <el-button
        class="addtype"
        @click="addgsForm"
        :visible.sync="dialogAddgsVisible"
        type="success"
        icon="el-icon-plus"
        >新增</el-button
      >
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogAddgsVisible"
      @close="closeDialogAddgsVisible"
    >
      <el-form class="myform" :model="addForm" ref="addForm">
        <el-form-item label="类型">
          <el-input class="myinput" v-model="addForm.type"></el-input>
        </el-form-item>
      </el-form>

      <div>
        <el-button @click="dialogAddgsVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddForm('addForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-table
      v-loading="loading"
      class="typetable"
      height="500"
      :data="
        tableShowData.slice((currpage - 1) * pagesize, currpage * pagesize)
      "
      border
      style="width: 100%"
    >
      <el-table-column label="序号" width="180" align="center">
        <template scope="scope">{{ serial(scope.$index) }}</template>
      </el-table-column>
      <el-table-column label="分类名称" width="220" align="center">
        <template scope="scope">
          <el-input
            v-show="scope.row.state == 1"
            class="typetableinput"
            size="small"
            v-model="scope.row.type"
            placeholder="请输入内容"
          ></el-input>
          <span
            class="tablespan"
            v-show="tableShowData[myindex(scope.$index)].state == 0"
            >{{ scope.row.type }}</span
          >

          <el-button
            v-show="tableShowData[myindex(scope.$index)].state == 1"
            style="float:right"
            icon="el-icon-refresh"
            type="warning"
            size="mini"
            @click="handlebutton(scope.$index, scope.row, 1)"
            >取消</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.state == 0"
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="handlebutton(scope.$index, scope.row, 0)"
            >编辑</el-button
          >
          <el-button
            v-show="scope.row.state == 1"
            :icon="accomplish"
            type="success"
            size="mini"
            @click="handlebutton(scope.$index, scope.row, 2)"
            >完成</el-button
          >
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
import Pagination from "components/Pagination/Pagination";
import { isType } from "utils/validate.js";
import { updatatype, addtype, querytable } from "api/public/type.js";
import { isObjectValueEqual, serial } from "utils/global.js";

export default {
  name: "typetable",
  components: {
    Pagination,
  },
  data() {
    return {
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
      accomplish: "el-icon-edit",
    };
  },
  filters: {
    myid(id) {
      let myid = id + "";
      return myid.substring(myid.length - 5, myid.length);
    },
  },

  created() {},
  methods: {
    serial(idnex) {
      return serial(this.currpage, this.pagesize, idnex);
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    myindex(index) {
      return parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
    },
    init() {
      let types = this.$store.state.TabModule.types;
      if (types.length > 0) {
        console.log(types);
        this.total = types.length;
        for (let i = 0; i < this.total; i++) {
          this.tableShowData.push("");
        }
        for (let item in types) {
          types[item].state = 0;
          this.tableShowData.splice(item, 1, types[item]);
        }
        this.loading = false;
        this.copytypetableData = JSON.parse(JSON.stringify(this.tableShowData));

        console.log(this.tableShowData);
      } else {
        this.encapsulation(querytable("type", this.pagesize, 0))
          .then((res) => {
            this.total = res.data.pager.Total;
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
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.currpage = val;
      console.log(this.tableShowData[(this.currpage - 1) * this.pagesize]);
      if (
        this.tableShowData[(this.currpage - 1) * this.pagesize] == "" ||
        this.tableShowData[(this.currpage - 1) * this.pagesize] == null
      ) {
        this.encapsulation(
          querytable("type", this.pagesize, (this.currpage - 1) * this.pagesize)
        )
          .then((res) => {
            this.total = res.data.pager.Total;
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
    //  *点击新增按钮，弹出新增模态框
    //    * @param
    //    */
    addgsForm() {
      this.dialogAddgsVisible = true;
      this.title = "新增分类";
    },
    /**
     *关闭或取消模态框，清空值
     * @param
     */

    closeDialogAddgsVisible() {
      this.$refs.addForm.resetFields(); //element封装的方法,清空模态框的值
      this.title = ""; //初始化title的值
      this.addForm = {
        //初始化addForm中的值
        type: "",
      };
    },

    /**
     *确定新增数据
     * @param
     */
    saveAddForm(aaa) {
      this.$refs[aaa].validate((valid) => {
        let type = this.$refs[aaa].model.type;
        if (isType(type)) {
          this.encapsulation(addtype(type))
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
                };
                this.tableShowData.push(newdata);
                this.$store.commit("PUSH_TYPES", newdata);
                let newdata2 = JSON.parse(JSON.stringify(newdata));
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
    handlebutton(index, row, type) {
      let myindex =
        parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
      console.log(myindex);
      switch (type) {
        case 0:
          row.state = 1;
          console.log("编辑");
          console.log(myindex);
          this.tableShowData.splice(myindex, 1, row);
          // this.tableShowData[index].state = 1;
          break;
        case 1:
          row.state = 0;
          console.log("取消");
          this.tableShowData.splice(myindex, 1, row);
          this.tableShowData[myindex].type = this.copytypetableData[
            myindex
          ].type;
          this.$message({
            message: "类型已恢复为原始值",
            type: "warning",
          });
          break;
        case 2:
          console.log("完成");
          // row.state = 0;
          // this.tableShowData.splice(myindex, 1, row);

          if (
            this.tableShowData[myindex].type !=
            this.copytypetableData[myindex].type
          ) {
            if (isType(this.tableShowData[myindex].type)) {
              this.accomplish = "el-icon-loading";
              this.encapsulation(
                updatatype(
                  this.tableShowData[myindex]._id,
                  this.tableShowData[myindex].type
                )
              )
                .then((res) => {
                  this.accomplish = "el-icon-edit";
                  row.state = 0;
                  this.$message({
                    message: "类型修改成功",
                    type: "success",
                  });
                  this.copytypetableData[myindex].type = this.tableShowData[
                    myindex
                  ].type;
                  console.log(res);
                })
                .catch((err) => {
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
            }
          }
          break;
      }
    },
  },
};
</script>

<style scoped>
.myform {
  width: 50%;
  margin: 0 auto;
}
.myinput {
  float: left;
  width: 300px;
}
.statusbar {
  width: 40%;
  background-color: red;
}
.addtype {
  float: left;
}
.tablespan {
  height: 32px;
  display: inline-block;
}
.typetableinput {
  width: 100px;
}
</style>
