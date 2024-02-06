import "./input.css"
import React, { ChangeEvent } from 'react';
export type InputInterface = {
    type:string; 
    text?:string;
    name:string;
    placeholder?:string;
    handleOnChange:(e: ChangeEvent<HTMLInputElement>) =>void;
    value?:string|number
}
function Input({type, text, placeholder, name, value, handleOnChange}:InputInterface){
    return(
        <div className="input-container">
            <label htmlFor={name}>{text}</label>
            <input name={name} placeholder={placeholder} id={name} type={type} onChange={handleOnChange}
            value={value}
            >
            </input>
        </div>
    )
}
  
export default Input;