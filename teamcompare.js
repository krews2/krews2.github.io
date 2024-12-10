

let Jsondata;
let myChart;


fetch("nbadata.json")
    .then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
    })
    .then(function (data) {
        Jsondata = data;

        document.getElementById('teamGames').addEventListener('change', changeLastGames);

        const lastN = document.getElementById('teamGames').value;



        createChart(Jsondata, lastN)


    });



const pointImage = []


const logos = ["ATL.png", "BOS.png", "BKN.png", "CHA.png", "CHI.png", "CLE.png", "DAL.png", "DEN.png", "DET.png", "GSW.png", "HOU.png", "IND.png", "LAC.png", "LAL.png", "MEM.png", "MIA.png",
    "MIL.png", "MIN.png", "NOP.png", "NYK.png", "OKC.png", "ORL.png", "PHI.png", "PHX.png", "POR.png", "SAC.png", "SAS.png", "TOR.png", "UTA.png", "WAS.png"]






for (let i = 0; i < logos.length; i++) {
    pointImage.push(new Image(75, 75))
    pointImage[i].src = "images/" + logos[i]

}


function createChart(Jsondata, lastN) {

    const ctx = document.getElementById('myChart').getContext('2d');



    


    const rtgData = Jsondata[2]


    const teamsArr = [];

    let lgPts = 0;
    let lgPoss = 0;




    for (let i = 0; i < 30; i++) {
        let rtgVal =

            rtgData[i]["TEAMS"].slice(-lastN).reduce((acc, curr) => {
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


            })
        let offRtg = (rtgVal.PTS / rtgVal.POSS) * 100
        let defRtg = (rtgVal.OPP_PTS / rtgVal.OPP_POSS) * 100
        rtgVal['x'] = offRtg
        rtgVal['y'] = defRtg

        lgPts = lgPts + rtgVal.PTS
        lgPoss = lgPoss + rtgVal.POSS

        lgAvg = (lgPts / lgPoss) * 100

        teamsArr.push(rtgVal)
    };


  


    const horizontalLinePlugin = {
        id: 'horizontalLine',
        afterDraw: (chart) => {
            const yValue = chart.scales.y.getPixelForValue(lgAvg);
            const ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(chart.chartArea.left, yValue);
            ctx.lineTo(chart.chartArea.right, yValue);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
    };

    const verticalLinePlugin = {
        afterDraw: function (chart) {
            const ctx = chart.ctx;
            const xAxis = chart.scales.x;

            // Draw vertical line at x-axis value 4
            const xValue = xAxis.getPixelForValue(lgAvg);

            ctx.save();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xValue, chart.chartArea.top,);
            ctx.lineTo(xValue, chart.chartArea.bottom);
            ctx.stroke();
            ctx.restore();
        }
    }








    const config = {
        type: 'scatter',
        data: {

            datasets: [{
                label: 'NBA Rating',
                labels: ["Label 1", "Label 2", "Label 3"],
                data: teamsArr,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
            }]

        },
        options: {

            plugins: {
                legend: {
                  display: false
                },

                tooltip: {
                    callbacks: {
                        label: (context) => {
                            
                            return `TEAM: ${context.raw.TEAM_CITY}, OFF_RTG: ${context.raw.x.toFixed(1)} and DEF_RTG: ${context.raw.y.toFixed(1)}`
                          }
                    }
                }

                
              },

            
            responsive: true,


            scales: {


                x: {
                    ticks: {
                        font: {
                            size: 15,
                        }
                    },
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Offensive Rating',
                        font: {
                            size: 20,
                        }
                    },
                },
                y: {
                    ticks: {
                        font: {
                            size: 15,
                        }
                    },
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Defensive Rating',
                        font: {
                            size: 20,
                        }
                    },

                    reverse: true

                },


            },

            elements: {
                point: {
                    pointStyle: pointImage,
                    radius: 15,
                    hoverRadius: 20,
                },
            },


        },


        plugins: {

            title: {
                display: true,
                text: '(Off Rtg,Def Rtg)',

            },
        },
        plugins: [horizontalLinePlugin, verticalLinePlugin]
    };





    myChart = new Chart(ctx, config);

}

function changeLastGames() {

    document.getElementById('teamGames').addEventListener('change', changeLastGames);

    const numGames = document.getElementById('teamGames').value;



    // teamselected.addEventListener('change',changeTeam())
    // const games=myj[0][teamselected]["GAME_INFO"]



    myChart.destroy()
    createChart(Jsondata, numGames)
}