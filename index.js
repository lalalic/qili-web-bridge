Cloud.addModule(
    require("react-native-use-qili/cloud/web-proxy")(
        (()=>{
            if(__DEV__)
                return
        
            return new (require("graphql-redis-subscriptions").RedisPubSub)({
                connection: {
                    host:"qili.pubsub",
                }
            })
        })()
    )
)

Cloud.addModule(Cloud.AccessToken)

Cloud.addModule(require("react-native-use-qili/cloud/events"))