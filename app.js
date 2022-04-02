const express = require("express")
const https = require("https")
const app = express()
const bodyParser = require("body-parser")


app.use(bodyParser.urlencoded({extended: true}))

//for the static files to render, such as images and the css.  Create 'public' and move the images & css in public
app.use(express.static("public"))

app.get('/', function(req,res){
    res.sendFile(__dirname + "/signup.html")
})


app.post('/', function(req,res){

    //prepare to send data to mailchimp
    const fname = req.body.fname;
    const lname = req.body.lname
    const email = req.body.email

    const data = {
        members: [ 
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }    
            }

        ]
    }

    //flat pack (JSON to string) the data to send to the server
    const jsonData = JSON.stringify(data)

    //post the data to the mailchimp

    const url = "https://us1.api.mailchimp.com/3.0/lists/a0f71ff49f"

    const options = {
        method: "POST",
        auth: "nikballal:99737406ffc2ca70e65b2e711df3c2b6-us1"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }

        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()

})

app.post('/failure', function(req,res){
    res.redirect('/')
})

//using dynamic port process.env.PORT
app.listen(process.env.PORT || 3000, function(){
    console.log('Server is running on port 3000')
})



//API Key - 99737406ffc2ca70e65b2e711df3c2b6-us1
//List/audience id - a0f71ff49f
 

//Procfile tells heroku where to start, as in the main file, i.e app.js

