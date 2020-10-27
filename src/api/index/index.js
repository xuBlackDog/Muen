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
export function get_todayUser(tiem) {
  return {
    method: "post",
    url: "/api/tcb/databasecount?",
    data: {
      env: "zsh-9oual",
      query: "db.collection('user').where({regtiem:'" + tiem + "'}).count()",
    },
  };
}

export function get_todayMeny(tiem) {
  return {
    method: "post",
    url: "/api/tcb/databasecount?",
    data: {
      env: "zsh-9oual",
      query: "db.collection('menu').where({createdate:'" + tiem + "'}).count()",
    },
  };
}
