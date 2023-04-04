styleCreate(rootChild[5],{
  width : "500px",
  height : "90px",
  position : "fixed",
  bottom : "0px",
  backgroundColor : "#F7786B",
  display : "flex",
  justifyContent: "space-around",
  alignItems : "center",
  zIndex : "2"
})
rootChild[2].id = "map"

let menuChild = [];
for(let i = 0;i<5;i++){
  let child = tagCreate("div",{});
  rootChild[5].appendChild(child);
  styleCreate(child,{
    width : "59px",
    height : "59px",
    backgroundColor : "#FDFDFD",
    borderRadius : "5px",
    cursor : "pointer",
    boxShadow : "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    transition : "scale ease 0.3s",
    display : "flex",
    justifyContent: "center",
    alignItems : "center",
    fontSize : "13px",
    fontWeight : "500"
  })
  child.onmouseover = ()=>{
    child.style.scale = "1.1"
  }
  child.onmouseout = ()=>{
    child.style.scale = "1"

  }
  menuChild.push(child);
}
menuChild[0].innerText = "댕댕마켓";
menuChild[1].innerText = "댕자랑";
menuChild[2].innerText = "댕맵";

menuChild[3].innerText = "댕톡";
menuChild[4].innerText = "댕프랜드";
menuChild[2].addEventListener("click",()=>{
  window.location = "http://localhost:2080/map"
})