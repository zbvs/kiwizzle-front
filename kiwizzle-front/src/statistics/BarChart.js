import React from 'react';
import {Bar} from 'react-chartjs-2';
import {backgroundColors, borderColors} from "./Colors";
import JobData from "../job/JobData";
import Grid from "@material-ui/core/Grid";
import {getColorIndex} from "./Chart";
import StatisticsDataTable from "./StatisticsDataTable";

const options = {
    indexAxis: 'y',
    showAllTooltips: true,
    responsive: true,
    plugins: {
        legend: {
            display: false
        }
    },
    maintainAspectRatio: false,
    scales: {
        xAxes: [{
            ticks: {
                autoSkip: false,
            }
        }]
    }

};


const makeData = (sortedArray, nameMapper) => {
    const barData = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },

        ],
    };


    sortedArray.forEach((element) => {
        const [idKey, count] = element;
        if (count !== 0) {
            const colorIndex = getColorIndex(idKey);
            barData.labels.push(nameMapper(idKey));
            barData.datasets[0].data.push(count);
            barData.datasets[0].backgroundColor.push(backgroundColors[colorIndex]);
            barData.datasets[0].borderColor.push(borderColors[colorIndex]);
        }
    })
    return barData;
};


const BarChart = (props) => {
    const mapPropKey = props.mapPropKey;
    const JobDataKey = props.JobDataKey;
    const fieldName = props.fieldName;
    const cntMap = JobData.statisticsResult[mapPropKey];
    const sortedArray = [...Object.entries(cntMap)].sort((a, b) => (b[1] - a[1]));

    const nameMapper = (idKey) => {
        return JobData[JobDataKey][idKey]["publicNameEng"];
    }

    const barData = makeData(sortedArray, nameMapper);
    const length = barData.labels.length;


    return (
        <>
            <Grid item xs={12}>
                <div style={{height: length * 20 + 200, alignItems: "center"}}>
                    <Bar data={barData} height={length * 10}
                         width={null}
                         options={options}
                    />
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <div style={{width: "90%"}}>
                        <StatisticsDataTable sortedArray={sortedArray} nameMapper={nameMapper} fieldName={fieldName}/>
                    </div>
                </div>
            </Grid>
        </>
    )
}

export default BarChart;
