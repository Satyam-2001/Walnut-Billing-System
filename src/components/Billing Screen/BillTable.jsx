import React, { Fragment, useContext, useState } from 'react'
import classes from './BillTable.module.css'
import axios from 'axios'
import Table from '../Utils/Table/Table'
import LoginContext from '../../context/login-context'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BillTable = (props) => {


    const tableHeader = ['Bill Id', 'Bill Date', 'Payment Mode', 'Total', 'Download', 'Send Email', 'Edit', 'Delete']
    const logout = useContext(LoginContext)
    const [isLoadingDownload, setIsLoadingDownload] = useState(false)
    const [isLoadingMail, setIsLoadingMail] = useState(false)


    const downloadReceipt = (billId) => {
        setIsLoadingDownload(true)
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
                setIsLoadingDownload(false);
            })
            .catch(e => {
                if (e.response.status === 401) {
                    logout()
                }
            })
    }

    const sendBillViaMail = (billId) => {
        setIsLoadingMail(true)
        axios.get(`/api/v1/receipt/sendCopyViaMail/${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }
        }).then(res => {
            toast.success(`Receipt : ${billId} Sended Via Mail`)
            setIsLoadingMail(false)
        }).catch(e => {
            if (e.response.status === 401) logout()
        });
    }

    const deleteBill = (billId) => {
        axios.delete(`/api/v1/receipt/delete?billId=${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }
        }).then(res => {
            props.fetchBillData(props.patientData)
            toast.success(`Bill - ${billId} deleted`)
        }).catch(e => {
            if (e.response.status === 401) {
                logout()
            }
            else {
                toast.error(`Bill - ${billId} not deleted!!`)
            }
        });
    }

    const Spinner = <img className={classes.spinner} src={require('../../assets/spinner.gif')} />

    return (
        <Table header={tableHeader} className={classes.table}>
            {props.billData.map(billInfo => {
                return (
                    <tr key={billInfo.billId}>
                        <td>{billInfo.billId}</td>
                        <td>{billInfo.billDate}</td>
                        <td>{billInfo.paymentMode}</td>
                        <td>{billInfo.total}</td>
                        <td>{isLoadingDownload ? Spinner : <button onClick={() => downloadReceipt(billInfo.billId)} className={'icon-btn'}><ion-icon name="download"></ion-icon></button>}</td>
                        <td>{isLoadingMail ? Spinner : <button onClick={() => sendBillViaMail(billInfo.billId)} className={'icon-btn'}><ion-icon name="mail"></ion-icon></button>}</td>
                        <td><button onClick={() => { props.editBill(billInfo) }} className={'icon-btn'}><ion-icon name="pencil-sharp"></ion-icon></button></td>
                        <td><button onClick={() => { deleteBill(billInfo.billId) }} className={'icon-btn'}><ion-icon name="trash"></ion-icon></button></td>
                    </tr>
                )
            })}
        </Table>
    )
}

export default BillTable