import {useState} from 'react'

function Record(props){

    // checked for checkbox is require for selected All feature
    return (
        <tr>
            <td><input type="checkbox" onChange={() => {props.handleSelected(props.id)}} checked={props.selected.includes(props.id) ? true : false} /></td>
            <td>{props.address}</td>
            <td>{props.time + ' (' + props.timeZone + ')'}</td>
        </tr>
    )
}

function SearchRecord(props){

    // All button toggle (use for toggle all records)
    const [selectedAll, setSelectedAll] = useState(false)

    // pagination for records
    const [page, setPage] = useState(0)

    // click button to change page
    function prevPage(){
        setPage((prevPage) => prevPage - 1 )
    }
    
    function nextPage(){
        setPage((prevPage) => prevPage + 1 )
    }

    function handleSelectAll(){
        // When All button is not checked
        if (selectedAll === false){
            // select all records at the current page
            props.records.slice(page * 10, (page+1) * 10).forEach((record) =>props.setSelected((prevRecord) => [...prevRecord, record.id]))
            setSelectedAll(!selectedAll)
        }
        // When button is checked, check again to unselected all records at the current page
        else{
            props.records.slice(page * 10, (page+1) * 10).forEach((record) => props.setSelected((prevRecord) => prevRecord.filter( (ID) => ID !== record.id) ))
            setSelectedAll(!selectedAll)
        }
    }
    

    return(
        <section className="records-section">

        <h1>Your Search Records</h1>
        <div className="admin-panel">
          <span>
            <input id="all" type="checkbox" onChange={() => handleSelectAll()} checked={selectedAll}></input> All
          </span>
          <button onClick={() => props.handleDelete(props.selected)}>Delete Selected Records</button>
        </div>
        
        {props.records.length >0 ? <p className="page-info">{`Showing ${(page) * 10 + 1} to ${Math.max((page+1) * 10)} of ${props.records.length} records`}</p>: null}

        {props.records.length > 0 ?
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Location</th>
                        <th>Local time</th>
                    </tr>
                </thead>
                <tbody>
                    {props.records.slice(0 + (page * 10) ,10 + (page * 10)).map(
                    (record) =>
                        <Record id={record.id} key={record.key} address={record.address} time={record.time} timeZone={record.timeZone} selected={props.selected} handleSelected={props.handleSelected} handleDelete={props.handleDelete}/>
                    )}
                </tbody>
            </table> : <p>You have no records at the moment.</p>}

        <div className="pagination">
          <button onClick={prevPage} disabled={(page===0) ? true : false}>Previous</button>
            <p>Page {page + 1}</p>
          <button onClick={nextPage} disabled={(props.records.length < ((page + 1) * 10) + 1 ) ? true : false }>Next</button>
        </div>
    </section>

    )
}

export default SearchRecord;