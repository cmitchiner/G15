const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const {spawn} = require("child_process");
const fs = require("fs");
//edu fix your wiffi


function reset() {
    
    try {
        fs.unlinkSync(path.join(__dirname, "/public/data/GraphInput.json"));
        console.log("file deleted.")
    }
    catch (error) {
        console.log(error);
    }
};


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
    const python = spawn('python', [path.join(__dirname, '/public/py/dataHandling.py')]); //not working for some reason. Can't find py file maybe?
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // res.sendFile(path.join(__dirname, "/src/views/", "visualizations.html"))
    });
    return res.sendFile(path.join(__dirname, "/src/views/", "loading.html"));
});

app.post('/default', (req, res) => {
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', [path.join(__dirname, '/public/py/DefaultdataHandling.py')]); //not working for some reason. Can't find py file maybe?
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // res.sendFile(path.join(__dirname, "/src/views/", "visualizations.html"))
    });
    return res.sendFile(path.join(__dirname, "/src/views/", "loading.html"));
});

app.post('/remove', (req, res) => {
    reset();
    return res.sendFile(path.join(__dirname, "/src/views/", "loading.html"));
});



//Tell the webpage the root HTML file
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "/src/views/", "index.html"));
});

const port = 80;
//Send website to local host port and print server running to console
app.listen(process.env.PORT || port, () => console.log("Server running at port " + port));