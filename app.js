const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
 
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname));
 
mailchimp.setConfig({
  apiKey: "e50f088919881eaa822f9023c7281a3e-us1",
  server: "us1"
});
 
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})
 
app.post("/", function(req, res){
  console.log(req.body.fname);
  console.log(req.body.lname);
  console.log(req.body.email);
 
  const listId = "954d52ea88";
  const subscribingUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
  };
 
  async function run() {
      try {
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });
 
          console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id}.`
          );
 
          res.sendFile(__dirname + "/success.html");
      } catch (e) {
          res.sendFile(__dirname + "/failure.html");
      }
  }
 
  run();
})
 
app.post("/failure", function(req, res) {
  res.redirect("/");
})
 
app.listen(process.env.PORT|| 3000, function () {
  console.log("Server is running on port 3000")
});

// Api key
// e50f088919881eaa822f9023c7281a3e-us1
// unique ID
// 954d52ea88