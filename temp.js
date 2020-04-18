document.addEventListener('DOMContentLoaded', function renderFilterListTable() {
    interval = ""; // global varible
    // starting = "";
    // ending = "";
    renderTable();
    setAddButtonListener();
    setUnblockListener();
    //document.getElementById('expandButton').addEventListener('click',weeklyReport);
    //initialization
    chrome.storage.sync.set({'block_mode_up':false},function(){});

    chrome.storage.sync.get(['start_time', 'end_time', 'auto_mode'],function(data){
      var start_time;
      var end_time;
      if(!data.start_time){
        /*need to change in the future*/
        document.getElementById("auto-start").defaultValue = "09:00";
        document.getElementById("auto-end").defaultValue = "17:00";
      } else {
        document.getElementById("auto-start").defaultValue = data.start_time;
        start_time = data.start_time;
        document.getElementById("auto-end").defaultValue = data.end_time;
        end_time = data.end_time;
      }

      console.log(data.auto_mode);
      
      var checkBox = document.getElementById("auto-check");
      if (checkBox.checked === false && data.auto_mode === true){
        console.log("previously it is auto!")
        document.getElementById("auto-check").checked = true;
        //document.getElementById("auto-toggle").click();
        let start_num = parseInt(start_time.split(':')[0] + start_time.split(':')[1])
        let end_num = parseInt(end_time.split(':')[0] + end_time.split(':')[1])
        autoMode(start_num, end_num);
      }
    });


    //set lock mode button
    document.getElementById('lock_mode').addEventListener("click", function () {
        console.log("wtf");
        chrome.storage.sync.get('block_mode_up',function(data){
          if(data.block_mode_up==false){
            chrome.storage.sync.set({'block_mode_up':true, 'blockTime':Date.now()},function(){});
          }
        });
    });
    document.getElementById('unlock_mode').addEventListener("click", function () {
      // alert(Date.now());
      chrome.storage.sync.get(['block_mode_up','blockTime','thisWeek','thisWeekNum'],function(data){
        if(data.block_mode_up==true){
          let  getWeek = function() {
                          var today = new Date();
                          var onejan = new Date(today.getYear(),0,1);
                          var dayOfYear = ((today - onejan + 86400000)/86400000);
                          return Math.ceil(dayOfYear/7)
                        };
          let currentWeekNum = getWeek();
          if(data.thisWeekNum ==currentWeekNum){
            // 还是这周
            // alert(Math.floor((Date.now()-data.blockTime)));
            chrome.storage.sync.set({'block_mode_up':false, 'blockTime':null,'thisWeek':data.thisWeek+Date.now()-data.blockTime},function(){});
          }else{
            // 这是新一周
            chrome.storage.sync.set({'block_mode_up':false, 'blockTime':null,'thisWeek':Date.now()-data.blockTime,'thisWeekNum':currentWeekNum, 'lastWeek':data.thisWeek,'lastWeekNum':data.lastWeekNum},function(){});
          }
        }
      })
    });
    document.getElementById('week').addEventListener("click", function () {
        chrome.tabs.update(this.tab, { "url": "/weeklyreport.html" });
    });

    document.getElementById('setting').addEventListener("click", function(){
      document.getElementById("setting-panel").classList.toggle("show");
    });

    
    
    document.getElementById('auto-toggle').addEventListener("click", function(){
      var checkBox;
      chrome.storage.sync.get('auto_mode', function(data){
        checkBox = data.auto_mode;
        console.log(checkBox);
        //checkBox = false;
        chrome.storage.sync.set({'auto_mode': !checkBox},function(){
          console.log('mode set to ' + (!checkBox).toString());
        });
        // TODO: set auto_mode at the beginning!
        var start_time = document.getElementById("auto-start").value;
        var end_time = document.getElementById("auto-end").value;
        console.log(checkBox);
        if (checkBox === false){
          console.log(start_time);
          console.log(end_time);
          chrome.storage.sync.set({'start_time': start_time, 'end_time': end_time},function(){
            console.log('set start and end time');
          });
          let start_num = parseInt(start_time.split(':')[0] + start_time.split(':')[1])
          let end_num = parseInt(end_time.split(':')[0] + end_time.split(':')[1])
          autoMode(start_num, end_num);
        } else {
          //should clear interval
          clearInterval(interval);
        }


      });
      



      
    });
    // document.getElementById('auto-check').addEventListener("click", function(){
    //   console.log("CoolAgain!");
      
    // });
    // // Close the dropdown if the user clicks outside of it
    // //TODO: 似乎没用
    // window.onclick = function(event) {
    //   if (!event.target.matches('#set-icon')) {
    //     console.log(event.target);
    //     var dropdowns = document.getElementById("setting-panel");
    //     if (dropdowns.classList.contains('show')) {
    //       dropdowns.classList.toggle('show');
    //     }
    //     // var i;
    //     // for (i = 0; i < dropdowns.length; i++) {
    //     //   var openDropdown = dropdowns[i];
    //     //   if (openDropdown.classList.contains('show')) {
    //     //     openDropdown.classList.remove('show');
    //     //   }
    //     // }
    //   }
    // }
});
function autoMode(start_time, end_time){
  //TODO: what is already in the process of counting?
  /*
  1. Assume users will reopen Focus for the next day
  */
  var today = new Date();
  let time_now = today.getHours() * 100 + today.getMinutes();
  var started = false; // started or not
  console.log(time_now)
  //interval is a globle varible
  interval = setInterval(function(){
    if(time_now > end_time || time_now < start_time){
      console.log("Not to block because not at the time");
      //trigger end
      if(started === true){
        console.log("Now end");
        started = false;
        document.getElementById('unlock_mode').click();
        clearInterval(interval);
      } else {
        console.log("will start at " + start_time.toString());
      }
    } else {
      console.log("Now Start");
      document.getElementById('lock_mode').click();
    }
  }, 1000); // check for every second

}

function setUnblockListener(){
  document.getElementById('unblockButton').addEventListener('click',function(){
    // setTimeout(function(){},100);
    chrome.storage.sync.set({'isActivated':false},function(){});
    let time = document.getElementById('Timer').value;
    let min = time.split(":")[0];
    let sec = time.split(":")[1];
    TIME_LIMIT = 60 * parseInt(min) + parseInt(sec);
    chrome.storage.sync.set({'timer':TIME_LIMIT},function(){});
    chrome.storage.sync.get('isActivated',function(data){
    if(!data.isActivated) alert("unblocked");
    });
  })
}

function setAddButtonListener() {
    document.getElementById('url').addEventListener("keypress", function (event) {
        let add = document.getElementById('add');
        add.addEventListener('click', function () {
            addToList();
        });
        if (event.keyCode == 13) {
            addToList();
        }
    });
};

function addToList() {
    let url = document.getElementById('url').value;
    chrome.storage.sync.get('blockedSites', function (data) {
        let blacklist = data.blockedSites;
        blacklist.push(url);
        chrome.storage.sync.set({'blockedSites': blacklist}, function () {
            document.getElementById('url').value = "";
            renderTable();
        });
    });
}

function renderTable() {
    chrome.storage.sync.get('blockedSites', function (data) {
        let urlId = 0;
        // let res = "";
        let res = '<ul class="w3-ul w3-card-4" style="width:120%">';
        let newList = data.blockedSites;
        newList.forEach(element => {
            // res += "<tr><td id =\"" + urlId + "\">"
            //     + element + "</td><td><button id =\"b" + urlId
            //     + "\">&times;</button ></td></tr>";
            // document.getElementById('list').innerHTML = "<table>" + res + "</table>";

            // res += "<li><tr><td id =\"" + urlId + "\">"
            //   + element +
            //   "</td><td><button id =\"b" + urlId
            //     + "\">&times;</button ></td></tr>";
            // res += "</li>";
            // urlId = urlId + 1;

            res += "<table id =\"" + urlId + "\"> <td width=\"95%\">"
              + element +
              "</td><td width=\"5%\"><button class=\"newbtn\" id =\"b" + urlId
                + "\">&times;</button ></td>";
            res += "</table>";
            urlId = urlId + 1;

        });
        res += '</ul>';
        // document.getElementById('list').innerHTML = "<table>" + res + "</table>";
        document.getElementById('list').innerHTML = '<p id=\"blockedsites\">BlockedSites :</p><div class="w3-container blockList">' + res + "</div>";
        setDelBtn();
    });
}

function setDelBtn() {
    let btns = document.getElementsByTagName("button");
    let len = btns.length;
    for (let i = 0; i < len; i++) {
        if(btns[i].id[0] != 'b'){
            console.log(btns[i].id[0]);
            continue;
        }
        let element = btns[i];
        btns[i].addEventListener("click", function () {
            let curId = btns[i].id.substring(1);
            console.log("here");
            console.log(curId);
            chrome.storage.sync.get('blockedSites', function (data) {
                let newBlackList = data.blockedSites;
                newBlackList.splice(curId, 1);
                console.log("why?")
                chrome.storage.sync.set({ 'blockedSites': newBlackList }, function () {});
                renderTable();
            });
            renderTable();
        });
    }
}

function weeklyReport(){
    chrome.storage.sync.get(['thisWeek', 'lastWeek'],function(data){
      document.getElementById("thisWeek").innerHTML=data.thisWeek;
      document.getElementById("improvements").innerHTML=data.thisWeek-data.lastWeek;});
}
