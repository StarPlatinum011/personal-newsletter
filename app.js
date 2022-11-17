const express = require("express");
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

const app = express();
const port = 3000;

//to use the static files 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.post('/', function(req, res) {
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;

    let data = {
        members:[
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    let jsonData = JSON.stringify(data);

    //at the end must be list/audience key
    const url = "https://us21.api.mailchimp.com/3.0/lists/d0c698d1ec"
    const options = {
        method: 'POST',
        auth: "karan:def44bb2d1181da3f985778f34b82fc1-us21"                                                                                                                                                                                        
    }

    const request = https.request(url, options, function(response) {
        response.on('data', function(data) {

            if(response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res) {
    //redirect when the post request happens
    res.redirect('/');
})


app.listen(port, function() {
    console.log('Server is now running on port 3000');
})


// mailchip api key 
// def44bb2d1181da3f985778f34b82fc1-us21
//audience ID 
//d0c698d1ec