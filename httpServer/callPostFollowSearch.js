import htmlBox from "../common/htmlBox.js";
import mysql from "mysql";
import cmServer from "./commonServer.js";

export default function(request, response){
  if (request.url.startsWith("/followSearch")) {
    let body = "";

    request.on("data", function (chunk) {
      //서버로 보내지는 데이터 받는 중
      body += chunk;
    });
    request.on("end", function () {

      //데이터 받는 작업 끝나면 검색 키워드와 유저ID값 저장
      let searchVal = body.split("&");
      let keyword = searchVal[0].split("=")[1]; //검색 키워드
      let userId = searchVal[1].split("=")[1]; //유저ID
      console.log("검색 값: " + keyword)

      let count; //검색 결과 개수
      let searchRes = []; //검색된 결과값 
      let conn = mysql.createConnection(cmServer.mysqlInfo);
      conn.connect();
      conn.query(
        `select count(*) as count from fr_list where user_id='${userId}' and fr_id like '%${keyword}%'`,
        function (err, data) {
          if (err) throw err;
          else {
            count = data[0].count;
            //console.log("검색 수: " + count);
          }
        }
      );
      conn.query( `select fr_id from fr_list where user_id='${userId}' and fr_id like '%${keyword}%'`,
      function(err, result){
        if (err) throw err;
        else {
          for (let i = 0; i < count; i++) {
            searchRes[i] = result[i].fr_id;
            //console.log("결과 값: " + searchRes[i]);
          }

        }
      });
      conn.end();

      response.writeHead(200, { "Content-Type": "plain" });
      response.end();

    });
  }
}