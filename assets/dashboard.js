import languagesdashboard from "./languageDashboard.js";

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

class dashboard {

    constructor(data) {

        this.graphAtm = null;
        this.graphCrm = null;
        this.sitechannel = data?.sitechannel;
        this.api = data?.api;
        this.cookie = data?.cookie

        if(this.api){
            libcss(this.api + "/lib/source/?file=content_css.txt");
        }

    }

    async open(mes, ano) {

        var url = '';

        if (mes) {
            url = this.api + '/channel/metrics/' + this.sitechannel + '/?month=' + mes + '&year='+ano;
        } else {
            url = this.api + '/channel/metrics/' + this.sitechannel + '/';
        }

        fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.cookie}`,
              'Content-Type': 'application/json'
            }
          })
        .then(response => response.json())
            .then(async response => {

                window.dashboard.graph(response.data)

            })
            .catch(response => {
                alert('Atenção: Por algum motivo, não conseguimos carregar o dashboard.')
            })


    }

    graphCreateAtm (data) {
        if (this.graphAtm instanceof Chart) {
            this.graphAtm.destroy();
        }
        var ctx = document.getElementById("chart-bars-atm").getContext("2d");

        document.querySelector('.count_atm_atendimentos').innerHTML = data.atm_atendimentos
        document.querySelector('.count_atm_finalizados').innerHTML = data.atm_finalizados;
        document.querySelector('.count_atm_emaberto').innerHTML = data.atm_emaberto;
        if (data.atm_tempomedio != "NaN:NaN:NaN") {
            document.querySelector('.count_atm_tempomedio').innerHTML = data.atm_tempomedio;
        }

        this.graphAtm = new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.atm_users.map((e => e.username)),
                datasets: [{
                    tension: 0.4,
                    label: "Atendimentos",
                    borderWidth: 0,
                    borderRadius: 4,
                    borderSkipped: false,
                    backgroundColor: "#1bc465",
                    data: data.atm_users.map((e => e.atm_atendimentos)),
                },
                {
                    label: "Finalizados",
                    tension: 0.4,
                    borderWidth: 0,
                    borderRadius: 4,
                    borderSkipped: false,
                    backgroundColor: "#2177ff",
                    data: data.atm_users.map((e => e.atm_finalizados)),
                },],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: "#fff"
                        }
                    },
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                        },
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false
                        },
                        ticks: {
                            display: true,
                            font: {
                                size: 12,
                                style: 'normal',
                                lineHeight: 2
                            },
                            color: "#fff"
                        },

                    },
                },
            },
        });

        setTimeout(function () {
            document.getElementById("chart-bars-atm").style.height = "190px"
        }, 50)
    }
    graphCreateCrm (data) {
        if (this.graphCrm instanceof Chart) {
            this.graphCrm.destroy();
        }
        var ctx = document.getElementById("chart-bars-crm").getContext("2d");

        document.querySelector('.count_crm_negociosiniciados').innerHTML = data.crm_negocios_iniciados
        document.querySelector('.count_crm_ganhosqtd').innerHTML = data.crm_ganhos_qtd + ' <span class="text-success font-weight-bold count_crm_ganhosvlr" style="font-size: 1rem;">(' + data.crm_ganhos_vlr + ')</span>';
        document.querySelector('.count_crm_percasqtd').innerHTML = data.crm_percas_qtd;
        if (data.crm_tempomedio != "NaN:NaN:NaN") {
            document.querySelector('.count_crm_tempomedio').innerHTML = data.crm_tempomedio;
        }


       this.graphCrm = new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.crm_users.map((e => e.username)),
                datasets: [{
                    tension: 0.4,
                    label: "Negócios iniciados",
                    borderWidth: 0,
                    borderRadius: 4,
                    borderSkipped: false,
                    backgroundColor: "#f87037",
                    data: data.crm_users.map((e => e.crm_negocios_iniciados)),
                },
                {
                    label: "Ganhos",
                    tension: 0.4,
                    borderWidth: 0,
                    borderRadius: 4,
                    borderSkipped: false,
                    backgroundColor: "#1bc465",
                    data: data.crm_users.map((e => e.crm_ganhos_qtd)),
                },
                {
                    label: "Percas",
                    tension: 0.4,
                    borderWidth: 0,
                    borderRadius: 4,
                    borderSkipped: false,
                    backgroundColor: "#2177ff",
                    data: data.crm_users.map((e => e.crm_percas_qtd)),
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: "#fff"
                        }
                    },
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                        },
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false
                        },
                        ticks: {
                            display: true,
                            font: {
                                size: 12,
                                style: 'normal',
                                lineHeight: 2
                            },
                            color: "#fff"
                        },

                    },
                },
            },
        });

        setTimeout(function () {
            document.getElementById("chart-bars-crm").style.height = "190px"
        }, 50)

    }
    movimentacoesCreate (data) {

        try{
        function convertSecondstoTime(given_seconds) {
                    var given_seconds = given_seconds / 1000
                    var dateObj = new Date(given_seconds * 1000);
                    var hours = dateObj.getUTCHours();
                    var minutes = dateObj.getUTCMinutes();
                    var  seconds = dateObj.getSeconds();

                    var timeString = hours.toString().padStart(2, '0')
                        + ':' + minutes.toString().padStart(2, '0')
                        + ':' + seconds.toString().padStart(2, '0');

                    return timeString;
                }


        $("#dashboard-movimentacoes-atm").html('');
        $("#dashboard-movimentacoes-crm").html('');
        $(".count_atmf").text(data.atm_records ? data.atm_records.length : 0)
        $(".count_crmf").text(data.crm_records ? data.crm_records.length : 0)

        if(data.atm_records.length){

            var div_atm = ``;
            for(let rx in data.atm_records){
                if(data.atm_records[rx].chat){
                    div_atm+= `<li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">${data.atm_records[rx].chat.split("@")[0]} </div>
                      <p class="small mb-0"> Tempo: ${convertSecondstoTime(data.atm_records[rx].time)}</p>
                    </div>
                    <span class="badge bg-secondary rounded-pill">${data.atm_records[rx].username}</span>
                  </li>`;
                }
            }
            $("#dashboard-movimentacoes-atm").html(div_atm)

        }else{
         $("#dashboard-movimentacoes-atm").html('<li class="list-group-item"><span class="text-danger">Nenhum atendimento finalizado</span></li>')
        }

        if(data.crm_records.length){

            var div_crm = ``;
            for(let rx in data.crm_records){
                if(data.crm_records[rx].chat){
                    div_crm+= `<li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">${data.crm_records[rx].chat.split("@")[0]} </div>
                      <p class="small mb-0"> Tempo: ${convertSecondstoTime(data.crm_records[rx].time)}</p>
                      <p class="small mb-0"> ${data.crm_records[rx].type == "ganho" ? `<span style="color:blue">Ganhou: R$${data.crm_records[rx].valor}</span>` : `<span style="font-style: italic;">Não obteve ganho</span>`}</p>


                    </div>
                    ${data.crm_records[rx].username ? ` <span class="badge bg-secondary rounded-pill">${data.crm_records[rx].username}</span>` : ``}

                  </li>`;
                }
            }
            $("#dashboard-movimentacoes-crm").html(div_crm)

        }else{
         $("#dashboard-movimentacoes-crm").html('<li class="list-group-item"><span class="text-danger">Nenhum negócio encerrado</span></li>')
        }
        }catch(e){
            console.log(e)
        }


    }
    async graph(data) {

        try{
        (function (d) {
            var mL = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            d.prototype.getLongMonth = d.getLongMonth = function getLongMonth(inMonth) {
                return gM.call(this, inMonth, mL);
            }

            function gM(inMonth, arr) {
                var m;

                if (this instanceof d) {
                    m = this.getMonth();
                }
                else if (typeof inMonth !== 'undefined') {
                    m = parseInt(inMonth, 10) - 1;
                }

                return arr[m];
            }
        })(Date);

        this.graphCreateAtm(data)
        this.graphCreateCrm(data)
        this.movimentacoesCreate(data)

        let date = new Date();
        let mesAtual = date.getMonth() + 1;
        let anoAtual = date.getFullYear();


        let listaMeses = ``;
        for (let rx in data.anteriores) {
            if(data.anteriores[rx].month){
                listaMeses += `<li><a class="dropdown-item data-click" role="button" data-year="${data.anteriores[rx].year}" data-month="${data.anteriores[rx].month}">${data.anteriores[rx].title}/${data.anteriores[rx].year}</a></li>`
            }
        }

        document.getElementById('changeMetricis').innerHTML = `<button class="dropdown-toggle btn border" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border-color: #000 !important;">${data.month == mesAtual &&  data.year == anoAtual ? ''+ Date.getLongMonth(mesAtual) + '/' + anoAtual+'' : ''+ Date.getLongMonth(data.month) + '/' + data.year+''}}</button>
        <ul class="dropdown-menu" style="">
        ${listaMeses}
        </ul>`;

        document.querySelectorAll('.data-click').forEach((e) => {
            e.addEventListener('click', (ev) => {
                this.open(ev.target.dataset.month, ev.target.dataset.year)
            })
        })

        }catch(e){
            console.log(e)
        }
    }

}

if(!window.dashboard){
    window.dashboard = {};
}

chrome.runtime.sendMessage({type: "req_function", action: {type: "mw_get_data", page: "dashboard.html"}}).then(response => { return true });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    window.dashboard = new dashboard(request.data);
    if(window.dashboard.sitechannel){
        window.dashboard.open()
    }

  });

  function getQueryParam() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const params = urlParams.get("linguage");
      console.log('params:', languagesdashboard[params]);

      if (params && languagesdashboard[params]) {
        document.querySelectorAll("#pills-tab > li > button > span")[0].innerText = languagesdashboard[params].dashboard_atendimentos
        document.querySelectorAll("#pills-tab > li > button > span")[1].innerText = languagesdashboard[params].dashboard_crm
        document.querySelectorAll("#pills-tab > li > button > span")[2].innerText = languagesdashboard[params].dashboard_Movimentacao
        document.querySelectorAll(".card-body > div > span")[0].innerText = languagesdashboard[params].dashboard_titulo
        document.querySelector("#atendimento").innerText = languagesdashboard[params].dashboard_atendimentos
        document.querySelector("#finalizado").innerText = languagesdashboard[params].dashboard_finalizados
        document.querySelector("#aberto").innerText = languagesdashboard[params].dashboard_abertos
        document.querySelector("#tempo").innerText = languagesdashboard[params].dashboard_tempomedio
        document.querySelector("#negocios").innerText = languagesdashboard[params].dashboard_nenhum_atendimento
        document.querySelector("#ganhos").innerText = languagesdashboard[params].dashboard_ganhos
        document.querySelector("#pedidos").innerText = languagesdashboard[params].dashboard_perdidos
        document.querySelector("#duracao").innerText = languagesdashboard[params].dashboard_duracao_media
        document.querySelector("#atendimetos-finalizados").innerText = languagesdashboard[params].dashboard_atendimentos_finalizados
        document.querySelector("#transferir-atendimento").innerText = languagesdashboard[params].dashboard_transferir_tendimentos
        document.querySelector("#card-encerrado").innerText = languagesdashboard[params].dashboard_card_encerrado
        document.querySelector("#transferir-atendimento_2").innerText = languagesdashboard[params].dashboard_transferir_tendimentos

      } else {
        console.log('Idioma não encontrado ou não definido corretamente.');
      }

    } catch (e) {
      console.log('Erro ao obter o parâmetro de linguagem:', e);
    }
  }
  getQueryParam();
