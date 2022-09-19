import React, {useState} from 'react'
import BillingScreen from '../Billing Screen/BillingScreen'
import classes from './Main.module.css'
import Navbar from './Navbar'

const Main = (props) => {

    const [selected, setSelected] = useState('Billing Screen')
    
    const setOption = (option) => {
        if(option !== selected) setSelected(option)
    }

    return (
        <div className={classes.main}>
            <Navbar navbarOpen={props.navbarOpen} selected={selected} setOption={setOption} />
            {selected === 'Billing Screen' ? <BillingScreen className={`${classes['main-screen']}`} /> : undefined}
        </div>
    )
}

export default Main