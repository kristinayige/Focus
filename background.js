chrome.runtime.onInstalled.addListener(function initialization() {
    var blockedSites = [];
    chrome.storage.sync.set({'blockedSites': blockedSites, 'isActivated':true}, function () {});
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
        function Reblock() {
            let r = confirm("Block again?");
            if(r==true){
              chrome.storage.sync.set({'isActivated':true},function(){
                chrome.storage.sync.get('blockedSites', function (data) {
                    data.blockedSites.forEach(function (site) {
                      chrome.tabs.query({}, function(tabs){
                        tabs.forEach((item, i) => {
                          if (item.url.includes(site)) {
                            chrome.tabs.update(item.id, { "url": "https://www.nct2018.com/#" });
                          }
                        });
                      })
                    });
                });
              });
            }else{
              setTimeout(Reblock,3000);
            }
        }
        setTimeout(Reblock,3000);
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
