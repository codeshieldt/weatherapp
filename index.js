require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", Math.round(orgVal.main.temp-273));
  temperature = temperature.replace("{%tempmin%}", Math.round(orgVal.main.temp_min-273));
  temperature = temperature.replace("{%tempmax%}", Math.round(orgVal.main.temp_max-273));
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      'https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=489a4bd772496764a0d5abc22aedbdef'
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        //console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Listening at port ${port}`)
});