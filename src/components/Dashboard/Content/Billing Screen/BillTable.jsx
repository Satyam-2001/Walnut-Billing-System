import React, { Fragment } from 'react'
import classes from './BillTable.module.css'
import Table from '../../../Utils/Table/Table'
import 'react-toastify/dist/ReactToastify.css';
import BillRow from './BillRow'

const BillTable = (props) => {

    const tableHeader = ['Bill Id', 'Bill Date', 'Payment Mode', 'Total', 'Download', 'Send Email', 'View', 'Edit', 'Delete']

    return (
        <Fragment>
            <Table header={tableHeader} className={classes.table}>
                {props.billData.map(billInfo => {
                    return <BillRow editBill={props.editBill} key={billInfo.billId} billInfo={billInfo} patientData={props.patientData} />
                })}
            </Table>
        </Fragment>
    )
}

export default BillTable