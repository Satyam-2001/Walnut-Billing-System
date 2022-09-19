import React, {useState} from 'react'

const SelectInput = (props) => {

    const [isChoosed, setChoosed] = useState(false)
    const [value, setValue] = useState(0)

    const selectionHandler = (event) => {
        setChoosed(true)
        setValue(+event.target.value)
        props.callBack(props.data[+event.target.value - 1])
    }

    return (
        <select onChange={selectionHandler} disabled={props.disabled} className={props.className} value={value}>
            {isChoosed ? undefined : <option value={0} selected={true}>Select {props.name}</option>}
            {props.data.map((obj, index) => {
                return <option key={obj.id || index} value={index + 1}>{props.attr(obj)}</option>
            })}
        </select>
        // selected={props.selectedValue === (props?.key?.(obj) || obj)}
    )
}

export default SelectInput