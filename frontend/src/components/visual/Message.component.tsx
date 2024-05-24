import { IoMdAlert } from "react-icons/io";
import "../../../public/style/components/visual/message.css"
import { useEffect, useState } from "react";
function Message({msg, status, timers}:any) {
    const [type, setType] = useState<string>();
    const [visible, setVisible] = useState(false)
    useEffect(()=> {
        if (status >= 300) {setType("error");} else {setType("success")}
        if(!msg){
            setVisible(false)
            return
        }
            setVisible(true)
            const timer = setTimeout(()=>{
                setVisible(false)
                msg = null;
                status = null;
            }, timers)
            return()=>clearTimeout(timer)
    }, [msg])
    return (
        <>
            {visible && (
            <div className={`notify_message ${type}`}>
                <div className={`${type}__icon`}>
                    <IoMdAlert />
                </div>
                <div className={`${type}__title`}>{msg}</div>
            </div>
            )}
        </>
    )
}
export default Message;