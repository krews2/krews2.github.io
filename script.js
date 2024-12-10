
let Jsondata;
let myChart;

fetch("nbadata.json")
.then(function(response){
   if(response.status == 200){
      return response.json();
   }
})
.then(function(data){ 
   Jsondata = data; 

   document.getElementById('teamsel').addEventListener('change', changeTeam);

   const teamselected = document.getElementById('teamsel').value;

   
  createChart(Jsondata,teamselected)
   
});	








// </block:data>

// <block:animation:1>


function createChart(Jsondata,selectTeam) {

const lgavg=Jsondata[0]
const games=Jsondata[1][selectTeam]["GAME_INFO"]


const totalDuration = 4000;
const delayBetweenPoints = totalDuration / games.length;
const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
let teamLogo = Jsondata[1][selectTeam]["TEAM_ABBREVIATION"]
let teamimage = document.querySelector(".teamimage");

teamimage.setAttribute('src','images/'+ teamLogo + ".png");
  
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



  const config ={


    type: 'line',
    data:{
    labels: games.map(row => row.GAME_NO),
    datasets: [{
      label: 'Offensive Rating',
      borderColor:"blue",
      borderWidth: 1,
      pointBorderColor: 'blue',
      pointBorderWidth: 5,
      radius: 2,
      data: games.map(row => row.STD_OFF_RATING),
    },
    {
      label: 'Defensive Rating',
      borderColor:"red",
      borderWidth: 1,
      pointBorderColor: 'red',
      pointBorderWidth: 5,
      radius: 2,
      data: games.map(row => row.STD_DEF_RATING),
    },
    {
      label: 'League Average Rating',
      borderColor:"black",
      borderWidth: 1,
      pointBorderColor: 'black',
      pointBorderWidth: 5,
      radius: 2,
      data: lgavg.map(row => row.RTG),
    }
  ], },
    options: {


      animation,
      
      interaction: {
        intersect: false
      },
      // elements: {point: {
      //                     pointStyle: [pointImage]
      //                 }},
      plugins: {
        legend:  {
  
          display: true, // Enable legend
    
          position: 'right' // Position at the bottom
    
      }
        
   
    },
      scales: {
        x: {
          type: 'linear',
          min: 0
         
        },
  
        y: {
          type: 'linear',
          min: 85
        }
      }
    }
  } 
 
  const ctx=document.getElementById('myChart').getContext('2d');

  myChart = new Chart(ctx, config);
  
};
  

   

  function changeTeam() {

    document.getElementById('teamsel').addEventListener('change', changeTeam);

    const teamselected = document.getElementById('teamsel').value;
      
    
      
      // teamselected.addEventListener('change',changeTeam())
      // const games=myj[0][teamselected]["GAME_INFO"]
      

     
      myChart.destroy()
      createChart(Jsondata,teamselected)
  }

  
  