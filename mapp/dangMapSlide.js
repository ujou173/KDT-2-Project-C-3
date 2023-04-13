const slide = document.getElementById("slide");

const element = document.createElement("div");
slide.appendChild(element);
styleCreate(slide.children[0], targetStyle.menuMapSlideBar);

let sw = true;
let move;
let down = true;
slide.style.transition = "cubic-bezier(0.07,0.6,0.71,0.97) 0.7s";

// 객체의 drag를 이용해 구현
/*
slide.draggable = "true";

slide.addEventListener('dragend', function(){
  if(sw){
    slide.style.bottom = '90px';
    sw = false;
  }
  else if(!sw){
  slide.style.bottom = '-155px';
    sw = true;
  }
})
*/

slideEvent(); //마우스 이벤트를 이용해 구현

function slideEvent() {
  // slide.onmousedown = function(){
  //   down = true;
  //   return down;
  // }
  // slide.onmousemove = function(){
  //   if(down){
  //     move = true;
  //     return move;
  //   }
  // }
  // slide.onmouseup = function(){
  //   if(move){
  //     if(sw){
  //       slide.style.bottom = '90px';
  //       sw = false;
  //     }
  //     else if(!sw){
  //     slide.style.bottom = '-155px';
  //       sw = true;
  //     }
  //     console.log(down)
  //     console.log(move)

  //   }
  //   move = false;
  //   down = false;

  // }
  slide.children[0].addEventListener("click", function () {
    if (down) {
      slide.style.bottom = "90px";
      down = false;
    } else {
      slide.style.bottom = "-155px";
      down = true;
    }
  });
}

// 슬라이드 안쪽 구성
const slideWrap = tagCreate("div", { id: "slideWrap" });
slide.appendChild(slideWrap);
// slideWrap.innerHTML = `test`;
styleCreate(slideWrap, targetStyle.menuMapSlideWrap);

// 발자국이 찍힌 사람이 총 몇명인지 서버에서 변수로 받아와서 반복문을 돌려야 할 것으로 생각 됨
// 임시로 최대치인 31을 넣어 둠
for (let i = 0; i < 31; i++) {
  const slideElement = tagCreate("div", {});
  styleCreate(slideElement, targetStyle.menuMapSlideItems);
  slideElement.innerText = `test${i}`;
  slideWrap.appendChild(slideElement);
}
//console.dir(slide.children[1]);
// console.log(slide.children[1].style.marginLeft);
// let a = slide.children[1].style.marginLeft;
// console.log(a);
// let b = a.split("p")[0];
// console.log(b);

//======================================================================================

//슬라이드 메뉴 - 팔로우 검색 창
const search = tagCreate("div", {});
slide.appendChild(search);
styleCreate(slide.children[2], targetStyle.menuMapSlideSearch)

//팔로우 검색창 - 검색 bar
slide.children[2].appendChild(tagCreate("input", {name: "followSearch", type: "text" }));
styleCreate(slide.children[2].children[0], targetStyle.menuMapSlideSearchBar);

//팔로우 검색창 - 검색 button
slide.children[2].appendChild(tagCreate("div", {innerText: "search"}));
styleCreate(slide.children[2].children[1], targetStyle.menuMapSlideSearchButton);

//팔로우 검색 버튼 클릭 시 동작 함수
slide.children[2].children[1].addEventListener('click', function(){
  let res;
  let findVal = slide.children[2].children[0].value;
  const cookieId = document.cookie.split("=")[1];
  //console.log("쿠키: " + cookieId)

  //팔로우 ID 검색한 값 표시해줄 영역
  let searchResult = tagCreate("div", {});
  slide.appendChild(searchResult);
  styleCreate(slide.children[3], targetStyle.menuMapSlideSearchResult)

  //슬라이드 메뉴 높이 값 조정
  styleCreate(slide, {height: pageStyle.height.height450});


  const xhr = new XMLHttpRequest();
  xhr.open("POST", `http://localhost:2080/followSearch`, true);
  // httpRequest.send(`re1=${result[0]}`);
  xhr.send(`searchValue=${findVal}&id=${cookieId}`); 

  xhr.addEventListener('load', function(){
    res = JSON.parse(xhr.response);

  let searchList; //찾은 팔로우 ID값 리스트로 담아 둠.
    for(const key in res){
      searchList += `<option value="${res[key]}">${res[key]}</option>`;
      // console.log(`값: ${key}, ${res[key]}`)
    }
    slide.children[3].innerHTML = `<select id="searchResult" onchange="searchResultChooseValue()">
    <option value="none">검색 결과</option>
    ${searchList}
    </select>`;

    styleCreate(slide.children[3].children[0], targetStyle.menuMapSlideSearchResultList)
  });

  
})

//검색된 팔로우 ID 리스트에서 선택했을 때 동작되는 함수
function searchResultChooseValue(){
  let choose = document.getElementById("searchResult")
  console.log(`친구 선택: ${choose.options[choose.selectedIndex].value}`)

  //검색된 팔로우 선택하면 기존 창으로 되돌아 감
  styleCreate(slide.children[3], {display: "none"});
  styleCreate(slide, {height: pageStyle.height.height308});
}

//=============================================================================================

// 슬라이드 스와이프 시 옆으로 이동
// 마우스 다운한 지점과 마우스 이동한 곳의 좌표값을 비교하여 음수인지 양수인지로 어느 방향으로 이동했는지 판별
// 한계값을 설정하고 그 이하일 경우에는 이동한 값 만큼 marginLeft 또는 marginRight를 이용하여 실시간 슬라이드 구현
slide.children[1].addEventListener("mousedown", function (e) {
  let mDown = true;
  let startX = e.clientX;

  let a = slide.children[1].style.marginLeft;
  console.log(a);
  let b = Number(a.split("p")[0]);
  console.log("b : " + b);
  
  console.log("다운시 값 : " + slide.children[1].style.marginLeft)
  
  // console.log("startPoint : " + startPoint);
  console.log("startX : " + startX);
  slide.children[1].addEventListener("mousemove", function (event) {
    if (mDown) {
      console.log("mDown : " + mDown);
      let deltaX = startX - event.clientX;
      console.log("deltaX : " + deltaX);
      console.log("startX : " + startX + " clientX : " + event.clientX);
      if(deltaX > 0) {
        if (slide.children[1].style.marginLeft > 0) {
          console.log("+마진값 > 0 : " + slide.children[1].style.marginLeft);
          // slide.children[1].style.marginLeft = 0;
        } else {
          slide.children[1].style.marginLeft = `-${deltaX}px`;
          console.log("+마진값 < 0 : " + slide.children[1].style.marginLeft);
        }
      } 
      else {
        if (slide.children[1].style.marginLeft < 0) {
          // slide.children[1].style.marginLeft = 0;
        } else {
          slide.children[1].style.marginLeft = `-${deltaX}px`;
          console.log("-마진값 : " + slide.children[1].style.marginLeft);
        }
      }
    }
  });
  slide.children[1].addEventListener("mouseup", function () {
    mDown = false;
  });
});
