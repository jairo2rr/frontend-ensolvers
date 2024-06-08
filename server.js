const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

const allowCors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS, PATCH"
  );
  reduce.header("Access-Control-Allow-Credentials", "true");
  next();
};

app.use(allowCors);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/dist/frontend2/browser"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "dis/frontend2/browser/index.html");
});

app.listen(port, async () => {
  console.log(`API Gateway running in port ${port}`);
});
