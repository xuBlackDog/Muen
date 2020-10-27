<template>
  <div id="z_dialog">
    <el-dialog
      width="600px"
      :title="tem_title"
      :visible.sync="dialogVisible"
      @close="closeDialogAddgsVisible"
    >
      <div class="content">
        <!-- <a name="top" />
        <div class="go_top">
          <a href="#top">
            <svg-icon @click="go_top" class="icon" icon-class="go_top"></svg-icon>
          </a>
        </div>-->

        <h2>菜名:{{ row.dname }}</h2>
        <div class="maste_img">
          <el-image
            style="height: 250px"
            lazy
            :src="wx_url + row.masterimgurl"
            fit
          ></el-image>
        </div>
        <div class="info center">
          <span>{{ row.user[0].nickname }}&nbsp;&nbsp;</span>
          <span>&nbsp;&nbsp;浏览量 {{ row.browse }}&nbsp;&nbsp;</span>
          <span>&nbsp;&nbsp;收藏 {{ row.collect }}</span>
        </div>
        <h6 class="describe center">{{ row.describe }}</h6>
        <ul class="bom">
          <li>
            <h3 class="bom_left">用料</h3>
          </li>
          <li v-for="item in row.bom" :key="item.name">
            <span class="bom_left">{{ item.name }}</span>
            <div class="fa">
              <span class="bom_right">{{ item.quantity }}</span>
            </div>
          </li>
        </ul>
        <ul class="step center">
          <li class="zuofa">
            <h3 class="bom_left">做法</h3>
          </li>
          <li v-for="(item, index) in row.step" :key="index" class="img_li">
            <div class="img_fa">
              <el-image :src="wx_url + item.img" fit></el-image>
            </div>
            <span class="step_item">{{ index + 1 }}:{{ item.st }}</span>
          </li>
        </ul>
        <br />
        <h4 class="xiaotieshi">小贴士</h4>
        <ul class="tips">
          <br />
          <li v-for="item in row.tips" :key="item">
            <span class="tips_left">{{ item }}</span>
          </li>
        </ul>
        <br />
        <hr style="width: 100px" />
        <div class="bottom">
          <span style="font-family: arial" class="style4">&copy;香哈菜谱</span>
          <br />
          <span class="style4">解释权归香哈菜谱所有 电话：14381438</span>
        </div>
      </div>
      <slot name="buts" class="buts">
        <div class="buts">
          <el-button type="info" @click="dialogVisible = false"
            >关 闭</el-button
          >
        </div>
      </slot>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "z_dialog",
  props: {
    title: {
      type: String,
      default: "详情",
    },
  },
  data() {
    return {
      row: {
        dname: "西红柿炒蛋",
        masterimgurl: "231",
        user: [{ nickname: "旭老狗" }],
        browse: 123,
        collect: 343,
        describe: "",
      },
      dialogVisible: false,
      tem_title: this.title,
      wx_url: "",
    };
  },
  created() {
    this.wx_url = this.$store.state.wx_url;
  },
  methods: {
    open_dialog(row) {
      this.dialogVisible = true;
      this.row = row;
      console.log(this.row);
    },
    closeDialogAddgsVisible() {
      this.dialogVisible = false;
    },
  },
  components: {},
};
</script>

<style scoped>
.icon {
  position: fixed;
  right: 32%;
  bottom: 5%;
  color: white;
  background-color: #00fa9a;
  font-size: 30px;
}
.bottom {
  color: black;
  display: block;
  width: 100%;
  text-align: right;
  z-index: 10;
}

.xiaotieshi {
  display: block;
  text-align: left;
  font-size: 18px;
  height: 40px;
}
.buts {
  height: 100px;
  margin: 0 auto;
}
.buts button {
  margin-right: 5%;
  margin-top: 60px;
}

.step li {
  margin-top: 30px;
}

.zuofa {
  height: 40px;
}
.step_item {
  float: left;
}
.fa {
  float: right;
  width: 40%;
  height: 100%;
}
.bom_right {
  float: left;
}
.bom_left {
  float: left;
}
.bom {
  margin-top: 20px;
}
.bom li {
  margin: 0 auto;
  width: 90%;
  height: 40px;
  border-bottom: 1px solid WhiteSmoke;
}
.tips_left {
  margin-left: 10px;
}
.tips {
  margin-top: -40px;
  text-align: left;
}
.tips li {
  list-style: disc;
  margin: 0 auto;
  width: 90%;
}
.describe {
  text-align: left;
  line-height: 20px;
  font-size: 14px;
  color: #333;
  font-weight: normal;
}
.info {
  height: 50px;
}
.center {
  margin: 0px 5px 0px 20px;
}
.info span {
  float: left;

  opacity: 0.9;
}
.maste_img {
  margin: 0 auto;
  width: 400px;
  height: 250px;
}
.content {
  margin: -40px 10%;
  width: 78%;
}
</style>
