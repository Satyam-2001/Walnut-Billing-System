import React, { Fragment } from 'react'
import classes from './Navbar.module.css'

const Navbar = (props) => {

    const optionList = ['Billing Screen', 'Clinic', 'Doctor', 'Treatment', 'Patient']

    return (
        <Fragment>
            {
                props.navbarOpen ? (
                    <ul className={`${classes.navbar}`}>
                        {optionList.map(option => {
                            return <li key={option} onClick={() => { props.setOption(option) }} className={`${props.selected === option ? classes.selected : classes['not-selected']}`}>{option}</li>
                        })}
                    </ul>
                ) : undefined
            }
        </Fragment>
    )
}

export default Navbar