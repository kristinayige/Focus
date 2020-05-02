# What is Focus
Focus is a chrome extension, which serves as a website blockers that helps users develop high self-control online. Maintain a list of websites that are distracting, and hit "start working" to block these websites.

Our app is published in Chrome Store. Click [here](https://chrome.google.com/webstore/detail/focus/ncikgknhobpnnbbhnmgcgmkdlddhjfob) to check it out!

For more information about our development, please take a look at this [EECS 441 wiki page](http://soloway.pbworks.com/w/page/138225867/Focus_new)

A typical page of Focus is as the following:

# Main Fetures:
Focus has the following three main components:
## Blocklist
Users and add/delete web urls/names. If the website is in theb blocklist and users hit "start working", the web will be blocked if visited. Auto-start and auto-end feature is also supported in the upper right setting button.

## Unblock Time
If you want to unblock the website in the blocklist just for a short while for a rest, set the time and the timer will count down. If the time is up, the website will be blocked again.

## Weekly Report
In order to incent our users, we also make statistics of users' performance every week. Users are encouraged to share their achivements in social medias



# Developer Notes:
This section is for developers for Focus only.

Testing:
1. Clone this repo to your computer
2. Navigate to chrome://extensions/
3. Enable the developer mode (upper right corner)
4. Click load unpacked, and upload the cloned folder
5. After the extension is added to Chrome, right click the icon
6. Click "Show filter list"
7. Type in the full url of website, such as: https://www.youtube.com/
8. Navigate to youtube, it should be blocked 
