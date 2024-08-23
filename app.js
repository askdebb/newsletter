const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const path = require("path");


const app = express();

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "signup.html"))
});

app.post("/success", function(req, res){
    res.redirect("/");
});

app.post("/failure", function(req, res){
    res.redirect("/");
});


app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    // console.log(`You entered: ${firstName} as first name, ${lastName} as last name and ${email} as your email address.`);
    // res.send(`Successfully registered`)

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/a09103e1fb";

    const options = {
        method: "POST",
        auth: "codebolt1:a88dfba8f0b06ec14ef4f0facec75b09-us11"
    }

    const request = https.request(url, options, function(response) {
        let rawData = '';
        response.on("data", function(theRawData){
            rawData += theRawData;
        });

        response.on("end", function(){
            if(response.statusCode === 200) {
                try {
                    const jsObject = JSON.parse(rawData);
                    console.log(jsObject);
                    res.sendFile(path.join(__dirname, "success.html"));
                } catch (error) {
                    console.log(`Error processing the data being sent: Code ${error.statusCode}`);
                }
            } else {
                res.sendFile(path.join(__dirname, "failure.html"))
            }     
        });
    });

    request.write(jsonData);
    request.end();

});



app.listen(3000, function(){
    console.log("Server started on port 3000.");
    
});


// a88dfba8f0b06ec14ef4f0facec75b09-us11

// a09103e1fb

module.exports = app;