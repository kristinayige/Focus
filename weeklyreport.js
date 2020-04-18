document.addEventListener('DOMContentLoaded', function renderFilterListTable() {
    chrome.storage.sync.get(['thisWeek','lastWeek','blockedTimes','cumuBlockTimes'],function(data){
      document.getElementById("thisWeek").innerHTML=Math.ceil(data.thisWeek/60000) ;
      document.getElementById("improvements").innerHTML=Math.ceil((data.thisWeek-data.lastWeek)/60000);
      document.getElementById("blockedTimes").innerHTML=data.blockedTimes;
      document.getElementById("cumuBlockTimes").innerHTML=data.cumuBlockTimes;

    })
});
