const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/',function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post('/',function(req,res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    console.log(firstname+" "+lastname)
    console.log(email)

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstname,
                    LNAME:lastname,
                }
            },
        ],
    }
    const jsondata = JSON.stringify(data);

    const url="https://us11.api.mailchimp.com/3.0/lists/921476deff";
    options={
        method:"POST",
        auth:"key:c7414269bc73526c05609ef9c42be5b6-us11",
    }
    const request = https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
        if(response.statusCode==200)
        {
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
    })
    request.write(jsondata);
    request.end();
})

app.post('/failure',function(req,res){
    res.redirect('/');
})

const PORT = process.env.PORT || 5001

app.listen(PORT,function(){
    console.log("Server is running at port "+PORT);
})


// mail chimp api key
// c7414269bc73526c05609ef9c42be5b6-us11

// audience id
// 921476deff

