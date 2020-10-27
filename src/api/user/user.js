import { request } from "api/request.js";
export function selectUserList(limit, skip) {
  return {
    method: "post",
    url: "/api/tcb/databasequery?",
    data: {
      env: "zsh-9oual",
      query:
        "db.collection('user').limit('" + limit + "').skip(" + skip + ").get()",
    },
  };
}
export function selectUserCount() {
  return {
    method: "post",
    url: "/api/tcb/databasecount?",
    data: {
      env: "zsh-9oual",
      query: "db.collection('user').count()",
    },
  };
}
