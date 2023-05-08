function main() {
  let root = tagCreate("div", { id: "root" });
  document.body.appendChild(root);
  styleCreate(root, targetStyle.mainRoot);
  let rootChild = [];
  for (let i = 0; i < 6; i++) {
    let child = tagCreate("div", { id: i });
    root.appendChild(child);
    rootChild.push(child);
  }

  //상단메뉴바 commonFunc로 이동
  rootChild[2].id = "map";
  topMenu(rootChild[0]);
  createHamburger(root);

  //날씨 메뉴 commonFunc로 이동
  styleCreate(rootChild[1], targetStyle.mainWeatherBanner);
  styleCreate(rootChild[2], targetStyle.mainMap);
  styleCreate(rootChild[3], targetStyle.mainSlideWrap);
  styleCreate(rootChild[4], targetStyle.mainFindingDogs);

  // 하단 메뉴바 common.js
  btmMeun(rootChild[5]);
  const gotop = document.getElementById("goTop");
  gotop.style.display = "none";

  // 슬라이드 시작부분
  // 콜백함수로 사용했다. sendRequest라는 서버요청용 함수
  function sendRequest(url, callback) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      }
    };
    let targeNumber = [4, 5, 6, 7, 8];
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(targeNumber));
    console.log(targeNumber);
  }

  // 2. 슬라이드 생성함수이다. 여기서 함수를 가져와서 해당 URL에 요청한다.
  function createSlide(rootChild) {
    console.log("cute");
    // 서버에 요청을 보내기 위해 sendRequest 함수를 호출합니다.
    sendRequest("http://localhost:2080/slidePlease", (responseData) => {
      // 서버에서 받은 데이터를 사용하여 슬라이드를 만드는 로직을 추가합니다.

      console.log(responseData);

      for (let i = 0; i < responseData.length; i++) {
        slideChild[i].children[0].innerText = responseData[i].post_detail;
      }
    });

    let slideCover = tagCreate("div", {});
    rootChild.appendChild(slideCover);
    styleCreate(slideCover, targetStyle.mainSlideCover);

    let slideChild = [];
    let slideColor = ["#245953", "#408E91", "#E49393", "#D8D8D8", "#867070"];
    let slidePosition = [-1, 0, 1, 1, 1];
    for (let i = 0; i < 5; i++) {
      let child = tagCreate("div", {});
      slideCover.appendChild(child);
      styleCreate(child, {
        width: "500px",
        height: "260px",
        backgroundColor: slideColor[i],
        position: "absolute",
        color: "white",
        fontSize: "30px",
        fontWeight: "500",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "0.6s ease",
      });

      // Add left side text container
      let leftTextContainer = tagCreate("div", {});
      styleCreate(leftTextContainer, {
        width: "50%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      });
      child.appendChild(leftTextContainer);

      // Add right side image container
      let rightImageContainer = tagCreate("div", {});
      styleCreate(rightImageContainer, {
        width: "50%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
      });
      rightImageContainer.style.backgroundImage = `url('이미지_URL_${i}')`; // 이미지 URL을 여기에 추가하면 된다.
      child.appendChild(rightImageContainer);

      slideChild.push(child);
    }
    function setSlidePosition(childArr) {
      for (let i = 0; i < childArr.length; i++) {
        childArr[i].style.left = `${slidePosition[i] * 100}%`;
      }
    }
    setSlidePosition(slideCover.children);

    let leftButton = tagCreate("div", { id: "leftButton" });
    styleCreate(leftButton, targetStyle.mainSlideLeftBtn);
    rootChild.appendChild(leftButton);
    leftButton.textContent = "<";
    let rightButton = tagCreate("div", { id: "rightButton" });
    styleCreate(rightButton, targetStyle.mainSlideRightBtn);
    rootChild.appendChild(rightButton);
    rightButton.textContent = ">";

    let dotsWrap = tagCreate("div", { id: "dotsWrap" });
    rootChild.appendChild(dotsWrap);
    styleCreate(dotsWrap, targetStyle.mainSlideDotWrap);

    for (let slide = 0; slide < 5; slide++) {
      let dot = document.createElement("div");
      styleCreate(dot, targetStyle.mainSlideDot);
      dotsWrap.appendChild(dot);
    }
    let dot = dotsWrap.children;

    function dotwide(nth) {
      for (let indexWidth = 0; indexWidth < dot.length; indexWidth++) {
        if (nth === indexWidth) {
          dot[indexWidth].style.width = "70px";
        } else {
          dot[indexWidth].style.width = "9px";
        }
      }
    }
    dotwide(0);
    let dotCnt = 0;

    function rightMove() {
      slideCover.appendChild(slideCover.firstChild);
      setSlidePosition(slideCover.children);
      dotCnt++;
      dotCnt %= 5;
      dotwide(dotCnt);
    }
    function leftMove() {
      slideCover.prepend(slideCover.lastChild);
      setSlidePosition(slideCover.children);
      if (dotCnt === 0) {
        dotCnt = 4;
      } else {
        dotCnt--;
      }
      dotwide(dotCnt);
    }

    setInterval(() => {
      rightMove();
    }, 5000);

    leftButton.addEventListener("click", () => {
      leftMove();
    });
    rightButton.addEventListener("click", () => {
      rightMove();
    });
    for (let i = 0; i < dotsWrap.children.length; i++) {
      dotsWrap.children[i].addEventListener("click", () => {
        let gap = Math.abs(i - dotCnt);
        if (i > dotCnt) {
          for (let i = 0; i < gap; i++) {
            rightMove();
          }
        } else {
          for (let i = 0; i < gap; i++) {
            leftMove();
          }
        }
      });
    }
  }
  createSlide(rootChild[3]);
  console.log(rootChild[3]);
}

main();

getWeatherAsync();
