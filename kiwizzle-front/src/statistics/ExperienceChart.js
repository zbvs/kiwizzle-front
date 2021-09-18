import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {backgroundColors, borderColors} from "./Colors";
import JobData from "../job/JobData";
import Grid from "@material-ui/core/Grid";
import {getColorIndex} from "./Chart";
import StatisticsDataTable from "./StatisticsDataTable";


const makeData = (sortedArray, nameMapper) => {

    const data = {
        labels: [],
        datasets: [
            {
                label: '',
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
            data.labels.push(nameMapper(idKey));
            data.datasets[0].data.push(count);
            data.datasets[0].backgroundColor.push(backgroundColors[colorIndex]);
            data.datasets[0].borderColor.push(borderColors[colorIndex]);
        }
    })
    return data;
};


const ExperienceChart = (props) => {
    const mapPropKey = props.mapPropKey;
    const cntMap = JobData.statisticsResult[mapPropKey];
    const fieldName = props.fieldName;
    const sortedArray = [...Object.entries(cntMap)].sort((a, b) => (b[1] - a[1]));

    const nameMapper = (idKey) => {
        if (idKey === "-1")
            return "신입/경력 미기재";
        else
            return idKey + "+ years";
    }


    const data = makeData(sortedArray, nameMapper);

    return (

        <>
            <Grid item xs={12}>
                <Doughnut data={data}/>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <div style={{width: "90%"}}>
                        <StatisticsDataTable sortedArray={sortedArray} nameMapper={nameMapper} fieldName={fieldName}/>
                    </div>
                </div>

            </Grid>
        </>
    );
}

export default ExperienceChart;
