<template>
  <div id="user">
    <el-table
      :data="list.slice((currpage - 1) * pagesize, currpage * pagesize)"
      style="width: 100%"
    >
      <el-table-column prop="_openid" label="openid" sortable width="300"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img
            :src="url+scope.row.headimg"
            :id="errimg+scope.$index"
            alt
            style="width: 40px;height: 40px;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="姓名" width="200"></el-table-column>
      <el-table-column prop="activenumber" label="登陆次数" sortable width="180"></el-table-column>

      <el-table-column prop="activetiem" sortable label="登陆时间"></el-table-column>
      <el-table-column prop="activetiem" sortable label="注册时间"></el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="coun"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper"
      :total="UserListCount"
    ></el-pagination>-->
  </div>
</template>

 <script>
import { selectUserList, selectUserCount } from "api/user/user";

export default {
  data() {
    return {
      userList: [], //存放用户的数组
      list: [],
      url: "https://7a73-zsh-9oual-1302800863.tcb.qcloud.la/tmp/", //图片的前缀
      errimg: "touxian", //图片id的前缀
      UserListCount: 0, //用于存放总条数
      pagesize: 10, //每页显示的数据条数，用于数组的筛选
      currpage: 1, //默认是从第一页开始，用于上面数组的筛选
      coun: 1,
      //默认第一页查询的参数(limit为9，从0开始)
      limit: 9,
      skip: 0,
    };
  },
  created() {
    this.findAlluser(10, 0);
  },
  methods: {
    //监听图片加载失败的方法
    imgLoadError: function (i, row) {
      this.userList[i].headimg =
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597585160046&di=8f57aab70e106d8035608139c435495c&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201805%2F30%2F20180530083702_HyrTS.thumb.700_0.jpeg";
      document.getElementById("touxian" + i).style.src = this.userList[
        i
      ].headimg;
    },
    //封装起来的查询方法
    findAlluser(limit, skip) {
      this.encapsulation(selectUserList(limit, skip))
        .then((res) => {
          for (let item in res.data.data) {
            this.userList.push(JSON.parse(res.data.data[item]));
            this.userList[item].headimg = "1.png";
          }
          console.log(res);
          console.log(this.userList.length);
          this.UserListCount = res.data.pager.Total; //拿到后台查询到的数据的总条数
          this.userList.length = this.UserListCount; //将数组的长度定义为总条数的
          console.log(this.userList);
          for (let i = 0; i < this.UserListCount; i++) {
            this.list.push("");
          }
          for (let item in this.userList) {
            this.list.splice(item, 1, this.userList[item]);
          }
        })
        .catch((err) => {
          console.log("第二次错误" + err);
        });
    },

    // 改变页数，查询当前页的数据
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currpage = val; //获取当前页
      console.log((this.currpage - 1) * this.pagesize);
      let state = this.list[(this.currpage - 1) * this.pagesize];
      console.log(state);
      console.log(typeof state);
      if (state == "") {
        this.encapsulation(
          selectUserList(10, (this.currpage - 1) * this.pagesize)
        )
          .then((res) => {
            console.log((this.currpage - 1) * this.pagesize);
            console.log(res.data.data);
            for (let item in res.data.data) {
              let myitem = JSON.parse(res.data.data[item]);
              let mycurrpage = (this.currpage - 1) * this.pagesize;

              console.log(parseInt(mycurrpage) + parseInt(item));
              this.list.splice(
                parseInt(mycurrpage) + parseInt(item),
                1, //这里的1代表每增加一个数据就删除一个空对象
                myitem
              );

              this.userList.splice(
                (this.currpage - 1) * this.pagesize,
                0,
                JSON.parse(res.data.data[item])
              );
              this.userList[item].headimg = "1.png";
            }
            console.log(this.list);
          })
          .catch((err) => {
            console.log("第二次错误" + err);
          });
      } else {
        console.log(2);
      }
    },
  },
};
</script>

<style scoped>
.el-table {
  line-height: 0px !important;
  text-align: center !important;
}
img {
  border-radius: 50%;
}
</style>




