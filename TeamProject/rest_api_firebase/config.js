const admin = require("firebase-admin");
const { initializeApp } = require('firebase/app');
const  { getAuth }  = require('firebase/auth');

//비공개 키를 넣어줘야함 (파이어 베이스에서 다운받아 파일에 넣어주기)
const serviceAccount = require("./개인firebase키");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "개인firebase주소"
});

const firebaseConfig = {
  //개인firebase인증객체
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
//내 파이어 베이스 프로젝트의 RTDB참조자 생성
const db=admin.database();
//만든 객체를 app.js에서 사용하기 위해 exports
module.exports= {db,auth}