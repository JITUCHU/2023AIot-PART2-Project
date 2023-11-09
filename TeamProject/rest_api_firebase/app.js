const express = require("express")
const server = express()  

const {db,auth} =require("./config")
const { createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut } = require("firebase/auth")


const bodyParser = require("body-parser")

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended : true}))

const PORT = process.env.PORT || 3000 


server.use(
    express.static(__dirname + "/public"
)
)

//ejs를 사용하기위해 세팅
server.set('view engine','ejs')
server.set('views','./public')

const ref = db.ref()

//회원가입
server.post('/signup',(req, res)=>{
    const { email, password } = req.body;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        res.send("<script>alert('회원가입 성공!');location.href='http://localhost:3000/login.html';</script>");
    })
    .catch((error) => {
        if(error.code === 'auth/email-already-in-use'){ //id가 DB에 없으면(즉, id가 틀렸거나 회원가입이 안되어 있거나) 
            try{
              res.send("<script>alert('이미 사용중인 이메일 입니다.'); location.href='http://localhost:3000/signup.html';</script>");
              }
              catch (exception) {
                res.redirect('http://localhost:3000/signup.html');
            } 
        }
        else if(error.code ==='auth/invalid-emai'){
            try{
                res.send("<script>alert('이메일 형식이 올바르지 않습니다.');location.href='http://localhost:3000/signup.html';</script>");
                }
                catch (exception) {
                  res.redirect('http://localhost:3000/signup.html');
                }
            }
        else if(error.code ==='auth/weak-password'){
            try{
                res.send("<script>alert('비밀 번호가 너무 짧습니다.(6자리 이상)');location.href='http://localhost:3000/signup.html';</script>");
                }
                catch (exception) {
                    res.redirect('http://localhost:3000/signup.html');
                }
            }
        else if(error.code ==='auth/missing-password'){
            try{
                res.send("<script>alert('비밀번호를 입력해 주세요.');location.href='http://localhost:3000/signup.html';</script>");
                }
                catch (exception) {
                    res.redirect('http://localhost:3000/signup.html');
                }
            }
    })
})

server.get('/login',(req, res) =>{
    res.sendFile(__dirname + '/public/login.html');
})

//로그인
server.post('/login',(req, res)=>{
    const { email, password } = req.body;

    signInWithEmailAndPassword(auth, email, password)//로그인
    .then((userCredential) => {
        res.redirect('http://localhost:3000/')

    })
    .catch((error) => {
        if(error.code === 'auth/invalid-email'){ //id가 DB에 없으면(즉, id가 틀렸거나 회원가입이 안되어 있거나) 
            try{
              res.send("<script>alert('유효하지 않은 이메일 입니다.');location.href='http://localhost:3000';</script>");
              }
              catch (exception) {
                res.redirect('http://localhost:3000');
            } 
        }
        else if(error.code ==='auth/invalid-login-credentials'){
            try{
                res.send("<script>alert('비밀번호가 틀렸습니다.');location.href='http://localhost:3000';</script>");
                }
                catch (exception) {
                  res.redirect('http://localhost:3000');
                }
            }
    
        })
})

//로그아웃임 >> post로 바꿔서 redirect해주면 끝남
server.get("/logout", (req,res) => {
    if(auth.currentUser){
        signOut(auth).then(() => {
            // console.log("OK")
            // res.redirect('http://localhost:3000')
            res.send("<script>alert('로그아웃 되었습니다.');location.href='http://localhost:3000';</script>");
        }).catch(() => {
            console.log("yet")}
        )}

})

server.get('/', (req, res) => {
    if(auth.currentUser){
        res.render('index');
    }
    else{
        res.redirect('http://localhost:3000/login')
    }
     
});

server.get("/get-all-data", (req, res) => {
    if(auth.currentUser){
        ref.once('value', (data) => {
            res.json(data.val())
        });
    }
})



server.get('/back', (req, res) => {
    if(auth.currentUser){
        ref.once('value', (data) => {
            const allData = data.val();
            res.render('back', { data: allData }); // EJS 템플릿에 데이터를 전달
        });
    }
});

server.get('/front', (req, res) => {
    if(auth.currentUser){
        ref.once('value', (data) => {
            const allData = data.val();
            res.render('front', { data: allData }); // EJS 템플릿에 데이터를 전달
        });
    }
});

server.get('/bright', (req, res) => {
    if(auth.currentUser){
        ref.once('value', (data) => {
            const allData = data.val();
            res.render('front', { data: allData }); // EJS 템플릿에 데이터를 전달
        });
    }
});

server.get('/days', (req, res) => {
    if(auth.currentUser){
        ref.once('value', (data) => {
            const allData = data.val();
            res.render('front', { data: allData }); // EJS 템플릿에 데이터를 전달
        });
    }
});

server.get('/input_days', (req, res) => {
    res.sendFile(__dirname + '/public/input_days.html');
});


server.get('/get-data', (req, res) => {
    const key = req.query.date;
    if(auth.currentUser){
        console.log(key)
        ref.child(key).once('value', (data) => {
            const dataValue = data.val();
            res.render('days', { key, data: dataValue });
        });
    }
});



//요청 주소가 잘못된 경우
server.all("/*", (request,response) => {
    response.status(404).json({
        "status" : 404,
        "message" : "BAD REQUEST!"
    })
})

server.listen(PORT, () => { //서버 계속 돌아가게 하는거임
    console.log("Server Litening on PORT :", PORT)
})