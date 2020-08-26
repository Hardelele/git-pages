let homeButton = document.getElementById('homePage');
let friendsBlock = document.getElementById('friends');

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {code: 'chrome.storage.sync.set({username: window.document.getElementsByClassName("user-profile-link")[0].getElementsByClassName("css-truncate-target")[0].innerHTML});'});
});

chrome.storage.sync.get(['username'], function(result) {

    fetch(`https://api.github.com/users/${result.username}/followers`)
        .then(response => response.json())
        .then(data => {
            data.forEach(follower => {
                const friendButton = document.createElement("button");
                friendButton.innerHTML = follower.login;
                friendButton.onclick = function(element) {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.executeScript(tabs[0].id, {code: `window.location.href = "${follower.html_url}";`});
                    });
                };
                friendsBlock.appendChild(friendButton);
            })
        });

    homeButton.innerText = result.username;
    homeButton.onclick = function(element) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {code: `window.location.href = "https://github.com/${result.username}";`});
        });
    };
});
