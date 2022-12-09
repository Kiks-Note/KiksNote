import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
import React, { useState } from 'react';
import burn from "../board/BurnDown.json"

ChartJS.register(
    Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler
)

export default function BurnDown(){
     var IdealProgress = [100, 90, 80, 70, 60, 50, 40, 30, 20, 13, 6, 0]

    let myTeamProgress = [];
    burn.TeamProgress.forEach(function(teamProgress){
        myTeamProgress.push(teamProgress);
        console.table(myTeamProgress);
    })

 
 

    //var IdealProgress = [Math.max(...burn.TeamProgress), burn.sprintTime.length]
    const [data] = useState({
        labels: burn.sprintTime, // BurnDown.sprintTime Json data
        datasets:[
            {
                // Ideal progression Blue
                label:"BurnDown IdealProgress",
                data: IdealProgress,
                backgroundColor:'yellow',
                borderColor: 'blue',
                tension: 0.4
                // https://www.chartjs.org/docs/latest/charts/line.html attributes for datasets
            },
            {
                // Team Progress Red 
                label:"BurnDown TeamProgress",
                data: burn.TeamProgress,
                backgroundColor: 'orange',
                borderColor: 'red',
                tension: 0.4
            }
        ],
    })

    return (
        <div className='App'>
            <h1>BurnDown / BurnUp</h1>
            <Line data={data} style={{width:'1000px', height:'1000px'}}>Hello</Line>
        </div>
    )

}