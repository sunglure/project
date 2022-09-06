const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);
const ejs = require('ejs');
const cypto = require('crypto');

app.set('views', './view')
app.use(express.static('./static'))
app.set('view engine', 'ejs')

const body = require('body-parser');
const path = require('path');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
  
let p_id, p_passwords;
mongoose.connect('mongodb://localhost:27017/admin');
const db = mongoose.connection;
app.use(serveStatic(path.join('public', __dirname, 'public')));
app.use(body.urlencoded({extended: false}));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));
const router = express.Router();
db.on('error', function(){
    alert('연결 에러다');
});
db.once('open', function(){
    console.log('연결');
});
app.use('/', router);

var student = mongoose.Schema({
    name : 'string',
    password : 'string'
});

var Student = mongoose.model('Schema', student);

router.route('/enroll').post(
    function (req, res){
        p_id = req.body.id;
        p_passwords = req.body.pw;
        const crypt = (password) => {
            return cypto.createHash("sha512").update(password).digest("base64");
        };
        if(Student){
            enroll(Student, p_id, crypt(p_passwords), function(err, result){
                if(err) {
                    console.log('에러');
                    res.write('<h1>에러</h1>')
                    res.end();
                    return;
                }
                if(result) {
                    console.log(p_id+'성공');
                    res.write('sucess');
                    res.write(p_id+'sucess')
                    res.end();
                }
                else {
                    console.log('에러');
                }
            })
        }
        else{
            console.log('db연결이 안됨');
        }
    }
)

let enroll = function (newStudent, id, passwords, callback) {
    var newStudent = new Student({name: id, password: passwords});
    newStudent.save(function(error, data){
        if(error){
            callback(err, null);
            return
        }
        console.log('생성되었습니다')
        callback(null, newStudent);
    });
}

router.route('/login').post(
    function (req, res){
        p_id = req.body.id;
        p_passwords = req.body.pw;
        const crypt = (password) => {
            return cypto.createHash("sha512").update(password).digest("base64");
        };
        if(Student){
            logind(Student, p_id, crypt(p_passwords), function(err, result){
                if(err) {
                    console.log('에러');
                    res.write("에러가 났습니다.")
                    res.end()
                }
                
                if(result) {
                    console.log(p_id+'성공');
                    res.write('sucess');
                    res.write('welcome '+p_id)
                    res.end();
                }
                else {
                    console.log('에러');
                    res.render("check")
                }
            })
        }
        else{
            console.log('db연결이 안됨');
        }
    }
)

let logind = function (Student, id, passwords, callback) {
    let cnt=0;
    var result = Student.findOne({name:id},
        (err, docs) => {
            if(err){
                console.log(result)
                callback(err, null);
                return;
            }
            if(docs){
                console.log(result)
                console.log('find')
                cnt++;
            }
            else{
                console.log('not find')
                callback(null, null);
                return
            }
        })
        var result1 = Student.findOne({password:passwords},
            (err, docs) => {
                if(err){
                    callback(err, null);
                }
                if(docs&&cnt==1){
                    callback(null, docs);
                }
                else{
                    callback(null, null);
                    return
                }
            })
}


var game = mongoose.Schema({
    name : 'string',
    gong : 'string'
});

var Game = mongoose.model('gamesses', game);

router.route('/regame').post(
    function (req, res){
        p_name = req.body.name;
        p_gong = req.body.gong;
        if(Game){
            games(Game, p_name, p_gong, function(err, result){
                if(err) {
                    console.log('에러');
                    res.write('<h1>에러</h1>')
                    res.end();
                    return;
                }
                if(result) {
                    console.log(p_name+'이 등록되었습니다');
                    res.write('sucess');
                    res.write(p_name+' is sucess')
                    res.end();
                }
                else {
                    console.log('에러');
                }
            })
        }
        else{
            console.log('db연결이 안됨');
        }
    }
)

let games = function (newGame, name, gong, callback) {
    var newGame = new Game({name: name, gong: gong});
    newGame.save(function(error, data){
        if(error){
            callback(err, null);
            return
        }
        console.log('생성되었습니다')
        console.log(newGame)
        callback(null, newGame);
    });
}







app.get('/', (req, res) => {
    res.render("main");
})

app.get('/ggame4', (req, res) => {
    res.render("ggame4");
})

app.get('/game4', (req, res) => {
    res.render("game4");
})

app.get('/login', (req, res) => {
    res.render("login");
})

app.get('/pro', (req, res) => {
    res.render("pro");
})

app.get('/enroll', (req, res) => {
    res.render("enroll");
})

app.get('/plus', (req, res) => {
    res.render("plus");
})

app.get('/question', (req, res) => {
    res.render("question");
})

app.get('/minigames', (req, res) => {
    res.render("minigames");
})

app.get('/cumunity', (req, res) => {
    res.render("cumunity");
})

app.get('/check', (req, res) => {
    res.render("check");
})

app.get('/main2', (req, res) => {
    res.render("main2");
})

app.get('/check1', (req, res) => {
    res.render("check1");
})

http.listen(8080, () => console.log("server start"));

