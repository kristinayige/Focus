document.addEventListener('DOMContentLoaded', function renderFilterListTable() {
    renderTable();
    setAddButtonListener();
});

function setAddButtonListener() {
    document.getElementById('url').addEventListener("keypress", function (event) {
        let add = document.getElementById('add');
        add.addEventListener('click', function () {
            addToList();
            renderTable();
        });
        if (event.keyCode == 13) {
            addToList();
            renderTable();
        }
    });
};

function addToList() {
    let url = document.getElementById('url').value;
    chrome.storage.sync.get('blockedSites', function (data) {
        let blacklist = data.blockedSites;
        blacklist.push(url);
        chrome.storage.sync.set({ 'blockedSites': blacklist }, function () {
            document.getElementById('url').value = "";
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
        let element = btns[i];
        btns[i].addEventListener("click", function () {
            let curId = btns[i].id.substring(1);
            console.log("here");
            console.log(curId);
            chrome.storage.sync.get('blockedSites', function (data) {
                let newBlackList = data.blockedSites;
                newBlackList.splice(curId, 1);
                chrome.storage.sync.set({ 'blockedSites': newBlackList }, function () {});
            });
            renderTable();
        });
    }
}

// chrome.storage.sync.get('blockedSites', function (data) {
//     blockedSites = data.blockedSites;
// });

// chrome.webRequest.onBeforeRequest.addListener(
//     page => {
//         console.log('page blocked - ' + page.url);

//         return {
//           cancel: true,
//         };
//       }, {urls: ["http://www.youtube.com"]}, ["blocking"]);

// function requestChecker(request) {
//     console.log("onBeforeRequest");
//     if (request && request.url) {
//       if (request.type == "main_frame") {
//         var tabBlockingState = 0;
//         for (var i = 0; i < blockedSites.length; ++i) {
//           if (request.url.match(new RegExp(
//               ".*" + blockedSites[i] + ".*", "i"))) {
//             tabBlockingState = blockedSites[i];
//           }
//         }
//         if (tabBlockingState != 0) {
//           var redirectUrl = chrome.extension.getURL(
//               "blockedSite.html?blocked=" + tabBlockingState);
//           return { redirectUrl: redirectUrl };
//         }
//       }
//     }
//   }