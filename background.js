chrome.runtime.onInstalled.addListener(function initialization() {
    var blockedSites = [];
    chrome.storage.sync.set({'blockedSites': blockedSites, 'isActivated':true,
    'timeLimit': 0}, function () {});
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
