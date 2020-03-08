document.addEventListener('DOMContentLoaded', function renderFilterListTable() {
    renderTable();
    setAddButtonListener();
});

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
                + "\">Set Timer</button ></td></tr>";
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
            //add timer dialogue box and timer functions
            renderTable();
        });
    }
}