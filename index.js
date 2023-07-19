Cloud.addModule({
    ...require("react-native-use-qili/cloud/web-proxy")(
        (()=>{
            if(__DEV__)
                return
        
            return new (require("graphql-redis-subscriptions").RedisPubSub)({
                connection: {
                    host:"qili.pubsub",
                }
            })
        })()
    ),
})

Cloud.addModule(Cloud.AccessToken)

__DEV__ && Cloud.addModule({
    name:"events",
    events:{
        graphql(request){
            console.debug(`graphql: ${request?.query.replace(/\s+/g," ")}`)
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