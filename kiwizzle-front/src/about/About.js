import RowGrid from "../layout/RowGrid";
import ReactMarkdown from "react-markdown";
import React from "react";


const aboutData = `
### 안녕하세요.  
### 보안 엔지니어 및 소프트웨어 엔지니어로 활동 중인 탁종민(Nickname: zbvs)입니다.
### 소프트웨어 취약점 연구 분야에서 활동해오고 있습니다.
[https://zbvs.tistory.com/19?category=1176990 ](https://zbvs.tistory.com/19?category=1176990)
### 문의사항이 있으시면 아래 이메일로 부탁드립니다.
[zbvs12@gmail.com ](zbvs12@gmail.com)
`;

export default function About() {

    return (
        <>
            <RowGrid>
                <div>
                    <ReactMarkdown parserOptions={{commonmark: true}} children={aboutData}></ReactMarkdown>
                </div>
            </RowGrid>

        </>
    )
}

