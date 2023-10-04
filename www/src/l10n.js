
export default globalThis.l10n=new Proxy({},{
    get(target, key){
        return key
    }
})