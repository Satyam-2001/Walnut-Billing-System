import React from 'react'
import classes from './Table.module.css'

const Table = (props) => {
    return (
        <div className={`${classes['table-wrapper']}`} >
            <table className={`${classes.table} ${props.className}`}>
                <thead>
                    <tr>
                        {props.header.map(head => <th key={head}>{head}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {props.children}
                </tbody>
            </table>
        </div >
    )
}

export default Table