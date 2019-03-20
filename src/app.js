const path=require('path');
const express=require('express');
const hbs=require('hbs');
const geoCodeObj=require('./geocode');
const foreCastObj=require('./forecast');

const app=express();

// setting up port for our app to take the port number from heroku environment
//while running in local code will take port as 3000 and takes it frome env when deployed to heroku
const port=process.env.PORT || 3000;

//setting up the path for serving static pulic directory and dynamic handlebar directoy
const publicDirectory=path.join(__dirname,'../public');
const handleBarTemplateViewsDirectory=path.join(__dirname,'../HandleBar_Templates/views');
const handleBarTemplatePartialsDirectory=path.join(__dirname,'../HandleBar_Templates/partials');

//setting up handlebars engine and views location for express
app.set('view engine','hbs');
app.set('views',handleBarTemplateViewsDirectory);


//registering the partials with handlebars
hbs.registerPartials(handleBarTemplatePartialsDirectory);

//setting up to serve static directory in express
app.use(express.static(publicDirectory));


app.get('/',(req,res)=>{
    res.render('index',{
        title:'Weather App',
        author:'Jaanesh'
    });
})


app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Weather App help page',
        author:'Jaanesh'
    });
})

 app.get('/help/*',(req,res)=>{
    res.render('404-page',{
        title:'404-Page Not found',
        message:'The requested help page is not found.. ',       
        author:'Jaanesh'
    })
}) 

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'Weather App about page',
        author:'Jaanesh'
    }); 
})

app.get('/getPlaceSuggestions',(req,res)=>{
     console.log(req.query.place.trim());

     geoCodeObj.getGeoCode(req.query.place.trim(),(error,responseObj)=>{
         if(error){
             return res.send({
                 error:error
             });
         }
         res.send(responseObj);         
     });
});

app.get('/getWeatherForeCast',(req,res)=>{
     if(req.query.latitude && req.query.longitude){
         console.log('req.query.latitude='+req.query.latitude);
         console.log('req.query.longitude='+req.query.longitude);
        foreCastObj.getForeCast(req.query.latitude,req.query.longitude,(error,foreCastResponse)=>{
                if(error){
                    return res.send({
                        error
                    });
                }
                
                res.send({
                    summary:foreCastResponse.daily.summary
                });
        });           
     }else{
          res.send({
              error:'Provide latitude and longitude to get the forecast'
          })
     }
});



app.get('*',(req,res)=>{
    res.render('404-page',{
        message:'The requested page is not found.. ',
        title:'404-Page Not found',
        author:'Jaanesh'
    })
})

app.listen(port,()=>{
    console.log('Server started on port '+port);
})


