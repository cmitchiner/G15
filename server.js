const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const {spawn} = require("child_process");

//Formating the uploaded file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/uploads/'));
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, 'data.csv');
    }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/src/views')));



//Add the upload function to the website
app.post('/upload', upload.single("Csv data file"), (req, res) => {
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['./public/py/SankeyScript.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`)});
    return res.json({ status : "File uploaded successfully!" });
});

//Tell the webpage the root HTML file
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "/src/views/", "index.html"));
});

//Send website to local host port 5050 and print server running to console
app.listen(process.env.PORT || 5050, () => console.log("Server running..."));