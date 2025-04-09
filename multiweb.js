
if(!window.classes){
    window.classes = {};
}

function onRequest(e) {
    try {

        if (e.data.type == "_mw_api_") {
            mw.request.api_response(e.data)
        };

        if (e.data.type == "_mw_api_erro_") {
            mw.request.api_response(e.data)
        };

        if (e.data.type == "_mw_cookie_") {
            mw.request.cookie_response(e.data)
        };

       if (e.data.type == "_mw_language_") {
            mw.request.language_response(e.data)
        };

        if (e.data.type == "_mw_media_") {
            mw.request.media_response(e.data)
        };

        if (e.data.type == "_mw_socket_") {
            mw.request.ws_response(e.data);
        }

        if(e.data.type == "_mw_new_update_"){
            if(window.mw){
                mw.request.ext_update();
            }
        }

        if(e.data.type == "_mw_get_data_"){
            if(window.mw){
               window.mw.request.messageToAba({ page: e.data.page, sitechannel: window.mw?.sitechannel, cookie: window.mw?.login?.cookie, api: window.mw?.api?.api});
            }
        }

        if (e.data.type == "_mw_info_") {

            if(!window.extensaoinfo){
                window.extensaoinfo = {};
            }

            window.extensaoinfo = e.data.msg;

     
            //startlib

         }
 

    } catch (e) {
        console.log(e)
    }

}

window.addEventListener('message', onRequest)