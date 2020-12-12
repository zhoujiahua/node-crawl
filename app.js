const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();

app.use(morgan("dev"));
// app.use(helmet());
app.use(cors());
// app.use(cors({
//   origin: appOrigin
// }));

// Used body parser
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

//Used art template
app.set('view cache', false);
app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

//Set public folder
app.use(express.static(__dirname + "/public"));


// Used View
app.use('/', require('./routes/index'));

// Used API
app.use('/api', require('./api/index'));

// Start server
const port = process.env.API_PORT || 3000;
app.listen(port, () => console.log(`API Server listening on port http://localhost:${port}`));