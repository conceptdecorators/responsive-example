const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");
const { stringify } = require("querystring");

const app = express();

require("dotenv").config();
// console.log(process.env);

// Bodyparser Middleware
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Signup Route
app.post("/signup", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    MMERGE3,
    MMERGE5,
    MMERGE6,
    MMERGE4,
    MMERGE7,
  } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          MMERGE3,
          MMERGE5,
          MMERGE6,
          MMERGE4,
          MMERGE7,
        },
      },
    ],
  };

  // Turn into stringify
  const postData = JSON.stringify(data);

  const options = {
    url: `https://us20.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_ID}`,
    method: "POST",
    headers: {
      AUthorization: `auth ${process.env.MAILCHIMP_AUTH}`,
    },
    body: postData,
  };

  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("/success.html");
      } else {
        res.redirect("fail.html");
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
