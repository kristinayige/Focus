chrome.runtime.onInstalled.addListener(function initialization() {
    var blockedSites = [];
    chrome.storage.sync.set({'blockedSites': blockedSites, 'isActivated':true, 'thisWeek':2, 'lastWeek':3}, function () {});
});

chrome.tabs.onUpdated.addListener(function blockAction(tabId, info, tab) {
  chrome.storage.sync.get(['blockedSites', 'isActivated'], function (data) {
    if(data.isActivated==true){
      data.blockedSites.forEach(function (site) {
        if (tab.url.includes(site)) {
          chrome.tabs.update(tab.id, { "url": "https://www.nct2018.com/#" });
        }
      });
    }
  });
});
chrome.storage.onChanged.addListener(function(changes) {
    for(let key in changes){
      if(key === 'isActivated' &&changes['isActivated'].newValue == false &&changes['isActivated'].oldValue == true ){
        chrome.storage.sync.get('timer',function(data){
          function Reblock() {
              let r = confirm("Block Again?");
              if(r==true){
                chrome.storage.sync.set({'isActivated':true},function(){
                  chrome.storage.sync.get('blockedSites', function (data) {
                      data.blockedSites.forEach(function (site) {
                        chrome.tabs.query({}, function(tabs){
                          tabs.forEach((item, i) => {
                            if (item.url.includes(site)) {
                              chrome.tabs.update(item.id, { "url": "/blocked.html" });
                            }
                          });
                        })
                      });
                  });
                });
                alert("Blocked Again!");
              }else{
                setTimeout(Reblock,data.timer*1000);
              }
          }
          setTimeout(Reblock,data.timer*1000);
        });
        break;
      }
    }
});

chrome.contextMenus.create({
  id: "baFilterListMenu",
  title: "Show filter list",
  contexts: ["browser_action"]
});

chrome.contextMenus.onClicked.addListener(function contextMenuHandler(info, tab) {
  switch (info.menuItemId) {
    case "baFilterListMenu":
      chrome.tabs.create({ url: '/list.html' });
      break;
  }
});
