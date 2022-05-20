function intersect(a, b) {
  var setA = new Set(a);
  var setB = new Set(b);
  var intersection = new Set([...setA].filter(x => setB.has(x)));
  return Array.from(intersection);
}

function extractData(data, days) {
  let db = {};
  data.forEach(elem => db[elem['date']] = elem['value']);

  let ret = [];
  days.forEach(elem => {
    ret.push(db[elem]);
  });

  return ret;
}

var dom = document.getElementById("container");
var myChart = echarts.init(dom);

Promise.all([
  fetch("data/blue.json"),
  fetch("data/official.json"),
]).then(responses => Promise.all(responses.map(r => r.json())))
  .then(jsons => {
    const [blue, official] = jsons;
    console.log(blue);
    console.log(official);

    let days = intersect(blue.map(o => o['date']), official.map(o => o['date']));
    days.sort();
    console.log(days);

    const dataBlue = extractData(blue, days);
    const dataOfficial = extractData(official, days);

    let dataLie = [];
    for (let i=0; i < days.length; ++i) {
      let num = 100 * (dataBlue[i] / dataOfficial[i] - 1);
      dataLie.push(+num.toFixed(2));
    }

    var option = {
      title: {
        text: 'How much is the Argentinian government lying about its exchange rate?',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: ['% Difference', 'Official Exchange Rate', 'Blue Dollar Rate'],
        selectedMode: false,
        top: 25,
        left: 10
      },
      toolbox: {
        top: 15,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all'
          }
        ]
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          realtime: true,
          xAxisIndex: [0, 1],
          bottom: 30,
        },
        {
          type: 'inside',
          realtime: true,
          xAxisIndex: [0, 1],
        }
      ],
      grid: [
        {
          left: 60,
          right: 50,
          height: '40%'
        },
        {
          left: 60,
          right: 50,
          top: '50%',
          height: '40%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: true },
          axisLabel: { show: false, },
          data: days
        },
        {
          gridIndex: 1,
          type: 'category',
          boundaryGap: true,
          axisLine: { show: false },
          position: 'top',
          axisLabel: { show: true, },
          data: days,
        }
      ],
      yAxis: [
        {
          name: '% Difference Between Blue / Official',
          nameLocation: 'middle',
          nameGap: 45,
          axisLabel : {
            formatter: '{value}%'
          },
          min: -5,
          type: 'value'
        },
        {
          gridIndex: 1,
          name: 'Pesos Per Dollar',
          nameLocation: 'middle',
          nameGap: 45,
          type: 'log',
        }
      ],
      series: [
        {
          name: '% Difference',
          type: 'line',
          symbol: 'none',
          data: dataLie,
          color: '#843511'
        },
        {
          name: 'Official Exchange Rate',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbol: 'none',
          data: dataOfficial,
          color: '#FCBF49'
        },
        {
          name: 'Blue Dollar Rate',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbol: 'none',
          data: dataBlue,
          color: '#75AADB'
        }
      ]
    };

    myChart.setOption(option);
    window.onresize = function() {
      myChart.resize();
    };

  });
