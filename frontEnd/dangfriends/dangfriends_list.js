let root = tagCreate("div", { id: "root" });
document.body.appendChild(root);
styleCreate(root, dangfriendsStyle.rootStyle);

let rootChild = [];
for (let i = 0; i < 3; i++) {
  let child = tagCreate("div", {});
  root.appendChild(child);
  rootChild.push(child);
}

//댕프렌드 리스트 자리
styleCreate(rootChild[1], dangfriendsStyle.friendsWrapArea);

//즐겨찾기한 팔로우 자리
let starFriends = tagCreate("div", {id:"star"});
rootChild[1].appendChild(starFriends);
styleCreate(starFriends, dangfriendsStyle.starFriendsArea);

//구분선
let grid = tagCreate("div", {});
rootChild[1].appendChild(grid);
styleCreate(grid, dangfriendsStyle.divisLine);

//일반 팔로우 자리
let friends = tagCreate("div", {id:"friends"});
rootChild[1].appendChild(friends);
styleCreate(friends, dangfriendsStyle.stdFriendsArea);

//상단 메뉴바
topMenu(rootChild[0]);
createHamburger(root);


loadFriendsList(starFriends, friends);

function loadFriendsList(starFriends, friends) {
  const xhr = new XMLHttpRequest();
  const cookie = document.cookie.split("=")[2];
  const _URL = `http://localhost:2080/loadFriendsList`;
  // let result = {};
  xhr.open("POST", _URL, true);
  xhr.send(`{id=${cookie}}`);
  xhr.addEventListener("load", function () {
    const friendsList = JSON.parse(this.response)

    for(let i = 0; i < friendsList.starId.length; i++){
      createfriendsList(starFriends, friendsList.starId[i], friendsList.starDogName[i], friendsList.starIntro[i]);
    }

    for(let i = 0; i < friendsList.stdId.length; i++){
      createfriendsList(friends, friendsList.stdId[i], friendsList.stdDogName[i], friendsList.stdIntro[i]);
    }
  });
}

function createfriendsList(parent, userID, dogName, intro){

  let box = tagCreate("div", {});
  parent.appendChild(box);
  styleCreate(box, dangfriendsStyle.friendsProfile);

  let profileimg = tagCreate("div", {});
  box.appendChild(profileimg);
  styleCreate(profileimg, dangfriendsStyle.profileImage);

  let profileText = tagCreate("div", {});
  box.appendChild(profileText);
  styleCreate(profileText, dangfriendsStyle.profileTextArea);

  let userSapce = tagCreate("div", {})
  profileText.appendChild(userSapce);
  styleCreate(userSapce, dangfriendsStyle.profileNameArea)

  let friendListDogName = tagCreate("div", {});
  userSapce.appendChild(friendListDogName);
  styleCreate(friendListDogName, dangfriendsStyle.friendsDogname);
  friendListDogName.innerText = dogName;

  let friendListUserName = tagCreate("div", {});
  userSapce.appendChild(friendListUserName);
  styleCreate(friendListUserName, dangfriendsStyle.friendsName);
  friendListUserName.innerText = `(${userID})`;

  let friendIntro = tagCreate("div", {});
  profileText.appendChild(friendIntro);
  styleCreate(friendIntro, dangfriendsStyle.friendsIntro);
  friendIntro.innerText = intro;

  let friendsMore = tagCreate("div", {});
  box.appendChild(friendsMore);
  styleCreate(friendsMore, dangfriendsStyle.profileMore);
  friendsMore.innerText = '. . .';

  createModalWindow(friendsMore);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', `http://localhost:2080/sendImage`);
  xhr.responseType = 'blob';
  xhr.send(`type=proFile&id=${userID}`); 
  xhr.addEventListener('load', function(){
    let imageFromServer = URL.createObjectURL(xhr.response);
    profileimg.style.backgroundImage = `url(${imageFromServer})`;
    console.log("이미지 가져오기 완료");
  });
}

function createModalWindow(friendsMore){
  // 모달창 생성
  const modal = document.createElement("div");
  modal.classList.add("modal");
  styleCreate(modal, dangfriendsStyle.friendsMoreModal);

  // 버튼 생성
  const profileBtn = document.createElement("div");
  profileBtn.textContent = "즐겨찾기 추가/ 삭제";
  const chatBtn = document.createElement("div");
  chatBtn.textContent = "채팅";
  const reportBtn = document.createElement("div");
  reportBtn.textContent = "차단";
  const exitBtn = document.createElement("div");
  exitBtn.innerHTML = "&#x2716;";
  styleCreate(exitBtn, {
    display: "flex",
    justifyContent: "end",
  });

  // 버튼을 모달창에 추가
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.appendChild(exitBtn);
  modalContent.appendChild(profileBtn);
  modalContent.appendChild(chatBtn);
  modalContent.appendChild(reportBtn);
  // modalContent.appendChild(mypageForm);

  styleCreate(profileBtn, dangfriendsStyle.friendsMoreModalBtn);
  styleCreate(chatBtn, dangfriendsStyle.friendsMoreModalBtn);
  styleCreate(reportBtn, dangfriendsStyle.friendsMoreModalBtn);
  // 모달창에 모달컨텐츠 추가
  modal.appendChild(modalContent);

  exitBtn.addEventListener("mouseover", function () {
    exitBtn.style.cursor = "pointer";
  });

  friendsMore.addEventListener("click", function () {
    friendsMore.appendChild(modal);
  });
  exitBtn.addEventListener("click", function () {
    modal.remove();
  });

  // profileBtn.addEventListener("click",()=>{
  //   mypageForm.submit();
  // })

}
// 하단 메뉴바
btmMeun(rootChild[2])