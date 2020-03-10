document.addEventListener('DOMContentLoaded', function renderFilterListTable() {
    renderTable();
    setAddButtonListener();
    setUnblockListener();
    document.getElementById('expandButton').addEventListener('click',weeklyReport);
    //initialization
    chrome.storage.sync.set({'block_mode_up':false},function(){});
    //set lock mode button
    document.getElementById('lock_mode').addEventListener("click", function () {
        chrome.storage.sync.set({'block_mode_up':true},function(){});
    });
    document.getElementById('unlock_mode').addEventListener("click", function () {
        chrome.storage.sync.set({'block_mode_up':false},function(){});
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
        let res = "";
        let newList = data.blockedSites;
        newList.forEach(element => {
            res += "<tr><td id =\"" + urlId + "\">"
                + element + "</td><td><button id =\"b" + urlId
                + "\">&times;</button ></td></tr>";
            document.getElementById('list').innerHTML = "<table>" + res + "</table>";
            urlId = urlId + 1;
        });
        document.getElementById('list').innerHTML = "<table>" + res + "</table>";
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
  if(document.getElementById('expandButton').innerHTML =='See Weekly Report'){
    //alert(document.getElementById("weekreport").style.display);
    document.getElementById('expandButton').innerHTML ='Hide Weekly Report';
    chrome.storage.sync.get(['thisWeek', 'lastWeek'],function(data){
      document.getElementById("thisWeek").innerHTML=data.thisWeek;
      document.getElementById("improvements").innerHTML=data.thisWeek-data.lastWeek;
      let x = document.getElementById("weekreport");
      
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    });
  }else{
    document.getElementById('expandButton').innerHTML ='See Weekly Report';
    let x = document.getElementById("weekreport");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

}
