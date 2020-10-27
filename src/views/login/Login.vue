<template>
  <div class="login-container">
    <div class="myfrom">
      <el-form
        class="from"
        :label-position="labelPosition"
        label-width="80px"
        :model="user"
      >
        <span class="login-title"></span>
        <h2>九号菜谱</h2>
        <br />
        <el-input
          class="myinput"
          placeholder="用户名"
          prefix-icon="el-icon-user-solid"
          v-model="user.userName"
        ></el-input>
        <el-input
          type="password"
          class="myinput"
          placeholder="密码"
          prefix-icon="el-icon-unlock"
          v-model="user.passWord"
          show-password
        ></el-input>
        <el-button class="mybutton" @click="mylogin" type="primary"
          >登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "api/login/login";

export default {
  data() {
    return {
      labelPosition: "right",
      user: {
        userName: "admin",
        passWord: "admin",
      },
    };
  },
  methods: {
    mylogin() {
      this.encapsulation(login("admin", "admin")).then((res) => {
        localStorage.setItem("user", res.data.data[0]);
        console.log(JSON.parse(localStorage.getItem("user")));
        this.$router.push("/index");
      });
    },
  },
};
</script>

<style scoped>
.el-input__inner {
  height: 50px;
  background-color: #283443;
  border: 0.6px solid #eee;
  outline: none;
  color: #eee;
}
.login-title {
  position: relative;
  display: block;
  color: #eee;
  font-size: 30px;
  text-align: center;
  bottom: 10px;
}
.myinput {
  text-align: center;
  width: 90%;
}
.from {
  text-align: center;
  position: relative;
  height: 60%;
  width: 90%;
  top: 40%;
}
.el-input {
  margin-bottom: 5%;
}
.mybutton {
  width: 90%;
}
.myfrom {
  width: 520px;
  height: 64vh;
  margin: 0 auto;
}
.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #fff7ff;
}
</style>
