import axios from "axios";
export function request(option) {
  const myaxios = axios.create({});
  // // HTTPrequest请求拦截
  // myaxios.interceptors.request.use(
  //   (config) => {
  //     return config;
  //   },
  //   (err) => {
  //     console.log("请求失败");
  //   }
  // );
  // // HTTPrespone响应拦截
  // myaxios.interceptors.response.use(
  //   (data) => {
  //     console.log("响应成功");
  //     return data;
  //   },
  //   (err) => {
  //     console.log("响应失败");
  //   }
  // );
  return myaxios(option);
}
// 封装先获取token  再发送请求
export async function encapsulation(option) {
  // 先获取tooken
  let tooken = await request({
    url: `/api/cgi-bin/token?grant_type=client_credential&appid=wxbbc27bb260f1eef4&secret=4cf9cc3fea50193b52a5bfae4cdd071c`,
    method: "get",
  });

  option.url = option.url + `&access_token=${tooken.data.access_token}`;
  return await request(option);
}
