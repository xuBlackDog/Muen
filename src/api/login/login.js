import { request } from "api/request";

export function login(username, password) {
  return {
    method: "post",
    url: "api/tcb/databasequery?",
    data: {
      env: "zsh-9oual",
      query:
        "db.collection('admin').where({username: '" +
        username +
        "', password :'" +
        password +
        "'}).get()",
    },
  };
}
