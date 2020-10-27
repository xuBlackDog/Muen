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

export function add_menu(menu) {
  let env = "zsh-9oual";
  let name = "add_menu";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      menu,
    }),
  };
}

export function getLabels(limit, skip) {
  return {
    method: "post",
    url: "/api/tcb/databasequery?",
    data: {
      env: "zsh-9oual",
      query:
        "db.collection('label').limit(" + limit + ").skip(" + skip + ").get()",
    },
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

export function up_menu_st(id, choiceness, recommend, state) {
  let env = "zsh-9oual";
  let name = "up_menu_st";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _id: id,
      choiceness,
      recommend,
      state,
    }),
  };
}
export function get_menus(limit, skip) {
  let from = "user";
  let localField = "uid";
  let foreignField = "_id";
  let as = "user";
  return {
    method: "post",
    url: "/api/tcb/databaseaggregate?",
    data: {
      env: "zsh-9oual",
      query:
        "db.collection('menu').aggregate().lookup({from:'" +
        from +
        "',localField:'" +
        localField +
        "', foreignField:'" +
        foreignField +
        "',as:'" +
        as +
        "'}).limit(" +
        limit +
        ").skip(" +
        skip +
        ").end()",
    },
  };
}
