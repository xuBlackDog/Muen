<template>
  <div id="swiper">
    <el-dialog title="新增轮播图" :visible.sync="dialogVisible" width="50%">
      <div class="upload_width">
        <el-upload
          action="#"
          ref="upload"
          :on-change="handlePictureCardPreview1"
          :http-request="http_request1"
          list-type="picture-card"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="(dialogVisible = false), send()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-button class="add" type="warning" @click="dialogVisible = true"
      >新增</el-button
    >
    <el-table v-loading="loading" border :data="tableData" style="width: 100%">
      <el-table-column label="序号" width="100" align="center">
        <template scope="scope"> {{ serial(scope.$index) }}</template>
      </el-table-column>
      <el-table-column prop="date" align="center" label="url" width="220">
        <template scope="scope"
          ><span class="url_text">{{ url + scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="226" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag
              disable-transitions
              :type="scope.row.state == 0 ? 'success' : 'info'"
              >{{ scope.row.state == 0 ? "已上架" : "未上架" }}</el-tag
            >&nbsp;
          </div>
        </template>
      </el-table-column>
      <el-table-column width="256" prop="address" align="center" label="图片">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="url + scope.row.url"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <div class="edits">
            <el-button
              @click="del_swiper(scope.$index, scope.row)"
              size="mini"
              type="danger"
              >删除</el-button
            >
            <el-button
              @click="set_state(scope.$index, scope.row)"
              size="mini"
              :type="scope.row.state == 1 ? 'warning' : 'danger'"
              >{{ scope.row.state == 1 ? "上架" : "下架" }}</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script type="text/javascript">
import { serial } from "utils/global.js";
import {
  count,
  getSwiper,
  upSwiper,
  upload,
  upload2,
  add_swiper,
  byId_getSwiper,
  del_swiper,
} from "api/public/home";
import { get_date } from "utils/global";
export default {
  name: "swiper",
  data() {
    return {
      dialogVisible: false,
      loading: true,
      currpage: 1,
      pagesize: 10,
      url: "",
      tableData: [],
      uploadSuccessImg: "",
      file: {},
    };
  },
  components: {},
  created() {
    this.url = this.$store.state.wx_url;
    this.init();
  },
  methods: {
    http_request1(file) {
      this.file = file;
    },
    send() {
      if (JSON.stringify(this.file) != "{}") {
        this.http_request2(this.file);
      }
    },
    async http_request2(file) {
      let tiem = new Date().getTime();
      let fileName = tiem + file.file.type.replace("image/", ".");
      let date = get_date();
      fileName = date + "_" + fileName;
      let path = "menu/" + fileName;
      this.encapsulation(upload(path))
        .then((res) => {
          console.log(res);
          let formData = new FormData();
          formData.append("key", path);
          formData.append("Signature", res.data.authorization);
          formData.append("x-cos-security-token", res.data.token);
          formData.append("x-cos-meta-fileid", res.data.cos_file_id);
          formData.append("file", file.file);
          let url = res.data.url;
          url = url.replace("https://cos.ap-shanghai.myqcloud.com", "/upload");
          upload2(url, formData)
            .then((res) => {
              console.log(res);
              this.uploadSuccessImg = fileName;
              console.log(this.uploadSuccessImg);
              this.encapsulation(add_swiper(this.uploadSuccessImg))
                .then((res) => {
                  console.log(JSON.parse(res.data.resp_data)._id);
                  this.encapsulation(
                    byId_getSwiper(JSON.parse(res.data.resp_data)._id)
                  )
                    .then((res) => {
                      console.log(res);
                      let push = JSON.parse(res.data.data[0]);
                      this.tableData.push(push);
                      let sort = this.tableData.sort(this.compare("state"));
                      this.tableData = [];
                      this.tableData.push(...sort);
                      this.$refs.upload.clearFiles();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("上传失败，请重试");
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    handlePictureCardPreview1(file) {
      let fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        let masterimg = {
          url: URL.createObjectURL(file.raw),
          name: fileName,
        };
        console.log(masterimg);
      } else {
        this.$message.error("请选择图片文件");
      }
    },
    del_swiper(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let myindex =
            parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
          this.encapsulation(del_swiper(row._id))
            .then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.tableData.splice(myindex, 1);
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("错了哦，网络不好请重试");
              console.log(myindex);
              console.log(this.tableData);

              console.log(this.tableData);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    set_state(index, row) {
      let myindex =
        parseInt((this.currpage - 1) * this.pagesize) + parseInt(index);
      let i = 0;

      console.log(i);
      console.log(row, index);
      let state = row.state;
      if (state == 1) {
        state = 0;
      } else {
        state = 1;
      }
      console.log(state);
      this.encapsulation(upSwiper(row._id, state))
        .then((res) => {
          console.log(res);
          row.state = state;
          this.tableData.splice(myindex, 1, row);
          let sort = this.tableData.sort(this.compare("state"));
          this.tableData = [];
          this.tableData.push(...sort);
          if (row.state == 0) {
            this.$message({
              message: "上架成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "下架成功",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    init() {
      this.loading = true;
      this.encapsulation(count("swiper"))
        .then((res) => {
          console.log(res);
          this.encapsulation(getSwiper(res.data.count, 0))
            .then((res) => {
              console.log(res);
              this.loading = false;
              this.tableData = [];
              for (let index = 0; index < res.data.data.length; index++) {
                console.log(1);
                this.tableData.push(JSON.parse(res.data.data[index]));
              }
              let sort = this.tableData.sort(this.compare("state"));
              this.tableData = [];
              this.tableData.push(...sort);
              console.log(this.tableData);
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    serial(idnex) {
      return serial(this.currpage, this.pagesize, idnex);
    },
  },
};
</script>

<style scoped>
.url_text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.add {
  float: right;
  margin-right: 217px;
}
</style>
