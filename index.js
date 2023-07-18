Cloud.addModule({
    ...require("react-native-use-qili/cloud/web-proxy")(
        (()=>{
            let i=0
            const pubsub=new (require("graphql-redis-subscriptions").RedisPubSub)({
                connection: {
                    host:"qili.pubsub",
                },
                connectionListener(err){
                    if(err?.errno==-3008){
                        i++
                        if(i==3){
                            pubsub.closed=true
                            console.error(`redis can't be connected, tried 3 times, but still failed, quit.`)
                            pubsub.close()
                        }
                    }
                } 
            })
            return pubsub
        })()
    ),
})

Cloud.addModule(Cloud.AccessToken)

Cloud.addModule({
    name:"events",
    events:{
        graphql(request){
            console.debug(`graphql: ${request?.query}`)
        },
        load(){
            console.info('is ready')
        },
        ["static"](url){
            console.debug(`> ${url}`)
        },

        ["static.matched"](url){
            console.debug(`>> ${url}`)
        },
        ["static.no"](url){
            console.debug(`>> !${url}`)
        }
    }
})