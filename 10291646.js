var config = {
  apiKey: "AIzaSyCwSAS6_UtpaEKNzHSSyfYlJMk_IqVlHIs",
  authDomain: "dr-friend.firebaseapp.com",
  databaseURL: "https://dr-friend.firebaseio.com",
  projectId: "dr-friend",
  storageBucket: "dr-friend.appspot.com",
  messagingSenderId: "1047926027951"
};
firebase.initializeApp(config);

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

const docRefWalk = firestore.doc("daeryunkim/walk");
const docRefBPM = firestore.doc("daeryunkim/BPM");
const docRefQuestions = firestore.doc("daeryunkim/Questions");
const docRefdiagnosis = firestore.doc("daeryunkim/diagnosis");
const docRefsymptoms = firestore.doc("daeryunkim/symptoms");
const docRefprevalent = firestore.doc("forall/prevalent");
const docprofile = firestore.doc("daeryunkim/profile");
const docbodyinfo = firestore.doc("daeryunkim/bodyinfo");

const outputwalk = document.querySelector("#walk");
const previwalk = document.querySelector("#previwalk");
const walktargetpercent = document.querySelector("#walktargetpercent");
const walktarget = document.querySelector("#walktarget");
const outputbpm = document.querySelector("#bpm");
const previbpm = document.querySelector("#previbpm");
const bpmgetpercent = document.querySelector("#bpmgetpercent");
const outputQuestions = document.querySelector("#Questi");
const outputAnswer = document.querySelector("#Answer");
const topsymptoms = document.querySelector("#topsymptoms");
const outputdiagnosis = document.querySelector("#diagnosis");
const outputprevalentname = document.querySelector("#prevalentname");
const outputprevalentinfo = document.querySelector("#prevalentinfo");
const outputprofilename = document.querySelector("#usrname");
const outputprofileconditions = document.querySelector("#profileconditions");
const outputheight = document.querySelector("#bodyheight");
const outputweight = document.querySelector("#bodyweight");
const outputfat = document.querySelector("#fat");

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location.replace("index.html");
  } else {
    // window.location.replace("index.html");
  }
});

// 초기 변수 선언
walkdata = 0;
bpmdata = 0;
questions = {};
year = "";
fulldate = 0; //FOR TEST ONLY: REMOVE IT LATER
clock = 0; //FOR TEST ONLY: REMOVE IT LATER
// 실시간 업데이트 함수 선언
getRTupdates = function(){
  // 시간 정보 수집
  var time = new Date();
  // ******FOR DEMO******
  time = new Date(2018,9,30,23,50);
  // ********************
  year = String(time.getFullYear());
  var month = String(time.getMonth()+1);
  if (month.length < 2){
    month = "0"+month
  }
  var day = String(time.getDate())
  if (day.length < 2){
    day = "0"+day
  }
  fulldate = String(time.getFullYear())+month+day
  if(parseInt(day)-1 ==0){
    // 매월 첫날
    if (month ==1){
      previdate = String(time.getFullYear()-1)+"1231"
    } else if (month==5 || month == 7 || month==10 || month==12) {
      //전달이 30일일 때: 4, 6, 9,11월
      previdate = String(time.getFullYear())+String(parseInt(month-1))+"30";
    } else if (month==3) { //이전 달이 2월일 때
      if (time.getFullYear()%4 == 0) { //올해가 윤년일 경우
        previdate = String(time.getFullYear())+String(parseInt(month-1))+"29";
      } else { //올해가 윤년이 아닐 경우
        previdate = String(time.getFullYear())+String(parseInt(month-1))+"28";
      }
    } else { //전달이 31일일 때: 나머지 경우
      previdate = String(time.getFullYear())+String(parseInt(month-1))+"31";
    }
  } else {
    if (String(parseInt(day)-1).length <2){
      previdate = String(time.getFullYear())+ month + "0" + String(parseInt(day)-1);
    } else{
      previdate = String(time.getFullYear())+ month + String(parseInt(day)-1);
    }
  }
  // console.log("Yesterday is "+previdate);
  var hour = String(time.getHours())
  if (hour.length < 2){
    hour = "0"+hour
  }
  var minut = String(time.getMinutes())
  if (minut.length < 2){
    minut = "0" + minut
  }
  minut = minut[0] + "0"
  clock = hour+minut
  // console.log("Now is..."+fulldate+clock);
  // console.log("And");
  if (hour =="00" && minut =="00") {
    previclock = "2350"
    previtime = previdate + previclock
  } else if (minut == "00") {
    previclock = String(parseInt(hour)-1) + "50"
    previtime = fulldate + previclock
  } else {
    previclock = hour + String(parseInt(minut)-10)
    previtime = fulldate + previclock
  }
  //
  docprofile.onSnapshot(function(doc){
    if(doc && doc.exists){
      const myData = doc.data();
      outputprofilename.innerHTML = myData["name"];
      outputprofileconditions.innerHTML = "<div class='conditions'>"+myData["conditions"]["cond1"]+ "</div><div class='conditions'>" + myData["conditions"]["cond2"]+"</div>";
      // 기록과 비교, 정상 수치와의 비교분석
    }
  })
  docbodyinfo.onSnapshot(function(doc){
    if(doc && doc.exists){
      const myData = doc.data();
      outputheight.innerHTML = "Height: "+myData["height"]
      outputweight.innerHTML = "Weight: "+myData["weight"]
      // 저체중 <18.5 / 정상 18.5<= 25>= / 과체중 25~30 / 비만 30초과
      if (myData["fat"] < 18.5) {
        outputfat.innerHTML = "BMI: <span class='values normalthing'>"+myData["fat"]+"</span>kg/m<sup>2</sup> </br><span class='normalthing'>저체중입니다.</span>"
      } else if (myData["fat"] <=25) {
        outputfat.innerHTML = "BMI: <span class='values goodthing'>"+myData["fat"]+"</span>kg/m<sup>2</sup> </br><span class='goodthing'>정상 범위입니다.</span>"
      } else if (myData["fat"] <=30) {
        outputfat.innerHTML = "BMI: <span class='values normalthing'>"+myData["fat"]+"</span>kg/m<sup>2</sup> </br><span class='normalthing'>과체중입니다.</span>"
      } else {
        outputfat.innerHTML = "BMI: <span class='values badthing'>"+myData["fat"]+"</span>kg/m<sup>2</sup> </br><span class='badthing'>비만입니다.</span>"
      }
    }
  })
  docRefWalk.onSnapshot(function(doc){
    if(doc && doc.exists){
      const myData = doc.data();
      outputwalk.innerHTML = myData[fulldate]
      // console.log(fulldate+clock);
      previwalk.innerHTML = String((parseInt(myData[fulldate]) / parseInt(myData[previdate])).toFixed(2)) + " <span class='lighterfont'>times of " + previdate + "</span>"
      // 기록과 비교, 정상 수치와의 비교분석
      if (myData[fulldate]*100 / myData["aimpoint"] >=100) {
        walktargetpercent.innerHTML = "<span class='goodthing'> Congratulations!</br>"+String((parseInt(myData[fulldate])*100 / parseInt(myData["aimpoint"])).toFixed(2))+"% <span class='lighterfont'>of target points</span></span>"
      } else {
        walktargetpercent.innerHTML = "<span class='normalthing'> Let's keep going!</br>"+String((parseInt(myData[fulldate])*100 / parseInt(myData["aimpoint"])).toFixed(2))+"% <span class='lighterfont'>of target points</span></span>"
      }
      walktarget.innerHTML = "TARGET: "+String(parseInt(myData["aimpoint"]))+" points"
    }
  })
  docRefBPM.onSnapshot(function(doc){
    if(doc && doc.exists){
      const myData = doc.data();
      outputbpm.innerHTML = myData[fulldate + clock]
      // console.log(fulldate+clock);
      previbpm.innerHTML = String((parseInt(myData[fulldate + clock]) / parseInt(myData[previtime])).toFixed(2)) + " <span class='lighterfont'>times of " + previclock[0]+previclock[1]+":"+previclock[2]+previclock[3]+"</span>"
      if (myData[fulldate + clock] >= 60 && myData[fulldate+clock] <= 100) {
        bpmgetpercent.innerHTML = "<span class='goodthing'> You're in Normal Range</span>"
      } else if (myData[fulldate + clock] < 60) {
        outputbpm.innerHTML = "<span class='badthing'>"+myData[fulldate + clock]+"</span>"
        bpmgetpercent.innerHTML = "<span class='badthing'> Your Heart Rate is too low.</span>"
      } else {
        outputbpm.innerHTML = "<span class='badthing'>"+myData[fulldate + clock]+"</span>"
        bpmgetpercent.innerHTML = "<span class='badthing'> Your Heart Rate is too high.</span>"
      }
      // console.log(myData[previtime])
      // console.log(previtime)
      bpmdata = myData[fulldate + clock];
    }
  })
  docRefQuestions.onSnapshot(function(doc){
    if (doc && doc.exists) {
      const myData = doc.data();
      outputQuestions.innerHTML = "<span class='inftitle'>Q: "+myData["title"]+"</span></br><span class='lighterfont'>"+myData["body"]+"</span>";
      outputAnswer.innerHTML = "A: "+myData["answer"];
    }
  })
  docRefprevalent.onSnapshot(function(doc){
    if (doc && doc.exists) {
      const myData = doc.data();
      outputprevalentname.innerHTML = "<span class='inftitle'>"+myData[year+"_"+month]["name"]+"</span>";
      outputprevalentinfo.innerHTML = myData[year+"_"+month]["info"];
      // console.log(myData);
    }
  })

  data = {};
  docRefsymptoms.onSnapshot(function(doc){
    if (doc && doc.exists) {
      const myData = doc.data();
      var sortable = [];
      for (var symp in myData){
        sortable.push([symp,myData[symp]]);
      }
      sortable.sort(function(a,b){
        return a[1]-b[1];
      })
      // console.log(sortable[sortable.length-1]);
      topsymptoms.innerHTML = "#1: "+ sortable[sortable.length-1][0]+" - 총 "+sortable[sortable.length-1][1]+ "회</br>#2: "+ sortable[sortable.length-2][0] +" - 총 "+sortable[sortable.length-2][1]+ "회</br>#3: "+ sortable[sortable.length-3][0]+" - 총 "+sortable[sortable.length-3][1]+ "회"
    }
  })

}



function logout(){
  firebase.auth().signOut();
  // console.log("signed out");
  window.location.replace("index.html");

}

getRTupdates();
