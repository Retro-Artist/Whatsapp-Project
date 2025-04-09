
async function libcss(url) {

    try {
        let dados = await fetch(`${url}`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        })

        let data = await dados.text()
        if (data) {
            var style = document.createElement('style');
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);
            style.innerHTML = `${data}`;

        } else {
            alert("Falha ao carregar")
        }
    } catch (e) {
        alert('Falha de comunicação com o servidor (css-lib)')
    }


}
async function lib(url) {
 
    try {
 
        const importCustomScript = async (path) => {
            var res = document.createElement('script');
            res.src = chrome.runtime.getURL(path);
            document.body.appendChild(res);
        };

        const importCustomCss = (id, path) => {
            var cssId = id;
            if (!document.getElementById(cssId)) {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
                link.id = cssId;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = chrome.runtime.getURL(path);
                link.media = 'all';
                head.appendChild(link);
            }
        }

        importCustomCss('bootstrap', 'assets/bootstrap.min.css')
        importCustomCss('dragulacss', 'assets/dragula.css')
        importCustomCss('animate', 'assets/animate.min.css')
        importCustomScript("assets/jquery-3.5.1.min.js");
     
        importCustomScript("assets/bootstrap.bundle.min.js");
        importCustomScript("assets/EvoCalendarProto.js");
        importCustomScript("assets/sweetAlert.js");
        importCustomScript("assets/dragula.js");
        importCustomScript("assets/dom-autoscroller.js");
        importCustomScript("assets/wpp.js");
        importCustomScript("assets/lib.bundle.js");
        importCustomScript("assets/index.bundle.js");
        importCustomScript("assets/data-click.js");
        importCustomScript("assets/event-listener.js");

   
        importCustomScript("assets/jquery-ui.min.js");


        
    } catch (e) {
        alert('Falha de comunicação com o servidor (api-lib)')
    }


}
function mwapi(apiurl, wsurl) {
    this.api = apiurl;
    let ws_api = wsurl;
    var sock = null;
    var ws;
    var ws_alive_to;
    var ws_to = null;
    var ws_guest = false;
    let channel = null;
    let username = null;

    this.websocket = {
        wsAlive: function () {
            if (sock) {
                sock.send(JSON.stringify({ ping: "Pong" }));
            }
        },
        openSocket: function (data) {
            try {

                channel = data.channel;
                username = data.username;

                if (data.username.includes("Guest")) {
                    ws_guest = true;
                }

                if (ws_to) {
                    clearTimeout(ws_to);
                }
                if (ws) {
                    sock.close();
                }

                sock = new WebSocket(ws_api + "/" + channel + "/" + username + "/");

                sock.onopen = function () {

                    ws = true;

                    ws_alive_to = setInterval(function () {
                        window.mwapi.websocket.wsAlive();
                    }, 20000);
                    window.mwapi.websocket.wsAlive();
                };

                sock.onmessage = function (evt) {
                    try {

                        var data = JSON.parse(evt.data);
                        window.mwapi.ToMultiweb('_mw_socket_', data);

                    } catch (e) {
                        console.log(e)
                    }

                }

                sock.onclose = function (e) {

                    ws = undefined;

                    if (!ws_guest) {
                        if (!e.wasClean) {
                            ws = false;
                            ws_to = setTimeout(function () {
                                window.mwapi.websocket.openSocket({ channel: channel, username: username });
                            }, 3000);
                        }
                    }


                }

                sock.onerror = function (e) {
                    // window.location.reload();
                }

            } catch (error) {
                console.log(error)
            }
        },
    };
    window.addEventListener('message', this.onMultiwebMsg);
}
mwapi.prototype.ToMultiweb = function (type, msg) {
    try {
        window.postMessage({ type: type, msg: msg }, '*');
    } catch (e) {
        console.log(e)
    }
}
mwapi.prototype.onMultiwebMsg = function (e) {
    try {
        window.mwapi.execute(e.data);
    } catch (e) {
        console.log(e)
    }
}
mwapi.prototype.fetch = async function (title, url, post, response, cookie, noauth, api) {

    try {

        var header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie,
        }

        if (noauth) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        fetch(`${api}/${url}`, {
            method: 'POST', headers: header, body: JSON.stringify(post)
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Falha');
            })
            .then(function (data) {
                window.postMessage({ type: '_mw_api_', title: title, msg: data }, '*');
            })
            .catch(function (error) {
                window.postMessage({ type: '_mw_api_erro_', title: 'post_error', msg: '' }, '*');
            });

    } catch (e) {
        console.log(e)
    }

}
mwapi.prototype.fetch_get = async function (title, url, post, response, cookie, noauth, api) {
    //console.log("fetch_get: ", title, url, post, response, cookie, noauth, api)
    try {

        var header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie,
        }

        if (noauth) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        fetch(`${api}/${url}`, {
            method: 'GET', headers: header
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Falha');
            })
            .then(function (data) {
                window.postMessage({ type: '_mw_api_', title: title, msg: data }, '*');
            })
            .catch(function (error) {
                window.postMessage({ type: '_mw_api_erro_', title: 'post_error', msg: '' }, '*');
            });


    } catch (e) {
        console.log(e)
    }

}
mwapi.prototype.execute = async function (e) {
    try {



        if (e.type == "req_cookie") {

            // language

            if (e.data.type == "setLanguage") {
                chrome.storage.local.set({ "selectedLanguage": e.data.selectedLanguage }, function () {
                });
                window.postMessage({ type: '_mw_language_', msg: e.data.selectedLanguage }, '*');
            }

            if (e.data.type == "getLanguage") { 

                let userLang = navigator.language || navigator.userLanguage;
                const supportedLanguages = {
                    "pt-BR": "pt_BR", 
                    "pt": "pt_BR",    
                    "es-ES": "es", 
                    "es": "es",    
                    "en-US": "en",    
                    "en-GB": "en",    
                    "en": "en"        
                };
                
                let selectedLanguage = supportedLanguages[userLang] || "en";
                chrome.storage.local.get(["selectedLanguage"], function (items) {
                    let lang = {selectedLanguage: selectedLanguage};
                    if (items && items['selectedLanguage']) {
                        lang = items['selectedLanguage'];
                    }
                    window.postMessage({ type: '_mw_language_', msg: lang }, '*');
                });

            }

            if (e.data.type == "get") {
                chrome.storage.local.get(["mwcookie"], function (items) {
                    let ck = null;
                    if (items && items['mwcookie']) {
                        ck = items['mwcookie'];
                    }
                    window.postMessage({ type: '_mw_cookie_', msg: ck }, '*');
                });

            }
            

            if (e.data.type == "set") {
                chrome.storage.local.set({ "mwcookie": e.data.cookie }, function () {
                });
                window.postMessage({ type: '_mw_cookie_', msg: e.data.cookie }, '*');
            }

        }


        if (e.type == "req_api") {
            window.mwapi.fetch(e.title, e.url, e.body, e.response, e.cookie, e.noauth, e.api);
        }

        if (e.type == "req_page") {
            chrome.runtime.sendMessage({ type: 'req_page', page: e.page }).then(response => { /* read response */ });
        }

        if (e.type == "req_message") {
            chrome.runtime.sendMessage({type: "req_messagetoaba", message: e.message}).then(response => { /* read response */ });
        }
       
        if (e.type == "req_api_get") {
            window.mwapi.fetch_get(e.title, e.url, e.body, e.response, e.cookie, e.noauth, e.api);
        }

        if (e.type == "req_websocket") {
            this.websocket.openSocket(e.msg);
        }

        if (e.type == "req_media") {
                let chat = e.msg.chat;
            fetch(e.msg.url)
            .then( response => response.blob() )
            .then( blob =>{
                var reader = new FileReader() ;
                reader.onload = function(){ 
                    window.postMessage({ type: '_mw_media_', chat: chat, base64: this.result }, '*');


                } ; 
                reader.readAsDataURL(blob) ;
            }) ;




         
        }

    } catch (e) {
        console.log(e)
    }

};
function addLib(url_request) { 
    fetch(url_request)
    .then(response => response.json())
        .then(async response => {

            libcss(response.theme_css);
            lib(response.whatsapp_url);
            
            var base64log = await fetchImageBase64(response.logo_url);
            window.postMessage({
                type: '_mw_info_', msg: {
                    urlLogo: base64log,
                    version: chrome.runtime.getManifest().version,
                    name: chrome.runtime.getManifest().description,
                    client: response
                }
            }, '*');
            
            window.mwapi = new mwapi(response.api_url, response.ws_url);

        })
        .catch(response => {
            alert('Atenção: Por algum motivo, a extensão não carregou corretamente. Tente atualizar a página em alguns minutos.')
        })
    return true;
}
async function fetchImageBase64(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`Erro ao buscar a imagem: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        return base64;
    } catch (error) {
        console.error('Erro ao buscar a imagem:', error);
        return null;
    }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.type === 'mw_new_update_') {
        window.postMessage({ type: '_mw_new_update_' }, '*');
    }

    if (request.type === 'mw_get_data') {
        window.postMessage({ type: '_mw_get_data_', page: request.page }, '*');
    }

    return true;
});

chrome.storage.local.get('url_request', function(result) {
    url_request = result.url_request;
    addLib(url_request);
})

