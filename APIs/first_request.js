var request = require("request");

request('https://jsonplaceholder.typicode.com/users', (error, response, body) =>{
    if(!error && response.statusCode == 200){
        const  parsedData = JSON.parse(body);
        console.log(parsedData[1].name + " coey")
    }
    
});

//cara lain Express 6

const rp = require('request-promise');
rp('https://jsonplaceholder.typicode.com/users')
    .then((body)=>{
        const  parsedDatas = JSON.parse(body);
        parsedDatas.forEach(function(paseData){
            console.log(paseData.address.street);
        });
    })
    .catch((err) =>{
        console.log("error", err);
    });