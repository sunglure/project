const mongoose = require('mongoose');
const express = require('express');
const body = require('body-parser');
const path = require('path');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const app = express();   
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
mongoose.connect('mongodb://localhost:27017/admin');
const Db = mongoose.connection;

var game = mongoose.Schema({
    name : 'string',
    gong : 'string'
});


Db.on('error', function(){
    alert('연결 에러다');
});
Db.once('open', function(){
    console.log('연결');
});

var Game = mongoose.model('Schema', game);
app.use('/', router);
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

let games = function (newStudent, name, gong, callback) {
    var newGame = new Game({name: name, password: gong});
    newGame.save(function(error, data){
        if(error){
            callback(err, null);
            return
        }
        console.log('생성되었습니다')
        callback(null, newGame);
    });
}
