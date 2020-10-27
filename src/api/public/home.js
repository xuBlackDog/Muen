import { request } from "api/request.js";
export function count(table) {
  return {
    method: "post",
    url: "/api/tcb/databasecount?",
    data: {
      env: "zsh-9oual",
      query: "db.collection('" + table + "').count()",
    },
  };
}
export function add_swiper(url) {
  let env = "zsh-9oual";
  let name = "add_swiper";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      url: url,
    }),
  };
}
export function upload2(url, data) {
  return request({
    method: "post",
    url,
    data,
  });
}
export function upload(path) {
  return {
    method: "post",
    url: "/api/tcb/uploadfile?",
    data: {
      env: "zsh-9oual",
      path: path,
    },
  };
}
export function del_swiper(id, state) {
  let env = "zsh-9oual";
  let name = "del_swiper";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _id: id,
    }),
  };
}
export function upSwiper(id, state) {
  let env = "zsh-9oual";
  let name = "upSwiper";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _id: id,
      state,
    }),
  };
}

export function byId_getSwiper(id) {
  return {
    method: "post",
    url: "/api/tcb/databasequery?",
    data: {
      env: "zsh-9oual",
      query: "db.collection('swiper').where({_id: '" + id + "'}).get()",
    },
  };
}

export function getSwiper(limit, skip) {
  return {
    method: "post",
    url: "/api/tcb/databasequery?",
    data: {
      env: "zsh-9oual",
      query:
        "db.collection('swiper').limit(" + limit + ").skip(" + skip + ").get()",
    },
  };
}
