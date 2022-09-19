import { useEffect } from 'react'

const useOutsideAlerter = (refs, onOutsideClick) => {
    useEffect(() => {
        
        const handleClickOutside = (event) => {
            for(let ref of refs) {
                if(!ref.current || ref.current.contains(event.target)) return;
            }
            onOutsideClick()
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refs]);
}

export default useOutsideAlerter