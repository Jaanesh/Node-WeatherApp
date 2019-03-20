let latestSuggestions=[];

function displayForeCast(error,summary){
   console.log('Display Forecast');
   let summaryElement=document.getElementById('weatherSummary');
   if(error){
      console.log(error);      
      summaryElement.innerHTML=error;
      summaryElement.style.color='tomato';
   }else{
      console.log(summary);
      summaryElement.innerHTML=summary;
      summaryElement.style.color='green';
   }
}

function getForeCast(placeobj,callback){
    console.log('getForeCast for '+placeobj.location);
    console.log('latitude ='+placeobj.latitude);
    console.log('longitude='+placeobj.longitude);

    //change url to /getWeatherForeCast?latitude='+placeobj.latitude+"&longitude="+placeobj.longitude
    // while running in local url=http://localhost:3000/getWeatherForeCast?latitude='+placeobj.latitude+"&longitude="+placeobj.longitude
    fetch('/getWeatherForeCast?latitude='+placeobj.latitude+"&longitude="+placeobj.longitude)
    .then(response=> response.json())
    .then(jsonData=>callback(undefined,jsonData.summary))    
    .catch(errorObj=>callback(errorObj.error,undefined));


}

function populateSuggestions(suggestionArray){
    latestSuggestions=[];

    let dataListElement=document.querySelector("#placeSuggestion");

    removeAllChildElements(dataListElement);   

    suggestionArray.forEach(place=>{
      let newOption=document.createElement("Option");
      let attribute=document.createAttribute('value');
      attribute.value=place.location;
      newOption.setAttributeNode(attribute);
      dataListElement.appendChild(newOption);
      latestSuggestions.push(place);
    });
}

function handleSuggestions(error,responseData){
    if(error){
        console.log(responseData);
       showValidationMessage(error,'tomato');
    }else if(responseData.error){
        console.log(responseData);
        showValidationMessage(responseData.error,'tomato');
    }else{
        console.log(responseData);

        let suggestionArray=[];

        responseData.forEach(place=>{
            suggestionArray.push(place);
        }); 
        populateSuggestions(suggestionArray); 
    }
}

function showValidationMessage(validationMessage,textColor){
       let validationMessageElement=document.querySelector("#validationMessage");
        validationMessageElement.innerHTML=validationMessage;
        validationMessageElement.style.color=textColor; 
}

function onEnteringPlace(){  

    document.getElementById('weatherSummary').innerHTML='';

    let place=document.querySelector("#place").value.trim();

    console.log('enetered place='+place);

    
    let selectedPlace=latestSuggestions.filter((temp)=>{
           return temp.location.trim()===place;
    });

    if(selectedPlace.length>0){
        console.log(selectedPlace);
        console.log('selected from datalist='+selectedPlace[0].location);
        getForeCast(selectedPlace[0],displayForeCast);
    }else{
        if(place.length>0){         
            getSuggestionsFromMapBox(place,handleSuggestions);        
       }else{
           let dataListElement=document.querySelector("#placeSuggestion");
           removeAllChildElements(dataListElement);
           showValidationMessage('Enter place name to show suggestions','tomato');       
       }
    }

   
}



function getSuggestionsFromMapBox(place,callback){

   // while running in prod /getPlaceSuggestions?place='+place
   // in local http://localhost:3000/getPlaceSuggestions?place='+place

       fetch('/getPlaceSuggestions?place='+place)
            .then(response=> response.json())
            .then(jsonData=>callback(undefined,jsonData))    
            .catch(errorObj=>callback(errorObj.error,undefined));
            
}

function removeAllChildElements(parentElement){
    while(parentElement.hasChildNodes()){
        parentElement.removeChild(parentElement.firstChild);
    }
}



 