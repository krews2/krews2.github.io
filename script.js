// Wait for the DOM content to be fully loaded

let Jsondata;
let myCharting;
let myCharting2;



constTeamInd = {
  "Atlanta": 0, "Boston": 1, "Brooklyn": 2, "Charlotte": 3, "Chicago": 4, "Cleveland": 5, "Dallas": 6, "Denver": 7, "Detroit": 8, "Golden State": 9,
  "Houston": 10, "Indiana": 11, "LA": 12, "Los Angeles": 13, "Memphis": 14, "Miami": 15, "Milwaukee": 16, "Minnesota": 17, "New Orleans": 18, "New York": 19,
  "Oklahoma City": 20, "Orlando": 21, "Philadelphia": 22, "Phoenix": 23, "Portland": 24, "Sacramento": 25, "San Antonio": 26, "Toronto": 27, "Utah": 28, "Washington": 29
}


fetch("nbadata.json")
  .then(function (response) {
    if (response.status == 200) {
      return response.json();
    }
  })
  .then(function (data) {
    Jsondata = data;


    document.getElementById('teamsel').addEventListener('change', changeTeam);

    

    const teamselected = document.getElementById('teamsel').value;

   

    

    






    createChart(Jsondata, teamselected,5)

  });




// Initialize Line Chart
function createChart(Jsondata, selectTeam,gameSeg) {

  const offPtag = document.getElementById("off-rtg");
  offPtag.innerHTML = Jsondata[3][selectTeam]["OFF_RANKING"]


  const defPtag = document.getElementById("def-rtg");
  defPtag.innerHTML = Jsondata[3][selectTeam]["DEF_RANKING"]

  const netPtag = document.getElementById("net-rtg");
  netPtag.innerHTML = Jsondata[3][selectTeam]["NET_RANKING"]

  
  

  const ctx = document.getElementById('lineChart').getContext('2d');

  const lgavg = Jsondata[0]
  const games = Jsondata[1][selectTeam]["GAME_INFO"]


  const totalDuration = 4000;
  const delayBetweenPoints = totalDuration / games.length;
  const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

  let teamLogo = Jsondata[1][selectTeam]["TEAM_ABBREVIATION"]
  let teamimage = document.querySelector(".teamimage");

  teamimage.setAttribute('src', 'images/' + teamLogo + ".png");

 

  const animation = {
    x: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: NaN, // the point is initially skipped
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      }
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: previousY,
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      }
    }
  };



  const config = {


    type: 'line',
    data: {
      labels: games.map(row => row.GAME_NO),
      datasets: [{
        label: 'Offensive Rating',
        label_abb: 'OFF_RTG',
        borderColor: "blue",
        borderWidth: 1,
        pointBorderColor: 'blue',
        pointBorderWidth: 5,
        radius: 2,
        data: games.map(row => row.STD_OFF_RATING),
        datanet: games.map(row => row.STD_NET_RATING)
      },
      {
        label: 'Defensive Rating',
        label_abb: 'DEF_RTG',
        borderColor: "red",
        borderWidth: 1,
        pointBorderColor: 'red',
        pointBorderWidth: 5,
        radius: 2,
        data: games.map(row => row.STD_DEF_RATING),
        datanet: games.map(row => row.STD_NET_RATING)
      },
      {
        label: 'League Average Rating',
        label_abb: 'LG_AVG_RTG',
        borderColor: "black",
        borderWidth: 1,
        pointBorderColor: 'black',
        pointBorderWidth: 5,
        radius: 2,
        data: lgavg.map(row => row.RTG),
        datanet: games.map(row => row.STD_NET_RATING)

      }
      ],
    },
    options: {


      animation,

      interaction: {
        intersect: false
      },
      // elements: {point: {
      //                     pointStyle: [pointImage]
      //                 }},
      plugins: {
        legend: {

          display: false, // Enable legend

          position: 'right', // Position at the bottom,
          labels: {
            // This more specific font property overrides the global property
            font: {
              size: 14
            }
          }

        },


        tooltip: {

          titleFont: {
            size: 18


          },

          bodyFont: {
            size: 18

          },

          callbacks: {
            title: () => '',
            label: (context) => {





              netIndex = Number(context.label) - 1


              // return `GAME NUM: ${context.label}, ${context.dataset.label_abb}: ${context.parsed.y.toFixed(1)}`
              return ["GAME NUM: " + context.label,
              context.dataset.label_abb + ": " + context.parsed.y.toFixed(1),
              "NET_RTG: " + context.dataset.datanet[netIndex].toFixed(1)
              ]


            },



          }
        },



      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          title: {

            display: true,
            text: 'Game Number',
            font: {

            }

          },


        },

        y: {
          type: 'linear',
          min: 85,
          max: 130
        }
      }
    }
  }



  myCharting = new Chart(ctx, config);


  let chunkSize = gameSeg;

  // Initialize the output array


  const ctx2 = document.getElementById('lineChart2').getContext('2d');





  let chunks = [];

  let teamInd = constTeamInd[selectTeam]
    

  const teamSelLine2 = Jsondata[2][teamInd]["TEAMS"]
  

  // Loop to split array into chunks
  for (let i = 0; i < teamSelLine2.length; i += chunkSize) {


    let chunk = [];


    // Iterate for the size of chunk
    for (let j = i; j < i + chunkSize && j < teamSelLine2.length; j++) {
      chunk.push(teamSelLine2[j]);


    }



    // push the chunk to output array
    chunks.push(chunk);












  }

 


  const teamsArr = [];

  // Display Output

  let lgPts = 0;
  let lgPoss = 0;

  chunksLength = chunks.length

  for (let ci = 0; ci < chunksLength; ci++) {
    let rtgVal =


      chunks[ci].reduce((acc, curr) => {
        return {
          TEAM_CITY: curr.TEAM_CITY,
          PTS: acc.PTS + curr.PTS,
          POSS: acc.POSS + curr.POSS,
          OPP_PTS: acc.OPP_PTS + curr.OPP_PTS,
          OPP_POSS: acc.OPP_POSS + curr.OPP_POSS,

        };
      }, {
        TEAM_CITY: "",
        PTS: 0,
        POSS: 0,
        OPP_PTS: 0,
        OPP_POSS: 0,


      }, [])

    let offRtg = (rtgVal.PTS / rtgVal.POSS) * 100
    let defRtg = (rtgVal.OPP_PTS / rtgVal.OPP_POSS) * 100
    rtgVal['SEG_OFF_RTG'] = offRtg
    rtgVal['SEG_DEF_RTG'] = defRtg

    lgPts = lgPts + rtgVal.PTS
    lgPoss = lgPoss + rtgVal.POSS

    lgAvg = (lgPts / lgPoss) * 100

    chunkArrNum = []
    for (let cl = 0; cl < chunks[ci].length; cl++) {

      chunkArrNum.push(chunks[ci][cl]['GAME_NO'])


    }







    rtgVal['GAME_SEGMENT'] = `Game No: ${Math.min(...chunkArrNum)}-${Math.max(...chunkArrNum)}`


    teamsArr.push(rtgVal)









  };

  


  const config2 = {


    type: 'line',
    data: {
      labels: teamsArr.map(row => row.GAME_SEGMENT),
      datasets: [{
        label: 'Offensive Rating',
        label_abb: 'OFF_RTG',
        borderColor: "blue",
        borderWidth: 1,
        pointBorderColor: 'blue',
        pointBorderWidth: 5,
        radius: 2,
        data: teamsArr.map(row => row.SEG_OFF_RTG),
        datanet: teamsArr.map(row => row.SEG_OFF_RTG)
      },
      {
        label: 'Defensive Rating',
        label_abb: 'DEF_RTG',
        borderColor: "red",
        borderWidth: 1,
        pointBorderColor: 'red',
        pointBorderWidth: 5,
        radius: 2,
        data: teamsArr.map(row => row.SEG_DEF_RTG),
        datanet: teamsArr.map(row => row.SEG_DEF_RTG)
      },
        // {
        //   label: 'League Average Rating',
        //   label_abb: 'LG_AVG_RTG',
        //   borderColor: "black",
        //   borderWidth: 1,
        //   pointBorderColor: 'black',
        //   pointBorderWidth: 5,
        //   radius: 2,
        //   data: lgavg.map(row => row.RTG),
        //   datanet: games.map(row => row.STD_NET_RATING)

        // }
      ],
    },
    options: {


      animation,

      interaction: {
        intersect: false
      },
      // elements: {point: {
      //                     pointStyle: [pointImage]
      //                 }},
      plugins: {
        legend: {

          display: false, // Enable legend

          position: 'right', // Position at the bottom,
          labels: {
            // This more specific font property overrides the global property
            font: {
              size: 14
            }
          }

        },


        tooltip: {

          titleFont: {
            size: 18


          },

          bodyFont: {
            size: 18

          },

          // callbacks: {
          //   title: () => '',
          // label: (context) => {





          //   netIndex = Number(context.label) - 1



          //   return ["GAME NUM: " + context.label,
          //   context.dataset.label_abb + ": " + context.parsed.y.toFixed(1),
          //   "NET_RTG: " + context.dataset.datanet[netIndex].toFixed(1)
          //   ]


          // },



          // }
        },



      },
      scales: {


        y: {
          type: 'linear',
          min: 85,
          max: 130
        }
      }
    }
  };



  myCharting2 = new Chart(ctx2, config2);



};




function changeTeam() {

  document.getElementById('teamsel').addEventListener('change', changeTeam);



 
 

  const teamselected = document.getElementById('teamsel').value;



 gameSeg=5



  

  myCharting.destroy()
  myCharting2.destroy()
  createChart(Jsondata, teamselected,gameSeg)

  return teamselected
}


function changeSegment(gameSeg) {



  document.getElementById('teamsel').addEventListener('change', changeTeam);
 

  const teamselected = document.getElementById('teamsel').value;

  

  
 


 



  myCharting.destroy()
  myCharting2.destroy()
  createChart(Jsondata, teamselected,gameSeg)
}