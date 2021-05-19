const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

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
    return res.json({ status : "File uploaded successfully!" });
});

//Tell the webpage the root HTML file
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "/src/views/", "index.html"));
});

//Send website to local host port 5050 and print server running to console
app.listen(process.env.PORT || 5050, () => console.log("Server running..."));