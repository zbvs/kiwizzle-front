const TableItem = (props) => {
    const {rank, name, count} = props;

    return (
        <tr>
            <td>{rank}</td>
            <td>{name}</td>
            <td>{count}</td>
        </tr>
    )
}


export default function StatisticsDataTable(props) {
    const {sortedArray, nameMapper, fieldName} = props;

    const tableItems = [];
    for (const index in sortedArray) {
        const [idKey, count] = sortedArray[index];
        if (count === 0)
            continue;
        const name = nameMapper(idKey)
        tableItems.push(<TableItem key={tableItems.length} rank={parseInt(index) + 1} name={name} count={count}/>)
    }


    return (
        <table id="example" className="table table-striped table-bordered" style={{width: "100%"}}>
            <thead>
            <tr>
                <th>Rank</th>
                <th>{fieldName}</th>
                <th>Number of Jobdescriptions</th>
            </tr>
            </thead>

            <tbody>
            {tableItems}
            </tbody>
        </table>

    )
}
