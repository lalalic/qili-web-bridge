const conf=require("./qili.conf.js")
const qili="../qili"
require(`${qili}/dev`)({
    conf:{
        ...conf,
        root:`${conf.root}/web-build`,
        graphiql:true,
    },
    apiKey:"bridge", 
    vhost:"qili2.com",
    credentials:(()=>{
        const fs=require('fs')
        const path=require('path')
        return {
            key: fs.readFileSync(path.resolve(__dirname,`${qili}/certs/privkey.pem`), 'utf8'), 
            cert: fs.readFileSync(path.resolve(__dirname,`${qili}/certs/cert.pem`), 'utf8')
        }
    })(),
})