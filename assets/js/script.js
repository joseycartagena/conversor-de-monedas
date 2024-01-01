const api_url = 'https://165.227.94.139/api/';

async function getCoins(url) {
    try {
        const monedas = await fetch (url)
        const { dolar, ivp, euro, uf, utm } = await monedas.json();
        return [dolar, ivp, euro, uf, utm];
    } catch(error) {
        console.log()
    }
}  

async function renderCoins(url) {
    const select_container = document.getElementById('select_coin');
   const coins = await getCoins(url);

   coins.forEach((coin_info) => {
    const option = document.createElement('option');
    option.value = coin_info.codigo;
    option.innerText = coin_info.nombre;

    select_container.appendChild(option)
   })
} 

async function getCoinDetails(url, coinID)  {
    const coin = await fetch(`${url}${coinID}`); 
    const { serie } = await coin.json();
    const [{value: coinValue, fecha: coinFecha}] = serie; 

    return coinValue;
}



async function getAndCreateDataToChart(url, coinID) {
    const coin = await fetch(`${url}${coinID}`); 
    const { serie } = await coin.json();
    const labels = serie.map((data) => {
    return data.Fecha;
    });
    const data = serie.map((valor) => {
    return valor;
    });
    const datasets = [
    {
    label: "Precios últimos días",
    borderColor: "rgb(255, 99, 132)",
    data,
    }
    ];
    return { labels, datasets };
    }
    
    async function renderGrafica() {

        const option_select = document.getElementById('select_coin').value;


    const data = await getAndCreateDataToChart(api_url, option_select);
    const config = {
    type: "line",
    data,
    };
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    new Chart(myChart, config);
    }


document.getElementById('search').addEventListener('click', async (event) => {
    const option_select = document.getElementById('select_coin').value;

   const coinValue =  await getCoinDetails(api_url, option_select)

   const convertion = (valorInput / coinValue).toFixed(2);

   await renderGrafica()

});

//document.getElementById('select_coin').addEventListener('change', function (e) {

//});
renderCoins(api_url);
//getCoins(api_url)