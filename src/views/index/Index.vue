<template>
  <div id="index">
    <div class="cards">
      <ul class="cards-ul">
        <li>
          <div class="left">
            <svg-icon class="icon" icon-class="yonghu"></svg-icon>
          </div>
          <div class="right">
            <span class="span1">今日新增用户</span>
            <br />
            <span class="span2">{{ todayUser }}</span>
          </div>
        </li>
        <li>
          <div class="left">
            <svg-icon class="icon" icon-class="yonghu_1"></svg-icon>
          </div>
          <div class="right">
            <span class="span1">总用户</span>
            <br />
            <span class="span2">{{ userCount }}</span>
          </div>
        </li>
        <li>
          <div class="left">
            <svg-icon class="icon2" icon-class="liebiao_1"></svg-icon>
          </div>
          <div class="right">
            <span class="span1">今日新增菜谱</span>
            <br />
            <span class="span2">{{ todayMeny }}</span>
          </div>
        </li>
        <li>
          <div class="left">
            <svg-icon class="icon2" icon-class="liebiao"></svg-icon>
          </div>
          <div class="right">
            <span class="span1">总菜谱</span>
            <br />
            <span class="span2">{{ mentCount }}</span>
          </div>
        </li>
      </ul>
      <div id="myChart" style="width：100px;height:450px;margin-top:70px"></div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { get_todayUser, count, get_todayMeny } from "api/index/index";
import { get_tiem, get_tiem2 } from "utils/global";
import echarts from "echarts";
export default {
  name: "index",
  data() {
    return {
      userCount: "",
      todayUser: "",
      mentCount: "",
      todayMeny: "",
      msg: "Welcome to Your Vue.js App",
      option: {
        title: {
          text: "九号菜谱数据统计",
        },
        tooltip: {},
        textStyle: {
          color: "#842B00", //这里是改变字体颜色
          fontSize: 18, //字体大小
        },
        xAxis: {
          data: ["今日新增用户", "总用户数", "今日新增菜谱", "总菜谱数"],
        },
        yAxis: {},
        series: [
          {
            name: "数量",
            type: "bar",
            data: [2, 7, 36, 10],
            barWidth: 100,
            itemStyle: {
              color: function(params) {
                //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                var colorList = [
                  "red",
                  "pink",
                  "#61a0a8",
                  "#d48265",
                  "#91c7ae",
                  "#749f83",
                  "#ca8622",
                ];
                return colorList[params.dataIndex];
              },
            },
          },
        ],
      },
    };
  },
  components: {},
  created() {
    this.init();
  },
  mounted() {
    this.drawLine();
    this.option.xAxis.data.push(this.userCount);
    this.option.xAxis.data.push(this.todayUser);
    this.option.xAxis.data.push(this.mentCount);
    this.option.xAxis.data.push(this.todayMeny);
  },
  methods: {
    drawLine() {
      let that = this;
      var echarts = require("echarts");
      var myChart = echarts.init(document.getElementById("myChart"));
      let options = myChart.setOption(that.option);
    },

    init() {
      this.get_userCount();
      this.get_todayUser();
      this.get_mentCount();
      this.get_todayMeny();
    },
    get_userCount() {
      this.encapsulation(count("user"))
        .then((result) => {
          console.log(result.data.count);
          this.userCount = result.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    get_todayUser() {
      console.log(get_tiem());
      this.encapsulation(get_todayUser(get_tiem()))
        .then((result) => {
          console.log(result.data.count);
          this.todayUser = result.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    get_mentCount() {
      this.encapsulation(count("menu"))
        .then((result) => {
          console.log(result.data.count);
          this.mentCount = result.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    get_todayMeny() {
      console.log(get_tiem2());
      this.encapsulation(get_todayMeny(get_tiem2()))
        .then((result) => {
          console.log(result.data.count);
          this.todayMeny = result.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.span1 {
  opacity: 0.9;
  color: rgba(0, 0, 0, 0.45);
  font-size: 18px;
}
.span2 {
  font-weight: 600;
  color: #666;
}
.left {
  float: left;
  height: 110px;
  width: 50%;
  margin-top: 8%;
}

.right {
  float: right;
  margin-top: 10px;
  line-height: 42px;
  font-size: 21px;
  height: 110px;
  width: 50%;
}
.cards-ul li {
  background-color: #f0f2f5;
  height: 100%;
}
.icon {
  width: 50px;
  height: 50px;
  color: #40c9c6;
}
.icon2 {
  width: 50px;
  height: 50px;
  color: #36a3f7;
}

.cards-ul {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}
.cards-ul li {
  height: 110px;
  width: 22%;
}
.cards {
  width: 100%;
}
</style>
