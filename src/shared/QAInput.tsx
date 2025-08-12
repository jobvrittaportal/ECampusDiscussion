import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import { Controller } from "react-hook-form"

interface IInput {
    label?: string,
    name: string,
    type?: string,
    control: any,
    error?: string,
    maxLength?: number,
    required?: boolean,
    disabled?: boolean,
    placeholder?: string,
    column?: number,
    onBlur?: () => void,
    textcolor?: string,
    prefix?: string,
}

export const QAInput = (props: IInput) => {
    const className = props.column ? `field col-12 md:col-${12 / props.column}` : "field col-12 md:col-6";
    return (
        <div className={className}>
            {props.label && <label htmlFor={props.name} style={{ color: props.textcolor ? props.textcolor : "black" }}>{props.label}{props.required && <span style={{ color: 'red' }}>*</span>}</label>}
            <Controller name={props.name} control={props.control} render={({ field, fieldState }) => {
                return (
                        <InputText {...field} maxLength={props.maxLength} onBlur={props.onBlur}
                            disabled={props.disabled}
                            placeholder={props.placeholder} type={props.type ? props.type : "text"}
                            className={classNames({ 'p-invalid': fieldState.invalid })}  style={{ height: '2.5rem', fontSize: '0.85rem' }} prefix={props.prefix} />
                )
            }} />
            <small className="p-error" >{props.error}</small>
        </div>
    );
}