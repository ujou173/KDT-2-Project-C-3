import cmServer from "./commonServer.js";


export default function postBoardFileRead(request, response){

  let splitURL = request.url.split("/")[2];

  if (splitURL === "commonFunc.js") {
    cmServer.fileDirectory(`common/${splitURL}`, response);
  } 
  else if (splitURL === "topMenu.js") {
    cmServer.fileDirectory(`common/${splitURL}`, response);
  } 
  else if (splitURL === "bottomMenu.js") {
    cmServer.fileDirectory(`common/${splitURL}`, response);
  }
  else if (splitURL === "commentWindow.js") {
    cmServer.fileDirectory(`post_board/${splitURL}`, response);
  }
  else if (splitURL === "commentRecent.js") {
    cmServer.fileDirectory(`post_board/${splitURL}`, response);
  }
  else if (splitURL === "commentUpdateDelete.js") {
    cmServer.fileDirectory(`post_board/${splitURL}`, response);
  }
  else if (splitURL === "commentInput.js") {
    cmServer.fileDirectory(`post_board/${splitURL}`, response);
  }
  else if (splitURL === "postCreate.js") {
    cmServer.fileDirectory(`post_board/${splitURL}`, response);
  }
  else if (splitURL === "dangstargram.js") {
    cmServer.fileDirectory(`post_board/${splitURL}`, response);
  }

  if (request.url.startsWith("/writeImage")) {
    cmServer.fileDirectory(`resource/write.png`, response);
  }
}