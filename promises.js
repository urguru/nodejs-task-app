const doWorkCallback=(callback)=>{
    setTimeout(()=>{
        callback("Bitches",undefined)
    },2000)
}

doWorkCallback((error,success)=>{
    console.log(error)
    console.log(success)
})


const doWorkPromise= new Promise((resolve,reject)=>{
    setTimeout(()=>{
        //resolve("Hello The answer is correct")
        reject("Error is therre")
    },2000)
})

doWorkPromise.then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error);
    
})