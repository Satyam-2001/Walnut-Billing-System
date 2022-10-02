import React, {useEffect, useState} from 'react'

const SelectInput = (props) => {

    const [isChoosed, setChoosed] = useState(false)
    const [value, setValue] = useState(0)    

    useEffect(() => {
        if(!props.value) return
        const index = props.data.findIndex(obj => ((props.getId?.(obj) || obj.id) === props.value))
        if(index === -1) return
        setChoosed(true)
        setValue(index + 1)
    }, [props.data, props.value])

    const selectionHandler = (event) => {
        setChoosed(true)
        setValue(+event.target.value)
        const id = props.getId?.(props.data[+event.target.value - 1]) || props.data[+event.target.value - 1].id
        props.callBack(id)
    }

    return (
        <select onChange={selectionHandler} disabled={props.disabled} className={props.className} defaultValue={0} value={value}>
            {isChoosed ? undefined : <option value={0}>Select {props.name}</option>}
            {props.data.map((obj, index) => {
                const id = props.getId?.(obj) || obj.id || index
                return <option key={id} value={index + 1}>{props.attr(obj)}</option>
            })}
        </select>
    )
}

export default SelectInput