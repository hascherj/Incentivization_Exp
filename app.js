/// load modules 
var  express = require("express");

const fetch = require("node-fetch"); 
const body_parser = require("body-parser");

var Dropbox = require("dropbox").Dropbox;

// instanitate the app
var app = express();

const dbx = new Dropbox( {
    accessToken: '37nhxFocf3sAAAAAAAAAATAiTycUIezpCUGxw56XuRSRMFiIKydizoFJrzfdWcKE',
    fetch
});


//functions

saveDropbox = function(content, filename) {
    return dbx.filesUpload({
            path: "/" + filename,
            contents: content,
        });
};

 saveDropboxSingleFile = function (content, filename) {
     return dbx.filesUpload({
         path: "/" + filename,
         contents: content,
         autorename: false,
         mode:  'overwrite'
     });
};

function json2csv(objArray){
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var line = '';
    var result = '';
    var columns = [];
  
    var i = 0;
    for (var j = 0; j < array.length; j++) {
        for (var key in array[j]) {
            var keyString = key + "";
            keyString = '"' + keyString.replace(/"/g, '""') + '",';
            if (!columns.includes(key)) {
                columns[i] = key;
                line += keyString;
                i++;
            }
        }
    }
  
    line = line.slice(0, -1);
    result += line + '\r\n';
  
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var j = 0; j < columns.length; j++) {
            var value = (typeof array[i][columns[j]] === 'undefined') ? '' : array[i][columns[j]];
            var valueString = value + "";
            line += '"' + valueString.replace(/"/g, '""') + '",';
        }
  
        line = line.slice(0, -1);
        result += line + '\r\n';
    }
    return result;
  };


// static middleware
app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use(body_parser.json({limit:"50mb"}));

//view locations, set up static html
app.set("views",__dirname + '/public/views');
app.engine("html", require("ejs").renderFile);
app.set("view_engine", "html");

//routing
app.get("/", function (request, response){
    response.render("index.html")
});



app.post("/experiment-data",function(request,response)  {
    //retrieve the data
    request.setTimeout(0);

   DATA_CSV = json2csv(request.body); 

   //get filename from data
   var row = DATA_CSV.split("\n")
   ID_DATE_index = row[0].split(",").indexOf('"subid_date"');
   ID_DATE = row[1].split(",")[ID_DATE_index];
   ID_DATE = ID_DATE.replace(/"/g,"");
   filename = ID_DATE + ".csv";

   //save
   saveDropboxSingleFile(DATA_CSV, filename).catch(err => console.log(err))

    //response.end();
}
);


app.listen(process.env.PORT, function() {
    console.log("listening to port")
});


 