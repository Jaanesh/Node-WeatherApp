const request=require('request');

const getGeoCode=(searchString,callback)=>{

    console.log('searchString='+searchString);

 let mapBoxHost='https://api.mapbox.com/geocoding/v5/mapbox.places/'+searchString+'.json?access_token=pk.eyJ1IjoiamFhbmVzaCIsImEiOiJjanRjZzh0NmowMnMzM3lvOGs2cnZtcmZwIn0.dFcdQfOtG-LWhAr1zUFPYg';

//console.log('mapBoxHost='+mapBoxHost);

 request({url:mapBoxHost,json:true},(error,response)=>{
     if(error){
        callback('please check your network connectivity',undefined);
     }else if(response.body.features.length<1){
        callback('No details found for provided search String',undefined);
     }else{
        let placeSuggestionArray=[];

        response.body.features.forEach(element => {
            let obj={
               latitude:element.center[1],
               longitude:element.center[0],
               location:element.place_name
            }

            placeSuggestionArray.push(obj);
        });
        callback(undefined,placeSuggestionArray);
     }
})

}

module.exports={
    getGeoCode
}





