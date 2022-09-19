import React from 'react'
import classes from './BillTable.module.css'
import axios from 'axios'
import Table from '../Utils/Table/Table'

const BillTable = ({ billData }) => {


    const tableHeader = ['Bill Id', 'Bill Date', 'Payment Mode', 'Status', 'Remark', 'Download', 'Send Email']

    const downloadReceipt = (billId) => {
        axios.get(`/api/v1/receipt/downloadReceipt/${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
            responseType: "blob"
        })
            .then(blob => {
                console.log(blob);

                const url = window.URL.createObjectURL(blob.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${billId}-receipt.pdf`
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
    }

    const sendBillViaMail = (billId) => {
        axios.get(`/api/v1/receipt/sendCopyViaMail/${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }
        }).then(res => console.log(res)).catch(console.log);
    }

    return (
        <Table header={tableHeader} className={classes.table}>
            {billData.map(billInfo => {
                return (
                    <tr key={billInfo.billId}>
                        <td>{billInfo.billId}</td>
                        <td>{billInfo.billDate}</td>
                        <td>{billInfo.paymentMode}</td>
                        <td>{billInfo.billStatus}</td>
                        <td>{billInfo.remark}</td>
                        <td><button onClick={() => downloadReceipt(billInfo.billId)} className={'icon-btn'}><ion-icon name="download"></ion-icon></button></td>
                        <td><button onClick={() => sendBillViaMail(billInfo.billId)} className={'icon-btn'}><ion-icon name="mail"></ion-icon></button></td>
                    </tr>
                )
            })}
        </Table>
    )
}

export default BillTable