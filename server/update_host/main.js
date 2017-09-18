var http = require('http');
var fs = require('fs');
var Client = require('ftp');

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
var c = new Client();

var file = fs.createWriteStream("temp.html");
http.get("http://localhost:4040/status", function(res) {
    res.setEncoding("utf8")
    res.on('data', function(data) {
        file.write(data);
    }).on('end', function() {
        file.end();
        myEmitter.emit("onLoadHTML");
    });
});

myEmitter.on('onLoadHTML', () => {
    fs.readFile("temp.html", "utf8", (err, html) => {
        //console.log(html);
        html = html.split(".ngrok.io")[1];
        html = html.split("http://")[1];

        fs.writeFile("url.txt", html + ".ngrok.io:80", (err) => {
            if (!err) {
                c.connect({ host: "ftp.books-proger.esy.es", user: "u924219166", password: "7654321" });
            } else { console.log("Ошибка записи локального файла.") }
        });
    })
})

c.on('ready', function() {
    c.put('url.txt', 'url.txt', function(err) {
        if (err) throw err;
        c.end();
        process.exit(0);
    });
});