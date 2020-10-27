<template>
  <div id="add_menu">
    <div class="content">
      <a name="top" />
      <div class="go_top">
        <a href="#top">
          <svg-icon class="icon" icon-class="go_top"></svg-icon>
        </a>
      </div>
      <el-form status-icon ref="form" :model="form" label-width="80px">
        <el-form-item label="菜名">
          <el-input
            placeholder="菜名"
            class="input_width"
            v-model="form.dname"
          ></el-input>
        </el-form-item>
        <el-form-item class="masterimg" label="主图">
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
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            class="textarea_input_width"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="请输入该菜谱的描述"
            v-model="form.describe"
          ></el-input>
        </el-form-item>
        <el-form-item required label="用料">
          <br />
          <span class="cainixuyao">猜你可能需要用到 :</span>
          <br />
          <div class="buts">
            <el-button
              v-for="item in buts"
              :key="item.name"
              @click="add_but_bom(item.name, item.hint)"
              type="success"
              size="mini"
              >{{ item.name }}</el-button
            >
          </div>
          <div>
            <div
              class="yongliao"
              v-for="(item, index) in form.bom"
              :key="index"
            >
              <el-form-item>
                <el-input
                  class="zsh-input"
                  v-model="item.name"
                  placeholder="食材:如鸡蛋"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  class="zsh-input"
                  v-model="item.quantity"
                  :placeholder="
                    item.quantity ? yongliang + item.quantity : '用量如一勺'
                  "
                ></el-input
                >&nbsp;
              </el-form-item>
              <el-button
                class="del_but"
                type="danger"
                @click="del_bom(index)"
                icon="el-icon-delete"
                circle
              ></el-button>
            </div>
          </div>
          <el-button @click="add_bom" type="primary" size="mini"
            >再增加一行</el-button
          >
        </el-form-item>

        <el-form-item label="做法">
          <div class="steps">
            <el-steps direction="vertical" :active="steps_active" space="255px">
              <el-step
                v-for="(item, index) in this.step"
                :key="index"
                :title="'步骤' + (index + 1)"
              ></el-step>
            </el-steps>
          </div>
          <br />
          <ul class="my_steps">
            <li class="step" v-for="(item, index) in this.step" :key="item.id">
              <div>
                <i
                  v-if="item.dialogImageUrl"
                  @click="del_uplaod_icon(index)"
                  class="el-icon-close del_icon"
                ></i>
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :http-request="http_request"
                  :on-change="handlePictureCardPreview"
                  @click.native="uploadclick(index)"
                  :limit="1"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-input
                  class="zsh-input inputwidth"
                  v-model="item.st"
                  placeholder="添加步骤说明"
                ></el-input>
              </div>
            </li>
            <el-button
              class="add_step"
              @click="add_step"
              type="primary"
              size="mini"
              >再增加一步</el-button
            >
          </ul>
        </el-form-item>
        <el-form-item label="小贴士">
          <br />
          <el-input
            class="tips_input_width"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 7 }"
            placeholder="这道菜还有哪些注意的细节和小技巧呢?"
            v-model="tips"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类标签">
          <el-select
            :multiple-limit="3"
            v-model="form.labels"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-radio v-model="form.recommend" label="0">是</el-radio>
          <el-radio v-model="form.recommend" label="1">否</el-radio>
        </el-form-item>
        <el-form-item label="是否精选">
          <el-radio v-model="form.choiceness" label="0">是</el-radio>
          <el-radio v-model="form.choiceness" label="1">否</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
import { upload, upload2, add_menu, getLabels, count } from "api/menu/menu.js";
import { get_date } from "utils/global";
import LoginVue from "../../login/Login.vue";
export default {
  name: "add_menu",
  data() {
    return {
      steps_active: 1,
      myupload: "upload",
      yongliang: "用量",
      admin_info: {},
      options: [
        {
          value: "湘菜",
        },
        {
          value: "下饭菜",
        },
        {
          value: "粤菜",
        },
        {
          value: "鲁菜",
        },
        {
          value: "懒人必备",
        },
        {
          value: "早餐",
        },
        {
          value: "中餐",
        },
        {
          value: "晚餐",
        },
        {
          value: "汤类",
        },
        {
          value: "小吃",
        },
      ],
      buts: [
        { name: "食盐", hint: "1克" },
        { name: "白糖", hint: "1勺" },
        { name: "味精", hint: "1克" },
        { name: "醋", hint: "1勺" },
        { name: "辣椒", hint: "1个" },
        { name: "大蒜", hint: "1瓣" },
        { name: "生抽", hint: "1勺" },
      ],
      upload_index: 0,
      step: [
        {
          imgname: "",
          dialogImageUrl: "",
          st: "",
          dialogVisible: true,
          id: 0,
        },
      ],
      tips: "",
      form: {
        bom: [{ name: "", quantity: "" }], // 步骤
        browse: "0", //浏览量
        choiceness: "0", //精选
        collect: "0", //收藏
        createdate: "", //创建时间
        describe: "", //描述
        dname: "", //菜名
        labels: [], //标签
        masterimgurl: "", //主图
        recommend: "0", //推荐
        state: "0", //状态
        step: [{ img: "", st: "" }], //步骤
        tips: [], //小贴士
        uid: "", // userID
      },
      key_number: 2,
    };
  },
  created() {
    this.admin_info = JSON.parse(localStorage.getItem("user"));
    this.form.uid = this.admin_info.uid;
    this.getLables();
  },
  methods: {
    getLables() {
      this.encapsulation(count("label")).then((res) => {
        console.log(res);
        this.encapsulation(getLabels(res.data.count, 0)).then((res) => {
          console.log(res);
          this.options = [];
          for (let index = 0; index < res.data.data.length; index++) {
            console.log();
            this.options.push({
              value: JSON.parse(res.data.data[index]).labelName,
            });
          }
          console.log(this.options);
        });
      });
    },
    onSubmit() {
      if (this.form.dname == "" || this.form.describe == undefined) {
        this.$message({
          message: "菜名不能为空",
          type: "warning",
        });
      } else {
        if (this.form.masterimgurl == "") {
          this.$message({
            message: "请上传主图",
            type: "warning",
          });
        } else {
          if (this.form.describe == "" || this.form.describe == undefined) {
            this.$message({
              message: "请输入正确的描述",
              type: "warning",
            });
          } else {
            let st = 0;

            for (let item in this.form.bom) {
              if (
                this.form.bom[item].name == "" ||
                this.form.bom[item].quantity == ""
              ) {
                this.$message({
                  message: "请输入正确的食材",
                  type: "warning",
                });
                st = 1;
                break;
              }
            }
            if (st == 0) {
              for (let item in this.step) {
                let item_step = {
                  img: this.form.step[item].img,
                  st: this.step[item].st,
                };
                this.form.step.splice(item, 1, item_step);
              }
              let st2 = 0;
              for (let item in this.form.step) {
                if (
                  this.form.step[item].st == "" ||
                  this.form.step[item].st == undefined
                ) {
                  this.$message({
                    message: "请输入步骤说明",
                    type: "warning",
                  });
                  st2 = 1;
                  break;
                }
              }
              if (st2 == 0) {
                console.log("成功");
                console.log(this.form.step);
                this.form.tips = [];
                this.form.tips.push(this.tips);
                if (this.form.tips[0] == "" || this.form.tips[0] == undefined) {
                  this.$message({
                    message: "请输入小贴士",
                    type: "warning",
                  });
                  console.log(this.form.tips);
                } else {
                  console.log("成功");
                  if (this.form.labels.length < 1) {
                    this.$message({
                      message: "请输入至少选择一个标签分类",
                      type: "warning",
                    });
                  } else {
                    console.log("发送请求");
                    let item = get_date();
                    let tyd = item.split("-");
                    this.form.createdate = tyd[0] + "-" + tyd[1] + "-" + tyd[2];
                    this.encapsulation(add_menu(this.form))
                      .then((res) => {
                        if (res.data.errmsg != "ok") {
                          this.$message.error("网络缓慢,请重试");
                        } else {
                          this.$message({
                            message: "添加成功",
                            type: "success",
                          });

                          this.step = [{}];
                          console.log(this.step);
                          this.form = {
                            bom: [{ name: "", quantity: "" }], // 步骤
                            browse: "0", //浏览量
                            choiceness: "0", //精选
                            collect: "0", //收藏
                            createdate: "", //创建时间
                            describe: "", //描述
                            dname: "", //菜名
                            labels: [], //标签
                            masterimgurl: "", //主图
                            recommend: "0", //推荐
                            state: "0", //状态
                            step: [{ img: "", st: "" }], //步骤
                            tips: [], //小贴士
                            uid: "", // userID
                          };
                          this.form.masterimgurl = "";
                          this.$refs.upload.clearFiles();
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    console.log(this.form);
                  }
                }
              }
            }
          }
        }
      }
    },

    async http_request1(file) {
      console.log(file);
      let tiem = new Date().getTime();
      let fileName = tiem + file.file.type.replace("image/", ".");
      let date = get_date();
      fileName = date + "_" + fileName;
      let path = "menu/" + fileName;
      this.encapsulation(upload(path)).then((res) => {
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
            this.form.masterimgurl = fileName;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("上传失败，请重试");
          });
      });
    },
    async http_request(file) {
      let tiem = new Date().getTime();
      let fileName = tiem + file.file.type.replace("image/", ".");
      let date = get_date();
      fileName = date + "_" + fileName;
      let path = "menu/" + fileName;
      this.encapsulation(upload(path)).then((res) => {
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
            let step_item = {
              img: fileName,
            };
            this.form.step.splice(this.upload_index, 1, step_item);
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("上传失败，请重试");
          });
      });
    },

    del_uplaod_icon(index) {
      if (this.step.length > 1) {
        this.step.splice(index, 1);
        this.steps_active -= 1;
      } else {
        this.$message({
          message: "最少存在一个步骤",
          type: "warning",
        });
      }
    },
    add_step() {
      this.key_number += 10;
      this.step.push({
        dialogImageUrl: "",
        dialogVisible: false,
        st: "",
        imgname: "",
        id: this.key_number,
      });
      this.steps_active += 1;
    },
    uploadclick(index) {
      this.upload_index = index;
    },
    handlePictureCardPreview(file) {
      let fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        let bom_item = {
          imgname: fileName,
          dialogImageUrl: URL.createObjectURL(file.raw),
          st: this.step[this.upload_index].st,
          dialogVisible: true,
          fileurl: file.url,
          id: this.step[this.upload_index].id,
        };
        if (this.step.length == 1) {
          this.step.length = 0;
        }
        this.step.splice(this.upload_index, 1, bom_item);
      } else {
        this.$message.error("请选择图片文件");
      }
    },
    add_but_bom(name, hint) {
      if (
        this.form.bom.length == 1 &&
        this.form.bom[0].name == "" &&
        this.form.bom[0].quantity == ""
      ) {
        this.form.bom.splice(0, 1, { name, quantity: hint });
      } else {
        let st = 0;
        for (let item in this.form.bom) {
          if (this.form.bom[item].name == name) {
            st = 1;
          }
        }
        if (st == 0) {
          this.form.bom.push({ name, quantity: hint });
        }
      }
    },

    add_bom() {
      this.form.bom.push({});
    },

    del_bom(index) {
      if (this.form.bom.length > 1) {
        this.form.bom.splice(index, 1);
      } else {
        this.$message({
          message: "最少使用一种材料",
          type: "warning",
        });
      }
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
  },
  components: {},
};
</script>

<style scoped>
.icon {
  position: fixed;
  right: 5%;
  bottom: 5%;
  color: white;
  background-color: #00fa9a;
  font-size: 30px;
}
.my_steps {
  margin-left: 80px;
  margin-top: 2px;
}
.steps {
  position: absolute;
  top: 10px;
}
.del_but {
  margin-left: 20px;
  width: 33px;
  height: 33px;
  font-size: 6px;
}
.avatar {
  position: absolute;
  top: 1px;
  left: 1px;
}
.add_step {
  bottom: 110px;
}

.del_icon {
  position: absolute;
  font-size: 20px;
  right: 0px;
  top: 10;
  opacity: 0.8;
}
.inputwidth {
  width: 330px;
  margin-top: 10px;
}
.tips_input_width {
  width: 430px;
  margin-top: -44px;
}
.item_img {
  height: 240px;
  width: 300px;
  background-color: gainsboro;
}
.step {
  position: relative;
  height: 250px;
  width: 350px;
  margin-bottom: 5px;
}
.del_bom {
  margin: 5px 0px 0px 30px;
  font-size: 4px;
  width: 60px;
  height: 20;
}
.yongliao {
  margin-bottom: 20px;
}
.buts {
  margin-top: -35px;
}
.buts button {
  font-size: 2px;
}
.yongliao {
  width: 60%;
  display: flex;
}

.cainixuyao {
  display: block;
  margin-top: -5px;
  line-height: 10px;
  font-size: 12px;
}
.my_textarea {
  resize: none;
}
.el-upload-list {
  position: absolute;
  margin-top: -100px;
  font-size: 100px;
}
.upload_width {
  width: 39%;
  float: left;
}
.input_width {
  width: 45%;
  float: left;
}
.textarea_input_width {
  width: 70%;
  float: left;
}
.content label {
  font-size: 35px !important;
}
.el-form-item__label {
  font-size: 35px !important;
}
.content {
  margin: 0px;
  padding: 0px;
  width: 70%;
  text-align: left;
  /* background-color: #fff7ff; */
  float: left;
}
</style>
<style>
/* 修改input的样式，为了不覆盖本组件其他处的样式，需要自定义一个类名 */
.zsh-input input.el-input__inner {
  border: 1px solid #f0f0f0 !important;
  background-color: white;
}
</style>
