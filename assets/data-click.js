function DOMStart(state) {
    if (state == null) {
        state = "Unknown";
    }
};

function JQueryStart(state) {

    if (state == null) {
        state = "Unknown";
    }

    if (window.jQuery) {
        $(document).ready(async function () {

            $(document).on("click", "[data-click]", function () {
 
                var action = $(this).attr("data-click");
                if(!window.globalexec){
                    window.globalexec = {}
                }
                
                window.globalexec = (texto) => {

                   // console.log("Texto: ", texto)

                    var original = texto;

                    texto = texto.replace(/;/g, ''); 
                    texto = texto.trim()
            
                    let regex = /^(.*)\((.*)\)$/;
                    let matches = texto.match(regex);
                    let path, argsString;
                    if (matches) {
                        path = matches[1];
                        argsString = matches[2];
                    } else {
                        console.log("Falha: ", original)
                        console.error('Formato inválido');
                        return;
                    }

                    let args = [];
                
                    if (argsString) {
                       
                        try {
                            if (argsString.trim().startsWith('{') && argsString.trim().endsWith('}')) {
                                args.push(JSON.parse(argsString.replace(/'/g, '')));
                            } else {
                                argsString = argsString.replace(/'/g, '')
                                args = argsString.split(',').map(arg => {
                                    arg = arg.trim();
                                    let parsedArg = arg;
                                    return isNaN(parsedArg) ? arg : parsedArg;
                                });
                            }
                        } catch (error) {
                            console.log("Falha: ", original)
                            console.error('Erro ao processar os argumentos:', error);
                            return;
                        }
                    }
                
        
                    let partes = path.split('.').slice(1); 
                    let fn = partes.reduce((acc, parte) => acc[parte], window);
                
                    if (typeof fn === 'function') {
                        fn.apply(null, args);
                    } else {
                        console.log("Falha: ", original)
                        console.error('O caminho fornecido não leva a uma função');
                    }
                };

                window.globalexec(action)

            });

        });
    } else {
        setTimeout(function () {
            JQueryStart("Tentando novamente");
        }, 1000)
    }
};

if (document.readyState) {
    if (document.readyState === "complete" || document.readyState === "loaded") {
        JQueryStart("Document fully loaded (early)");
    } else {

        if (window.addEventListener) {
            window.addEventListener('load', function () {
                JQueryStart("Window fully loaded (2)");
            }, false);
            window.addEventListener('DOMContentLoaded', function () {
                DOMStart("DOM complete (early)");
            }, false);

        } else {
            var isDone = false;
            document.onreadystatechange = function () {
                if (document.readyState === "complete" || document.readyState === "loaded") {
                    if (!isDone) {
                        isDone = true;
                        JQueryStart("Document fully loaded");
                    }
                } else if (document.readyState === "interactive") {
                    DOMStart("Document interactive (early)");
                }
            };
        }
    }
} else {
    window.onload = function () {
        JQueryStart("Window fully loaded (1)");
    };
};

