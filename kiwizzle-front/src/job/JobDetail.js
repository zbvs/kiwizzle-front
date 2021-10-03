import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {config} from '../Config'
import JobData, {getJobDetailComponent} from './JobData'
import ReactMarkdown from 'react-markdown'
import "./JobDetail.css"
import {Helmet} from "react-helmet-async";
import dompurify from "dompurify";


const JobDetailImage = (props) => {
    const {jobView} = props;

    return (
        <div style={{border: "1px solid #D4D4D4", padding: "5px"}}>
            <img src={config.API_HOST + `/job/${jobView.descId}/image`} alt={jobView.document.title + " 채용"}/>
        </div>
    )
};


const JobDetailContentCollapse = (props) => {
    const sanitizer = dompurify.sanitize;
    const {jobView} = props;

    return (
        <div className={"jobDetailContent"}>
            <p>
                <button className="btn btn-info" type="button" data-toggle="collapse" data-target="#job-text-content"
                        aria-expanded="false" aria-controls="collapseExample">
                    {"텍스트 보기"}
                </button>
            </p>
            <div className="collapse" id="job-text-content">
                <div className="card card-body">
                    {
                        jobView.document.type === "html" ?
                            <div dangerouslySetInnerHTML={{__html: sanitizer(jobView.document.content)}}/>
                            :
                            <ReactMarkdown>{jobView.document.content}</ReactMarkdown>
                    }
                </div>
            </div>
        </div>
    )
};

const getHTMLTitleContent = (jobDetailed) => {
    let positions = [];
    for (let id of jobDetailed.metaDetail.position) {
        if (JobData.position[id].publicNameKor !== "기타")
            positions.push(JobData.position[id].publicNameKor);
    }

    let result = JobData.company[jobDetailed.metaDetail.company].publicNameKor + " " + positions.join(",") + " 채용: " + jobDetailed.document.title;
    const regex = /(\u00a0|\s)/g;
    return result.replace(regex, " ");

}

const getHTMLMetaDescriptionContent = (jobDetailed) => {
    const registrationDate = jobDetailed.dates.registrationDate.substring(0, 10);
    const endDate = jobDetailed.dates.endDate === null ? "채용시/미정" : jobDetailed.dates.endDate.substring(0, 10);
    let languages = [];
    for (let id of jobDetailed.metaDetail.language) {
        languages.push(JobData.language[id].publicNameEng)
    }
    const requireString = languages.length === 0 ? "" : " [요구 언어/기술]: " + languages.join(",");
    return getHTMLTitleContent(jobDetailed) + requireString + "[등록/마감]: " + registrationDate + "~" + endDate;
}

export default function JobDetail() {
    const {descId} = useParams();
    const [jobView, setJobView] = useState(null);


    useEffect(() => {
        fetch(config.API_HOST + '/job/' + descId)
            .then((res) => {
                if (res.status === 200)
                    return res.json()
                else
                    return "error"
            })
            .then((job) => {
                if (job !== "error") {
                    setJobView(job)
                } else {
                    setJobView("error")
                }
            })
    }, [descId]);

    return (
        <div className={"jobDetailContainer"}>
            {jobView === null ? null :
                jobView === "error" ?
                    <span style={{fontSize: '20px', fontWeight: '2000'}}>
                {"마감된 채용공고 주소입니다."}
                </span>
                    :
                    <>
                        <div>
                            <Helmet>
                                <title>{getHTMLTitleContent(jobView) + " | 키위즐"}</title>
                                <meta name="description" content={getHTMLMetaDescriptionContent(jobView)}/>
                            </ Helmet>
                            {getJobDetailComponent(jobView)}

                            <span style={{fontWeight: '1000'}}>
                {"채용공고 링크 : "}
                </span>

                            <a href={jobView.document.url} rel="noreferrer" target="_blank"
                               style={{fontWeight: '1000'}}>
                                {decodeURI(jobView.document.url)}
                            </a>
                        </div>
                        <hr style={{width: "100%"}}/>
                        {jobView === null ? "" :
                            <JobDetailContentCollapse jobView={jobView}/>
                        }
                        <hr style={{width: "100%"}}/>
                        {jobView === null ? "" :
                            <JobDetailImage jobView={jobView}/>
                        }


                    </>
            }


        </div>
    )
}

