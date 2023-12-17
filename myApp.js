let express = require('express');
let app = express();
let bodyParser = require("body-parser");

const PORT = 3000; // You can use any available port
//app.get("/", (req, res) => {
//  res.send("Hello Express");
//})

// Serve Static Assets
let assets = express.static( __dirname + "/public");
app.use("/public", assets);  

// Implement a Root-Level Request Logger Middleware
let logger = (req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
}
app.use(logger);


// Mount bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));


// Serve an HTML File
app.get("/", (req, res) => {
  let absolutePath = __dirname + "/views/index.html";  
  res.sendFile(absolutePath);
})

// Serve JSON on a Specific Route
app.get("/json", (req,res) => {
  
  const mySecret = process.env['MESSAGE_STYLE'];
  let message = "Hello json";
  message = mySecret == "uppercase" ? message.toUpperCase() : message;
  res.json({"message": message});
})

// Chain Middleware to Create a Time Server
app.get("/now", (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => {
  res.json({"time": req.time});
})

// Get Route Parameter Input from the Client
app.get("/:word/echo", (req, res) =>{
  let word = req.params.word;
  res.json({"echo": word});
})

// Get Query Parameter Input from the Client
app.get("/name", (req, res) => {
  let firstname = req.query.first;
  let lastname = req.query.last;

  res.json({"name": firstname + " " + lastname});
  
})

// Get Data from POST Requests
app.post("/name", (req, res) => {
  let firstname = req.body.first;
  let lastname = req.body.last; 
  res.json({"name": firstname + " " + lastname});
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
