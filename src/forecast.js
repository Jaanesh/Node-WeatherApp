const request=require('request');

const getForeCast=(latitude,longitude,callback)=>{

 let darkSkyHost='https://api.darksky.net/forecast/709cbbe00f7be32e8bfbd82f13b11b94/'+latitude+','+longitude;

 request({url:darkSkyHost,json:true},(error,response)=>{
     if(error){
        callback('please check your network connectivity',undefined);
     }else if(response.body.error){
        callback(response.body.error,undefined);
     }else{
        callback(undefined,response.body);
     }
})
}

module.exports={
    getForeCast
}