import RowGrid from "./layout/RowGrid";
import ReactMarkdown from "react-markdown";
import React from "react";
import {CODE_MESSAGE, HTTP_CODE} from "./api/api";


export default function Error() {

    return (
        <>
            <RowGrid>
                <div>
                    <ReactMarkdown parserOptions={{commonmark: true}}
                                   children={"# " + CODE_MESSAGE[HTTP_CODE.INTERNAL_SERVER_ERROR]}></ReactMarkdown>
                </div>
            </RowGrid>

        </>
    )
}

