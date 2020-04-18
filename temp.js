document.addEventListener('DOMContentLoaded', function renderFilterListTable() {
    renderTable();
    setAddButtonListener();
    setUnblockListener();
    //document.getElementById('expandButton').addEventListener('click',weeklyReport);
    //initialization
    chrome.storage.sync.set({'block_mode_up':false},function(){});
    //set lock mode button
    document.getElementById('lock_mode').addEventListener("click", function () {
        chrome.storage.sync.get('block_mode_up',function(data){
          if(data.block_mode_up==false){
            chrome.storage.sync.set({'block_mode_up':true, 'blockTime':Date.now()},function(){});
          }
        })
    });

    document.getElementById('notification').addEventListener("click", function () {
      chrome.storage.sync.get('noti',function(data){
        chrome.storage.sync.set({'noti':true});
      })
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
});

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
        if (!blacklist.includes(url)){
          blacklist.push(url);
          chrome.storage.sync.set({'blockedSites': blacklist}, function () {
              document.getElementById('url').value = "";
              renderTable();
          });
        }
        else{
          alert("Oops! You have already added this url.");
          return;
        }
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
