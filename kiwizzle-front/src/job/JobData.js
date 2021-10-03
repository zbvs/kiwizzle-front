import React from 'react';
import {config, defaultQueryState} from '../Config'
import Style from '../Style.module.css';
import assert from 'assert';
import crypto from 'crypto'
import {globalQueryState} from "../query/Query"
import {getUrlParamaters} from "../Util";


export const recursiveStringifyId = (data) => {
    for (let key in data) {
        if (key === "jobCnt") {
            //Do nothing
        } else if (Number.isInteger(data[key]))
            data[key] = data[key].toString()
        else if (Array.isArray(data[key]) && data[key].length && Number.isInteger(data[key][0])) {
            data[key] = data[key].map(x => x.toString());
        } else if (typeof (data[key] === "Object")) {
            //todo.. recursive StringifyId
        }
    }
};

export const JobInitDataExtractors = {
    "/category": (result) => result.data.forEach(x => {
        recursiveStringifyId(x);
        JobData.category[x["categoryId"]] = x;
    }),
    "/country": (result) => result.data.forEach(x => {
        recursiveStringifyId(x);
        JobData.country[x["countryId"]] = x;
    }),
    "/company": (result) => result.data.forEach(x => {
        recursiveStringifyId(x);
        x.childs = [];
        x.parent = null;
        x.type = config.CP_TYPE_REAL;
        x.countedJobCnt = 0;
        JobData.company[x["companyId"]] = x;
    }),
    "/position": (result) => result.data.forEach(x => {
        recursiveStringifyId(x);
        x.childs = [];
        x.parent = null;
        x.type = config.PS_TYPE_REAL;
        x.countedJobCnt = 0;
        JobData.position[x["positionId"]] = x;
    }),
    "/language": (result) => result.data.forEach(x => {
        recursiveStringifyId(x);
        x.childs = [];
        x.parent = null;
        x.type = config.LANG_TYPE_REAL;
        x.countedJobCnt = 0;
        JobData.language[x["languageId"]] = x;
    })
}

export const getDefaultCategoryId = () => {
    return config.CT_ID_ALL;
}

export const SelectedCategoryId = {
    value: config.CT_ID_ALL
}

const initCategory = () => {
    Object.values(JobData.company).forEach(company => {
        company.parentId = company.parentId === null ? config.CP_ID_ROOT : company.parentId;
    });


    JobData.category[config.CT_ID_ALL] = {
        "categoryId": config.CT_ID_ALL, "categoryCode": config.CT_NAME_ALL,
        "publicNameKor": config.CT_PUBLIC_NAME_KOR, "publicNameEng": config.CT_PUBLIC_NAME_ENG
    };
    JobData.sortedCategory = Object.values(JobData.category).sort((a, b) => (a.categoryId - b.categoryId));
}


export const SelectedCountryId = {
    value: getUrlParamaters("country", window.location.search) !== null ? getUrlParamaters("country", window.location.search) : "1"
}


const initCountry = () => {
    JobData.sortedCountry = Object.values(JobData.country).sort((a, b) => (a.countryId - b.countryId));

}


//** Global Company Filter Variables:
//Company Select
export const SelectedCompanySets = {};

//Jobs filtered by current company sets.
export const companyFilteredSet = new Set();
export const existingIdCntMap = new Map();
export const searchedIdCntMap = new Map();
const defaultCompanySet = new Set();

export const filterCategoryCountry = (cid, categoryId, countryId) => {
    return JobData.company[cid].countryId === countryId && (JobData.company[cid].category.includes(categoryId) || categoryId === config.CT_ID_ALL);
}

export const filterCurrentSelectedCompany = (set, categoryId, countryId) => [...set].filter(cid => filterCategoryCountry(cid, categoryId, countryId));

export const isDefaultCompanySet = () => {
    const currentSet = SelectedCompanySets[SelectedCategoryId.value];
    return currentSet.size === defaultCompanySet.size && [...currentSet].every(id => defaultCompanySet.has(id));
}

//Note:
// Should be called after initial JobData extraction
export const initCompanyFilterContext = () => {
    let rootCompany = JobData.company[config.CP_ID_ROOT];
    for (let category of Object.values(JobData.category)) {
        SelectedCompanySets[category.categoryId] = new Set();
        SelectedCompanySets[category.categoryId].add(rootCompany.companyId);
    }

    SelectedCompanySets[config.CT_ID_ALL] = new Set();
    for (let company of Object.values(JobData.company)) {
        company.category.forEach(categoryId => SelectedCompanySets[categoryId].add(company.companyId))
        SelectedCompanySets[config.CT_ID_ALL].add(company.companyId);//Can add root again, but this is Set, must be safe
        defaultCompanySet.add(company.companyId);
    }
}


const initCompany = () => {
    const remainSet = new Set(Object.values(JobData.company));
    const root = {
        "companyId": config.CP_ID_ROOT, "companyCode": config.CP_NAME_ROOT, "childs": [],
        "parent": null, "position": [], "category": [config.CT_ID_ALL], "jobCnt": 0, "countedJobCnt": 0,
        "publicNameKor": "전체 선택/해제", "publicNameEng": "All"
    }

    JobData.company[config.CP_ID_ROOT] = root;

    const makeTree = (parent, remainSet) => {
        remainSet.forEach(company => {
            if (company.parentId === parent.companyId) {
                company.parent = parent;
                parent.childs.push(company);
                remainSet.delete(company);
                makeTree(company, remainSet);
            }
        })
    }

    makeTree(root, remainSet);
    JobData.companyRoot = root;
    JobData.sortedCompany = Object.values(JobData.company).sort((a, b) => (a.companyId - b.companyId));
    initCompanyFilterContext();
}


//** Global Position Filter Variables;
//Current All Available position id set
export const availablePositionSet = new Set();
//Selected position set
export const SelectedPositionSet = new Set();
//Job cnt per position id.
export const positionIdCntMap = new Map();

const defaultPositionSet = new Set();
export const isDefaultPositionSet = () => {
    return SelectedPositionSet.size === defaultPositionSet.size && [...SelectedPositionSet].every(id => defaultPositionSet.has(id));
}


export const initPositionFilterContext = () => {
    availablePositionSet.clear();
    SelectedPositionSet.clear();
    positionIdCntMap.clear();
    for (let position of JobData.sortedPosition) {
        const id = position.positionId;
        defaultPositionSet.add(id);
        SelectedPositionSet.add(id);
        availablePositionSet.add(id);
        positionIdCntMap.set(id, 0);
    }
}


const initPosition = () => {
    let root = {
        "positionId": config.PS_ID_ROOT,
        "positionCode": config.PS_NAME_ROOT,
        "publicNameEng": config.PS_NAME_ROOT_ENG,
        "publicNameKor": config.PS_NAME_ROOT,
        "childs": [],
        "parent": null,
        "countedJobCnt": 0,
        "type": config.PS_TYPE_VIRTUAL
    }
    for (let position of Object.values(JobData.position)) {
        position.parent = root;
        root.childs.push(position);
    }
    JobData.position[root.positionId] = root;
    JobData.sortedPosition = Object.values(JobData.position).sort((a, b) => {
        if (a.positionId === config.PS_ID_ROOT)
            return -1;
        else if (a.positionCode === "ETC")
            return 1;
        if (a.positionCode > b.positionCode)
            return 1;
        else if (a.positionCode < b.positionCode)
            return -1;
        else {
            return 0;
        }
    });
    JobData.positionRoot = root;
    initPositionFilterContext();
};


//** Global Langauge Filter Variables;
//Selected language set
export const SelectedLanguageSet = new Set();
//Langauge options
export const LanguageOptions = [{"publicNameEng": ""}];
export const isDefaultLanguageSet = () => {
    return SelectedLanguageSet.size === 0;
}


export const initLanguageFilterContext = () => {
    Object.values(JobData.language).forEach(language => {
        if (language.languageId !== config.LANG_ID_ETC && language.type === config.LANG_TYPE_REAL)
            LanguageOptions.push(language);
    })
    SelectedLanguageSet.clear();
}

const initLanguage = () => {
    let root = {
        languageId: config.LANG_ID_ROOT, languageCode: config.LANG_NAME_ROOT,
        childs: [], parent: null, countedJobCnt: 0, type: config.PS_TYPE_VIRTUAL
    }
    JobData.language[config.LANG_ID_ROOT] = root;
    initLanguageFilterContext();
};


export const getRealCidAll = () => {
    return Object.values(JobData.company).filter(company => company.type === config.CP_TYPE_REAL).map(company => company.companyId)
}
export const getRealCidSelected = () => {
    const categoryId = SelectedCategoryId.value;
    const countryId = SelectedCountryId.value;

    const array = [...SelectedCompanySets[SelectedCategoryId.value]].filter(cid =>
        (JobData.company[cid].countryId === countryId && (JobData.company[cid].category.includes(categoryId) || categoryId === config.CT_ID_ALL) && JobData.company[cid].type === config.CP_TYPE_REAL)
    );
    return array;
}


export const getRealPidAll = () => {
    return Object.values(JobData.position).filter(position => position.type === config.PS_TYPE_REAL).map(position => position.positionId);
}
//export const getRealPidSelected = () => [...SelectedPositionSet];
export const getRealPidSelected = () => {
    return [...SelectedPositionSet].filter(pid => JobData.position[pid].type === config.PS_TYPE_REAL);
}


export const getRealLidSelected = () => [...SelectedLanguageSet];

export const isDefaultExperienceValue = () => {
    const compareKeyList = ["experienceBelow", "experienceAbove"]
    for (const key of compareKeyList)
        if (defaultQueryState[key] !== globalQueryState[key])
            return false;
    return true;
}
export const isQueryStateDefaultWithKey = (key) => {
    return defaultQueryState[key] === globalQueryState[key]
}

export const CallbackAfterExtraction = () => {
    initCategory();
    initCountry();
    initCompany();
    initPosition();
    initLanguage();
}

export const ToGeneralPageNumber = (page) => page - 1;
export const ToFrontPageNumber = (page) => page + 1;


export const TreeSelectionHandler = (node, SelectSet, ID_KEY, getCurrentChilds) => {
    let id = node[ID_KEY];
    if (SelectSet.has(id)) { //turn off
        SelectSet.delete(id);
        const recursiveChildOff = (node) => {
            const childs = getCurrentChilds(node);
            for (let child of childs) {
                if (SelectSet.has(child[ID_KEY]))
                    SelectSet.delete(child[ID_KEY]);
                recursiveChildOff(child);
            }
        }
        recursiveChildOff(node)

        while (null !== (node = node.parent)) {
            const childs = getCurrentChilds(node);
            if (childs.filter(x => SelectSet.has(x[ID_KEY])).length === 0) {
                SelectSet.delete(node[ID_KEY]);
                recursiveChildOff(node);
            } else
                return
        }
    } else { //turn on
        SelectSet.add(id);
        const recursiveChildOn = (node) => {
            const childs = getCurrentChilds(node);
            for (let child of childs) {
                if (!SelectSet.has(child[ID_KEY]))
                    SelectSet.add(child[ID_KEY]);
                recursiveChildOn(child);
            }
        }
        recursiveChildOn(node);
        while (null !== (node = node.parent)) {
            const childs = getCurrentChilds(node);
            if (childs.filter(x => SelectSet.has(x[ID_KEY])).length === 1) {//have just one child added now
                SelectSet.add(node[ID_KEY]);
            } else
                break;
        }
    }
}


export const setTreeCntMap = (dataMap, root, idKey, cntKey, getCurrentChilds) => {
    dataMap.clear();
    const getCountedJobCnt = (node) => {
        const childs = getCurrentChilds(node);
        //Actually all the parents company have 0 jobCnt.. This can be set as 0 ( let jobCnt = 0 )
        let countedJobCnt = node[cntKey];
        childs.forEach(childCompany => {
            let childCoundedJobCnts = getCountedJobCnt(childCompany);
            countedJobCnt += childCoundedJobCnts;
            dataMap.set(childCompany[idKey], childCoundedJobCnts);
        })

        return countedJobCnt;
    }
    dataMap.set(root[idKey], getCountedJobCnt(root))
}


export const validateId = (id) => {
    assert(typeof (id) === "string" && id.match("^-?\\d+$"))
}

export const createCompany = (companyId, companyCode, childs, parent, parentId, position, categoryId, publicNameKor, publicNameEng, jobCnt, countedJobCnt, type) => {
    validateId(companyId);
    assert(typeof (companyCode) === "string");
    assert(Array.isArray(childs));
    assert(typeof (parent) === "object");
    validateId(categoryId);
    assert(Array.isArray(position));
    validateId(categoryId);
    assert(Number.isInteger(jobCnt));
    assert(Number.isInteger(countedJobCnt));
    assert(typeof (type) === "string");
    return {
        "companyId": companyId,
        "companyCode": companyCode,
        "childs": childs,
        "parent": parent,
        "parentId": parentId,
        "position": position,
        "categoryId": categoryId,
        "publicNameKor": publicNameKor,
        "publicNameEng": publicNameEng,
        "jobCnt": jobCnt,
        "countedJobCnt": countedJobCnt,
        "type": type
    }
}


export const toCategoryIdOfCompanyId = (companyId) => {
    validateId(companyId);
    return (parseInt(companyId) - 80000000).toString();
}

export const toCompanyIdOfCategoryId = (categoryId) => {
    validateId(categoryId);
    return (parseInt(categoryId) + 80000000).toString();
}

export const aesDecryptData = (data) => {
    const lines = data.split(":");
    const key = "860081015EDD2CB3D9806E629200A8BBCCF668EDE665700CF87BBDBF70E84176";
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(lines[0], 'base64'));
    const encrypted = decipher.update(Buffer.from(lines[1], 'base64'));
    return Buffer.concat([encrypted, decipher.final()]).toString();

}

export const getCompanyImgTag = (company, size = 30) => {
    return <img src={config.API_HOST + `/company/${company.companyId}/image`} style={{width: size, height: size}}
                alt={company.publicNameKor + ", " + company.publicNameEng + " 채용"}/>
}

export const getJobDetailComponent = (job, isMobile = false) => {

    const registrationDate = job.dates.registrationDate.substring(0, 10);
    const endDate = job.dates.endDate === null ? "채용시/미정" : job.dates.endDate.substring(0, 10);
    const company = JobData.company[job.metaDetail.company];

    let positions = [];
    for (let id of job.metaDetail.position) {
        positions.push(<span disabled key={positions.length}
                             className={Style.spanTagItem}>{JobData.position[id].publicNameEng}</span>)
    }

    let languages = [];
    for (let id of job.metaDetail.language) {
        languages.push(<span disabled key={languages.length}
                             className={Style.spanTagItem}>{JobData.language[id].publicNameEng}</span>)
    }

    let languagePreferreds = [];
    for (let id of job.metaDetail.languagePreferred) {
        if (!job.metaDetail.language.includes(id))
            languagePreferreds.push(<span disabled key={languagePreferreds.length}
                                          className={Style.spanTagItem}>{JobData.language[id].publicNameEng}</span>)
    }

    return (
        <>
            <div style={{display: "flex"}}>
                {isMobile ? getCompanyImgTag(company, 20) : getCompanyImgTag(company, 25)}
                <span>
                    &nbsp;
                </span>
                <div>
            <span className={Style.spancompanyCode}>
                {" " + company.publicNameEng}
            </span>
                    <span className={Style.spanJobTitle}>
                {" : " + job.document.title}
            </span>
                </div>
            </div>
            <div>

                <span className={Style.spanTagColumn}>
                {"Position: "}
            </span>
                {positions}


                {languages.length > 0 ?
                    <>
                                        <span className={Style.spanTagColumn}>
                                            {" Require: "}
            </span>
                        {languages}
                    </>
                    : null}


                {languagePreferreds.length > 0 ?
                    <>
                                        <span className={Style.spanTagColumn}>
                {" Preferred: "}
            </span>
                        {languagePreferreds}
                    </>
                    : null}


                {job.metaDetail.recommendExperience === null ? null :
                    <>
                        <span className={Style.spanTagColumn}>{" 경력: "}</span>

                        <span className={Style.spanTagItem}>{
                            job.metaDetail.recommendExperience + "년"
                        }
                     </span>
                        <span>{
                            "이상"
                        }
                     </span>
                    </>
                }
                <span>
                {" | "}
            </span>
                <span className={Style.spanTagColumn}>
                {"등록/마감: "}
            </span>
                <span>
                {registrationDate + " ~ " + endDate}
            </span>
            </div>
        </>

    )
}

export const JobData = {
    company: {},
    companyRoot: null,
    category: {},
    country: {},
    position: {},
    language: {},
    job: {},
    sortedJob: [],
    categorySelected: [],
    companySelected: [],
    positionSelected: [],
    languageSelected: [],
    jobSelected: [],
    searchResult: null,
    statisticsResult: null,
    searchQuery: {searchPage: 0},
}

export default JobData;



