document.addEventListener('DOMContentLoaded', function renderFilterListTable() {
    chrome.storage.sync.get(['thisWeek','lastWeek','blockedTimes','cumuBlockTimes'],function(data){
      document.getElementById("thisWeek").innerHTML=Math.ceil(data.thisWeek/60000) ;
      document.getElementById("improvements").innerHTML=Math.ceil((data.thisWeek-data.lastWeek)/60000);
      document.getElementById("blockedTimes").innerHTML=data.blockedTimes;
      document.getElementById("cumuBlockTimes").innerHTML=data.cumuBlockTimes;
      let str = "This week I saved "+ Math.ceil(data.thisWeek/60000) +" minutes by FOCUS!!";
      document.getElementById("twitter").href = "https://twitter.com/intent/tweet?text="+str;
      document.getElementById("linkedin").href = "https://www.linkedin.com/shareArticle?mini=true&url=focus.com&title=FOCUS!&summary="+ str+"&source=";
    })


});
