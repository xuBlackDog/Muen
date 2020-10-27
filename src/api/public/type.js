export function querytable(tname, limit, skip) {
  return {
    method: "post",
    url: "/api/tcb/databasequery?",
    data: {
      env: "zsh-9oual",
      query:
        "db.collection('" +
        tname +
        "').limit(" +
        limit +
        ").skip(" +
        skip +
        ").get()",
    },
  };
}

export function del_food(_id) {
  return {
    method: "post",
    url: "/api/tcb/databasedelete?",
    data: {
      env: "zsh-9oual",
      query: "db.collection('food').doc('" + _id + "').remove()",
    },
  };
}

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

export function queryfoodtable(limit, skip) {
  let env = "zsh-9oual";
  let name = "getFood";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      limit: limit,
      skip: skip,
    }),
  };
}
export function queryfoodtypetable(limit, skip) {
  let from = "type";
  let localField = "_ftid";
  let foreignField = "_id";
  let as = "foodtypes";
  return {
    method: "post",
    url: "/api/tcb/databaseaggregate?",
    data: {
      env: "zsh-9oual",
      query:
        "db.collection('foodtype').aggregate().lookup({from:'" +
        from +
        "',localField:'" +
        localField +
        "', foreignField:'" +
        foreignField +
        "',as:'" +
        as +
        "'}).addFields({ fatype: '$foodtypes.type',fa_id:'$foodtypes ._id'}).limit(" +
        limit +
        ").skip(" +
        skip +
        ").end()",
    },
  };
}
export function addfood(type, _ftid, _fid) {
  let env = "zsh-9oual";
  let name = "addfood";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _ftid,
      type,
      _fid,
    }),
  };
}
export function addfoodtype(type, ftid) {
  let env = "zsh-9oual";
  let name = "addfoodtype";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _ftid: ftid,
      type: type,
    }),
  };
}
export function add_label(type) {
  let env = "zsh-9oual";
  let name = "add_label";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      labelName: type,
    }),
  };
}

export function addtype(type) {
  let env = "zsh-9oual";
  let name = "addtype";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      type: type,
    }),
  };
}

export function updatafood(id, type) {
  let env = "zsh-9oual";
  let name = "updatafood";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _id: id,
      type: type,
    }),
  };
}
export function updatafoodtype(id, type) {
  let env = "zsh-9oual";
  let name = "updatafoodtype";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _id: id,
      type: type,
    }),
  };
}

export function delete_label(id, type) {
  let env = "zsh-9oual";
  let name = "del_label";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _id: id,
      st: type,
    }),
  };
}
export function up_label(id, type) {
  let env = "zsh-9oual";
  let name = "up_label";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _id: id,
      labelName: type,
    }),
  };
}
export function updatatype(id, type) {
  let env = "zsh-9oual";
  let name = "updatatype";
  return {
    method: "post",
    url: "/api/tcb/invokecloudfunction?env=" + env + "&name=" + name + "",
    data: JSON.stringify({
      _id: id,
      type: type,
    }),
  };
}
