module.exports={
    ...require("./qili.conf.js"),
   // bucket:"http://localhost:9080/1/parrot/static/upload",
}

require("../qili/dev")({conf:module.exports, apiKey:"bridge"})