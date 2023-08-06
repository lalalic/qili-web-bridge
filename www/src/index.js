import "./style.css"
import React from "react"
import {View, Pressable, Text, TextInput, Button, Modal} from "react-native"
import { NativeRouter, Route, Routes} from "react-router-native"
import storage from 'redux-persist/lib/storage'
import {Qili, Provider}  from "react-native-use-qili/store"
import Login from "react-native-use-qili/components/Login"

export default function App(){
    return (
        <Provider {...{storage}}>
            <View style={{flex:1}}>
                <Login.Required>
                    <NativeRouter>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                        </Routes>
                    </NativeRouter>
                </Login.Required>
            </View>
        </Provider>
    )
}

function Home(){
    const [accessTokens, setAccessTokens]=React.useState([])
    const [token, setLatestToken]=React.useState("")
    const [creating, setCreating]=React.useState(false)
    const getAccessTokens=React.useCallback(async ()=>{
        const {accessTokens}=(await Qili.fetch({
            query:`{
                me{
                  accessTokens {
                    name
                    type
                    createdAt
                    updatedAt
                    hiddenID
                  }
                }
              }`
        })).me
        setAccessTokens(accessTokens)
    },[setAccessTokens])

    React.useEffect(()=>{
        getAccessTokens()
    },[])
    return (
        <View style={{flex:1}}>
            <View style={{padding:10}}>
                <View style={{alignItems:"center", marginBottom:20,marginTop:20}}>
                    <Pressable onPress={e=>setCreating(true)}>
                        <Text style={{color:"blue"}}>Generate Access Token</Text>
                    </Pressable>
                </View>

                <View style={{height:50,alignItems:"center"}}>{!!token && <Text> {token}</Text>}</View>

                {accessTokens.map(({name, type, hiddenID, createdAt}, i)=>(
                    <View key={`${type}-${name}`} style={{flex:1, flexDirection:"row", marginBottom:10}}>
                        <Text style={{flex:1}}>{name}: {hiddenID}</Text>
                        <Text style={{flex:1}}>{createdAt}</Text>
                        <Pressable style={{flex:1}} onPress={async ()=>{
                            await Qili.fetch({
                                query:`mutation($type:String, $name:String!){
                                    removeAccessToken(type:$type, name:$name)
                                }`,
                                variables:{type, name}
                            })
                            const changed=[...accessTokens]
                            changed.splice(i,1)
                            setAccessTokens(changed)
                        }}>
                            <Text style={{color:"blue"}}>Remove</Text>
                        </Pressable>
                    </View>
                ))}
            </View>


            <View style={{flexGrow:1}}/>
                <ShowHelpers/>
                {!!creating && <AccessTokenGenerator 
                    style={{position:"absolute",bottom:0,width:"100%",padding:20, backgroundColor:"gray"}}
                    onCancel={e=>setCreating(false)}
                    onSubmit={async name=>{
                        debugger
                        if(!accessTokens.find(a=>a.name==name)){
                            const {generateAccessToken:token}=await Qili.fetch({
                                query:`mutation($type:String, $name:String!){
                                    generateAccessToken(type:$type, name:$name)
                                }`,
                                variables:{name}
                            })
                            setLatestToken(token)
                            getAccessTokens()
                            setCreating(false)
                        }
                    }}
                />}
            </View>
    )
}

function AccessTokenGenerator({onCancel, onSubmit, style}){
    const [name, setName]=React.useState("")
    return (
        <View style={[{flex:1},style]}>
            <View style={{alignItems:"center", margin:10}}>
                <Text>Generate Access Token</Text>
            </View>
            <View style={{flex:1, flexDirection:"row",margin:10}}>
                <Text style={{width:100, textAlign:"right",padding:10}}>name:</Text>
                <TextInput style={{flexGrow:1, height:"auto", borderBottomColor:"white", borderBottomWidth:1}} 
                    value={name}
                    onChangeText={text=>setName(text)}/>
            </View>
            <View style={{flex:1, flexDirection:"row", margin:10}}>
                <View style={{flex:1, alignItems:"center"}} >
                    <Button title="cancel" onPress={e=>onCancel?.()}/>
                </View>
                <View style={{flex:1, alignItems:"center"}} >
                    <Button title="submit"  onPress={e=>onSubmit?.(name)}/>
                </View>
            </View>
        </View>
    )
}

function ShowHelpers(props){
    const [helpers, setHelpers]=React.useState([])
    const refresh=React.useCallback(async ()=>{
        const {me:{helpers}}=Qili.fetch({
            query:`query{me{helpers}}`
        })
        setHelpers(helpers)
    },[])
    React.useEffect(()=>{
        const timer=setInterval(refresh,60*1000)
        return ()=>clearInterval(timer)
    },[])


    return (
        <Pressable onPress={refresh}>
            <Text {...props}>
                {helpers.length>0 && `You are helping under names: [${helpers.join(",")}]` || " "}
            </Text>
        </Pressable>
    )
}