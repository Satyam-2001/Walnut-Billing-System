import React, { useContext } from 'react'
import classes from './BillTable.module.css'
import axios from 'axios'
import Table from '../Utils/Table/Table'
import LoginContext from '../../context/login-context'

const BillTable = (props) => {


    const tableHeader = ['Bill Id', 'Bill Date', 'Payment Mode', 'Total', 'Download', 'Send Email', 'Edit', 'Delete']
    const logout = useContext(LoginContext)

    const downloadReceipt = (billId) => {
        axios.get(`/api/v1/receipt/downloadReceipt/${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
            responseType: "blob"
        })
            .then(blob => {
                const url = window.URL.createObjectURL(blob.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${billId}-receipt.pdf`
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(e => {
                if (e.response.status === 401) {
                    logout()
                }
            })
    }

    const sendBillViaMail = (billId) => {
        axios.get(`/api/v1/receipt/sendCopyViaMail/${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }
        }).then(res => console.log(res)).catch(e => {
            if (e.response.status === 401) logout()
        });
    }

    const deleteBill = (billId) => {
        axios.delete(`/api/v1/receipt/delete?billId=${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }
        }).then(res => { }).catch(e => {
            if (e.response.status === 401) {
                logout()
            }
        });
    }

    return (
        <Table header={tableHeader} className={classes.table}>
            {props.billData.map(billInfo => {
                return (
                    <tr key={billInfo.billId}>
                        <td>{billInfo.billId}</td>
                        <td>{billInfo.billDate}</td>
                        <td>{billInfo.paymentMode}</td>
                        <td>{billInfo.total}</td>
                        <td><button onClick={() => downloadReceipt(billInfo.billId)} className={'icon-btn'}><ion-icon name="download"></ion-icon></button></td>
                        <td><button onClick={() => sendBillViaMail(billInfo.billId)} className={'icon-btn'}><ion-icon name="mail"></ion-icon></button></td>
                        <td><button onClick={() => {props.editBill(billInfo)}} className={'icon-btn'}><ion-icon name="pencil-sharp"></ion-icon></button></td>
                        <td><button onClick={() => { deleteBill(billInfo.billId) }} className={'icon-btn'}><ion-icon name="trash"></ion-icon></button></td>
                    </tr>
                )
            })}
        </Table>
    )
}

export default BillTable