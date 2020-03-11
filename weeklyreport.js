document.addEventListener('DOMContentLoaded', function renderFilterListTable() {
    chrome.storage.sync.get(['thisWeek','lastWeek'],function(data){
      document.getElementById("thisWeek").innerHTML=data.thisWeek;
      document.getElementById("improvements").innerHTML=data.thisWeek-data.lastWeek;
    });
});
