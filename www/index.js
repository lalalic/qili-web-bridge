import { registerRootComponent } from 'expo';
import useQili from "react-native-use-qili"
useQili({
    apiKey:"bridge",
    api:__DEV__ ? "http://localhost:9080/1/graphql" : undefined
})

registerRootComponent(require('./src').default)
