importScripts('./config.js');
var hasUpdate = false;

if (chrome.runtime.setUninstallURL) {
    let timestamp = new Date().getTime() / 1000 | 0;
    chrome.runtime.setUninstallURL(url_uninstall + '' + timestamp);
};

chrome.runtime.onInstalled.addListener(function (details) {

    console.log("update: ", details);

    chrome.storage.local.set({
        'url_request': url_request
    });
    wbxValidate();

    if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {

        chrome.tabs.query({}, (tabs) => {
            var existChat = false;

            tabs.forEach((tab) => {
                if (tab.url.includes("https://web.whatsapp.com/")) {
                    chrome.tabs.update(tab.id, { url: tab.url });
                }

                if (tab.url.includes("/update/")) {
                    let timestamp = new Date().getTime() / 1000 | 0;
                    chrome.tabs.update(tab.id, { url: tab.url + '?oninstalledreason=install&ts=' + timestamp });
                    existChat = true;
                }
            });

            if (!existChat) {
                let timestamp = new Date().getTime() / 1000 | 0;
                chrome.tabs.create({ url: url_install + '' + timestamp });
            }
        });
    }

    if (details.reason == chrome.runtime.OnInstalledReason.UPDATE) {
        chrome.tabs.query({}, (tabs) => {

            var existChat = false;

            tabs.forEach((tab) => {
                if (tab.url.includes("https://web.whatsapp.com/")) {
                    chrome.tabs.update(tab.id, { url: tab.url });
                    hasUpdate = true;
                }

                if (tab.url.includes("/update/")) {
                    let timestamp = new Date().getTime() / 1000 | 0;
                    chrome.tabs.update(tab.id, { url: tab.url + '?oninstalledreason=update&ts=' + timestamp });
                    existChat = true;
                }

            });

            if (!existChat) {
                let timestamp = new Date().getTime() / 1000 | 0;
                chrome.tabs.create({ url: url_update + '' + timestamp });
            }
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^https:\/\/web.whatsapp.com/.test(tab.url)) {

        wbxValidate(function (auth) {
            if (auth) {
                console.log('WA BACKGROUND: onUpdated');
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {


    switch (request.type) {

        case "req_page":
            chrome.tabs.query(
                { url: chrome.runtime.getURL(request.page) },
                function (tabs) {
                    if (tabs.length > 0) {
                        chrome.tabs.update(tabs[0].id, { active: true }, function (tab) {
                            chrome.tabs.reload(tab.id);
                        });
                    } else {
                        chrome.tabs.create({ url: request.page });
                    }
                }
            );
            break;

        case "req_function":
            chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, function (tabs) {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, request.action, function (response) {
                        sendResponse(response);
                    });
                }
            });

            break;

            case "req_messagetoaba":

                chrome.tabs.query({}, function(tabs) {
                for (let tab of tabs) {
                  if (tab.url.includes(request.message.page)) {
                    chrome.tabs.sendMessage(tab.id, {data: request.message})
                    break;
                  }
                }
              });


            break;
    }



});

var retries = 0;
/*
var interval = setInterval(() => {
    if (hasUpdate) {
        clearInterval(interval)
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                if (tab.url.includes("https://web.whatsapp.com/")) {
                    chrome.tabs.sendMessage(tab.id, { type: 'mw_new_update_' });
                }
            });
        });
    }

    if (retries > 5)
        clearInterval(interval)

    retries++;
}, 5000);
*/

function wbxValidate(cb) {
    chrome.storage.local.get('url_request', function (result) {
        url_request = result.url_request;
    });
}
