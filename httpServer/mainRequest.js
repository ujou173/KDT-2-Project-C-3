import http from "http";
import fs from "fs";
import mysql from "mysql";
import htmlBox from "../htmlBox.js";
import ValueCheck from "../ValueCheck.js";
import { parse } from "path";
import callMain from "./callMain.js";

// import mapMerker from "./mapMerker.js";
// import markerJson from "./markerJson.json" assert { type: "json" };

//db 연동이 되어있으니 아래 테이블을 따로 만들 필요 없음
// 집에서 수정하려면 만들어야함
/* 필요한 테이블 이름 : [
  CREATE TABLE userinfo(
    id varchar(20),
    PW varchar(20),
    question int,
    answer varchar(20),
    dogName varchar(20),
    dogGender int,

    primary key(id)
  );
  CREATE TABLE map_tables(
    latitude decimal(17,14),
    longitude decimal(17,14)
  )
]*/

const mysqlInfo = {
  host: "192.168.0.93",
  user: "guest",
  password: "0000",
  database: "mungta",
};

const server = http.createServer(function (request, response) {
  //로그인
  let body = "";
  if(request.method === "GET"){
    if (request.url === "/") {
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      response.write(htmlBox.htmlFunc(htmlBox.loginBody));
      response.end();
    } else if (request.url === "/loginPage.js") {
      // loginPage.js 파일 read
      fs.readFile("../loginPage.js", function (err, data) {
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.write(data);
        response.end();
      });
    } else if (request.url.startsWith("/resource/MainLogo"))
    {
      // MainLogo.png 파일 read
      fs.readFile(`../resource/MainLogo.png`, function (err, data) {
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.write(data);
        response.end();
      });
    } else if (
      request.url.startsWith("/resource/MainDog")
    ) {
      // MainDogImg.png 파일 read
      fs.readFile(`../resource/MainDogImg.jpg`, function (err, data) {
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.write(data);
        response.end();
      });
    }
    

    //메인화면
    callMain(request, response)

    //회원가입
    if (request.url === "/signUp") {
      response.writeHead(200);
      response.write(htmlBox.htmlFunc(htmlBox.signupPage));
      response.end();
    }
    if (request.url.startsWith("/signupstyle")) {
      fs.readFile(`../signup.js`, function (err, data) {
        response.writeHead(200);
        response.write(data);
        response.end();
      });
    }
    if (
      request.url.startsWith("/signupResultStyle")
    ) {
      fs.readFile(`../signupResult.js`, function (err, data) {
        response.writeHead(200);
        response.write(data);
        response.end();
      });
    }
    if (request.url.startsWith("/favicon")) {
      fs.readFile(`../graphic/dogpaw.png`, function (err, data) {
        response.writeHead(200);
        response.write(data);
        response.end();
      });
    }
    if (request.url.startsWith("/dupCheck")) {
      let checkID = request.url.split("=")[1];
      let connection = mysql.createConnection(mysqlInfo);
      connection.connect();
      connection.query(
        `SELECT * FROM userInfo WHERE id = "${checkID}"`,
        (error, rows, fields) => {
          if (error) throw error;
          else {
            response.writeHead(200);
            response.end(String(rows));
          }
        }
      );
    }

    
    //댕맵
    if (request.url === "/map") {
      response.writeHead(200);
      response.write(htmlBox.htmlFunc(htmlBox.dangMap));
      response.end();
    } else if (request.url.startsWith("/dangMap")) {
      fs.readFile(`../dangMap.js`, function (err, data) {
        response.writeHead(200);
        response.write(data);
        response.end();
      });
      // console.log("url == " + request.url);
    }
    else if (request.url.startsWith("/frFootprint")) {
      console.log("url == " + request.url);
      let checkID = request.url.split("=")[1];
      let connection = mysql.createConnection(mysqlInfo);
      let count;
      let fMarkerArr = {};
      connection.connect();
      console.log("url ==" + request.url);

      connection.query(
        `select count(*) as count from map_tables join fr_list on fr_list.fr_id = map_tables.id where user_id = "${checkID}"`,
        function (err, data) {
          if (err) throw err;
          else {
            count = data[0].count;
            console.log("친구 발자국 수: " + count);
            // response.writeHead(200);
            // response.end(JSON.stringify(data));
            // console.log(JSON.stringify(data));
          }
        }
      );

      connection.query(
        `select latitude, longitude, id from map_tables join fr_list on fr_list.fr_id = map_tables.id where user_id = "${checkID}"`,
        (err, rows) => {
          if (err) throw err;
          else {
            for (let i = 0; i < count; i++) {
              let fArr = [];
              fArr.push(rows[i].latitude, rows[i].longitude, rows[i].id);
              fMarkerArr[i] = fArr;
            }
            response.writeHead(200);
            response.write(JSON.stringify(fMarkerArr));
            response.end();
            console.log(JSON.stringify(fMarkerArr));
          }
        }
      );
      connection.end();
    }
    else if(request.url.split('/')[2] === 'dangMapSlide'){
      fs.readFile(`../dangMapSlide.js`, function(err, data){
        response.writeHead(200);
        response.write(data);
        response.end();
      })
    }
    
    if(request.url.startsWith('/mypage?')) {
      let target = request.url.split("=")[1]
      let connection = mysql.createConnection(mysqlInfo);
      connection.connect();
      connection.query(`SELECT * FROM userinfo where id='${target}'`, (error, rows, fields) => {
        if (error) throw error;
        else{
          response.writeHead(200);
          response.write(`<script>
            const targetIdFromServer = '${target}';
            const dogNameFromServer = '${rows[0].dogName}';
            const dogGenderFromServer = '${rows[0].dogGender}';
          </script>`)
          response.write(htmlBox.htmlFunc(htmlBox.mypage))
          response.end();
        }
      });
      connection.end();
    }
    else if(request.url.startsWith('/mypageStyle')){
      fs.readFile(`../mypageStyle.js`, function(err, data){
        response.writeHead(200);
        response.write(data);
        response.end();
      })
    }
    if(request.url.startsWith('/followRequest')) {
      let target = request.url.split("?")[1]
      let targetArr = target.split("&")
      let connection = mysql.createConnection(mysqlInfo);
      connection.connect();
      connection.query(`INSERT INTO fr_list_testbyJin VALUES('${targetArr[0].split("=")[1]}','${targetArr[1].split("=")[1]}')`, (error, rows, fields) => {
        if (error) throw error;
        else{
          response.writeHead(200);
          response.end();
        }
      });
      connection.end();
  }}

// post request
  if(request.method === 'POST'){
    if(request.url.startsWith('/uploadImage')){
      let body = '';
      request.on('data', function (data) {
        body = body + data;
      });
      request.on('end', function () {
        console.log("image uploading")
        let result = body.split("\r")
        console.log(result[3].slice(1));
        console.log(result[7].slice(1));
        let connection = mysql.createConnection(mysqlInfo);
        connection.connect();
        connection.query(`INSERT INTO userimage VALUES('${result[3].slice(1)}','${result[7].slice(1)}')`, (error, rows, fields) => {
        if (error) throw error;
        else{
          response.writeHead(200);
          response.end();
          }
        });
        connection.end();

        console.log("이미지 저장 완료");

      })}
      if(request.url.startsWith('/loadUserImage')){
        let body = '';
        request.on('data', function (data) {
          body = body + data;
        });
        request.on('end', function () {
          console.log("이미지 요청 받는 중")
          let connection = mysql.createConnection(mysqlInfo);
          connection.connect();
          connection.query(`SELECT image FROM userimage WHERE id='${body.split("=")[1]}'`, (error, rows, fields) => {
          if (error) throw error;
          else{
            response.writeHead(200);
            response.end(rows[0].image);
          }
        });
        connection.end();
      })}

      if (request.url.startsWith("/login")) {
        console.log("/login 페이지 진입");
        request.on("data", function (data) {
          body = body + data;
          console.log(body);
        });
        request.on("end", function () {
          let idSplit = body.split("&")[0];
          let pwSplit = body.split("&")[1];
          let userLoginId = idSplit.split("=")[1];
          let userLoginPw = pwSplit.split("=")[1];
          console.log(userLoginId);
          console.log(userLoginPw);
    
          // MySQL과 연동 , UserLoginData DB에 접속
          let connection = mysql.createConnection(mysqlInfo);
    
          // connection 시작
          connection.connect();
    
          // where절 사용을 위한 userLoginId 변수 배열화
          // let sqlValId = [userLoginId];
          // where절 사용을 위한 query 변수화
          // let sql = 'SELECT ifnull(max(userID), 0) userID, userPW from LoginData where userID = ?';
          // ifnull(컬럼명, 출력값) -> 만약 데이터가 null일 경우 출력값을 대신 출력
          // ifnull(max(userID), 0) -> max(userID) : userID 중에 가장 높은 값을 출력 -> userID에 존재하지 않는 값이 들어온 경우 가장 높은 값이 없다 -> null 출력 -> ifnull에 의해 0 출력
    
          // DB에 접근 후 데이터 조회
    
          connection.query(
            `SELECT id, PW from userinfo where id = '${userLoginId}'`,
            (error, data, fields) => {
              if (error) throw error;
              console.log("실행");
              console.log(data);
              if (data.length > 0) {
                let dataId = data[0].id; //DB에 저장된 ID값
                let dataPw = data[0].PW; //DB에 저장된 PW값
                if (userLoginId === dataId) {
                  // 입력된 ID가 DB에 있을 경우
                  if (userLoginPw === dataPw) {
                    // 입력된 ID에 대해 입력된 PW값과 DB에서 조회된 PW값이 일치 할 경우
                    console.log("로그인 성공");
                    connection.end();
                    response.writeHead(200);
                    const idCookie = "id=" + dataId;
                    console.log(idCookie);
                    response.write(
                      `<script>document.cookie ="${idCookie}"</script>`
                    );
                    response.write("<script>window.location='/main'</script>"); // 이후 병합시 main 페이지로 연결
                    response.end();
                  } else {
                    // 입력된 ID에 대해 입력된 PW값과 DB에서 조회된 PW값이 일치 하지 않을 경우
                    console.log("비밀번호가 틀렸습니다");
                    connection.end();
                    const msg = htmlBox.htmlFunc(
                      `<script>window.alert('비밀번호가 틀렸습니다')</script>`
                    );
                    const back = htmlBox.htmlFunc(
                      `<script>window.location = 'http://localhost:2080'</script>`
                    );
                    response.writeHead(200);
                    response.write(msg);
                    response.write(back);
                    response.end();
                  }
                }
              } else {
                console.log("가입되지 않은 회원입니다");
                connection.end();
                const msg = htmlBox.htmlFunc(
                  `<script>window.alert('가입되지 않은 회원입니다')</script>`
                );
                const back = htmlBox.htmlFunc(
                  `<script>window.location = 'http://localhost:2080'</script>`
                );
                response.writeHead(200);
                response.write(msg);
                response.write(back);
                response.end();
              }
            }
          );
        });
      }if (request.url.startsWith("/menuMap")) {
        let body = "";
        let cooData;
    
        request.on("data", function (chunk) {
          //서버로 보내지는 데이터 받는 중
          body += chunk;
        });
        request.on("end", function () {
          //데이터 다 받은 뒤 DB에 입력
          //console.log(body);
          cooData = JSON.parse(body);
    
          response.writeHead(200, { "Content-Type": "text/html" });
          response.end();
    
          for (const key in cooData) {
            //console.log(cooData[key]);
    
            let conn = mysql.createConnection(mysqlInfo);
            conn.connect();
            conn.query(
              `insert into map_tables(latitude, longitude, id) values(${cooData[key][0]}, ${cooData[key][1]}, '${cooData[key][2]}')`,
              function (err) {
                if (err) throw err;
                else console.log("정상적으로 DB에 저장");
              }
            );
            conn.end();
          }
        });
      }if (request.url.startsWith("/signUpResult")) {
        let body = "";
        request.on("data", function (data) {
          body = body + data;
        });
        request.on("end", function () {
          let bodycarrier = body.split("&");
          let bodySplit = [];
          for (let i = 0; i < bodycarrier.length; i++) {
            bodySplit.push(bodycarrier[i].split("="));
          }
          let userInfoCheck = new ValueCheck(
            bodySplit[0][1],
            bodySplit[1][1],
            bodySplit[2][1],
            decodeURIComponent(bodySplit[3][1]),
            decodeURIComponent(bodySplit[4][1]),
            bodySplit[5][1]
          );
          console.log(userInfoCheck);
          let connection = mysql.createConnection(mysqlInfo);
          connection.connect();
          connection.query(
            `INSERT INTO userInfo(id,PW,question,answer,dogName,dogGender) values("${userInfoCheck._id}","${userInfoCheck._pw}",${userInfoCheck.qe},"${userInfoCheck._as}","${userInfoCheck._dogName}",${userInfoCheck.dogGender})`,
            (error) => {
              if (error) throw error;
              console.log("정상작동");
            }
          );
    
          connection.query("SELECT * FROM userInfo", (error, rows, fields) => {
            if (error) throw error;
            else {
              console.log(rows);
            }
          });
    
          connection.end();
    
          response.writeHead(200);
          response.write(htmlBox.htmlFunc(htmlBox.signUpResult));
          response.end();
        });
      }if(request.url.startsWith('/dragMarker')) { // 댕맵에서 마커 드래그가 끝났을 때
        let body = "";
        let dragData;
      
        request.on('data', function(data){
          body += data;
        })
        request.on("end", function(){ // 전송된 데이터를 다 받은 후
          dragData = JSON.parse(body);
          console.log("아래는 dragData 입니다")
          console.log(dragData);
      
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.end();
          for(const key in dragData){
            let conn = mysql.createConnection(mysqlInfo);
            conn.connect();
            // DB에 있는 데이터를 업데이트 / id가 a고 위도가 b고 경도가 c인 데이터의 위도를 d, 경도를 e로 업데이트
            conn.query(`UPDATE map_tables SET latitude = '${dragData[key][0]}', longitude = '${dragData[key][1]}' WHERE id = '${dragData[key][2]}' and latitude = '${dragData[key][3]}' and longitude = '${dragData[key][4]}'`,
            function(err){
              if(err) throw err;
              else console.log("정상적으로 DB 업데이트");
            });
            conn.end();
          }
        })
      }
  

  }
});



// 서버 포트 설정
server.listen(2080, function (error) {
  if (error) {
    console.error("서버 안돌아감");
  } else {
    console.log("서버 돌아감");
  }
});