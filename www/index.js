import { registerRootComponent } from 'expo';
import useQili from "react-native-use-qili"
useQili({
    apiKey:"bridge",
    api:"http://localhost:9080/1/graphql"
})

registerRootComponent(require('./src').default)
