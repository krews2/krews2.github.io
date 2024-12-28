
let Jsondata;
let myCharting;

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

const offPtag = document.getElementById("off-rtg");
offPtag.innerHTML = Jsondata[3][selectTeam]["OFF_RANKING"]


const defPtag = document.getElementById("def-rtg");
defPtag.innerHTML = Jsondata[3][selectTeam]["DEF_RANKING"]

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
      label_abb: 'OFF_RTG',
      borderColor:"blue",
      borderWidth: 1,
      pointBorderColor: 'blue',
      pointBorderWidth: 5,
      radius: 2,
      data: games.map(row => row.STD_OFF_RATING),
    },
    {
      label: 'Defensive Rating',
      label_abb: 'DEF_RTG',
      borderColor:"red",
      borderWidth: 1,
      pointBorderColor: 'red',
      pointBorderWidth: 5,
      radius: 2,
      data: games.map(row => row.STD_DEF_RATING),
    },
    {
      label: 'League Average Rating',
      label_abb: 'LG_AVG_RTG',
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
    
      },

      tooltip: {
       
        
        
        callbacks: {
            label: (context) => {

              console.log(context)
              
             
               
              
                return `GAME NUM: ${context.label}, ${context.dataset.label_abb}: ${context.parsed.y.toFixed(1)}`
                
              }
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
              size: 20,
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
 
  const ctx=document.getElementById('myChart').getContext('2d');

  myCharting = new Chart(ctx, config);
  
};
  

   

  function changeTeam() {

    document.getElementById('teamsel').addEventListener('change', changeTeam);

    const teamselected = document.getElementById('teamsel').value;
      
    
      


     
      myCharting.destroy()
      createChart(Jsondata,teamselected)
  }

  
  