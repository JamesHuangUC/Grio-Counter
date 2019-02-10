const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    var allowedOrigins = [
        "https://grio-oa.herokuapp.com",
        "http://localhost:3000"
    ];
    var origin = req.headers.origin;

    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const jwtMW = exjwt({
    secret: "grio oa"
});

let users = [
    {
        id: 1,
        username: "grio",
        password: "grio"
    },
    {
        id: 2,
        username: "root",
        password: "toor"
    }
];

app.get("/", jwtMW, (req, res) => {
    res.send("You are authenticated");
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    for (let i = 0; i < users.length; i++) {
        if (username == users[i].username && password == users[i].password) {
            let token = jwt.sign(
                { id: users[i].id, username: users[i].username },
                "grio oa",
                { expiresIn: 129600 }
            );
            res.json({
                sucess: true,
                err: null,
                token
            });
            break;
        } else if (i == users.length - 1) {
            res.status(401).json({
                sucess: false,
                token: null,
                err: "Username or password is incorrect"
            });
        }
    }
});

app.post("/api/count", (req, res) => {
    console.log(req.body);
    let curNum = req.body.curNum;
    curNum = Math.max(1, curNum * 2);
    res.send(`${curNum}`);
});

app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.redirect("/login");
        // res.status(401).send(err);
    } else {
        next(err);
    }
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
