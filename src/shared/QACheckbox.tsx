import { Checkbox } from "primereact/checkbox"
import { classNames } from "primereact/utils"
import { Controller } from "react-hook-form"

interface ICheckbox {
    label: string,
    name: string,
    control: any,
    error?: string,
    required?: boolean,
    column?: number,
    disabled?: boolean,
    textcolor?: string,
    tooltip?: string,
}

export const QACheckbox = (props: ICheckbox) => {
    const className = props.column ? `field col-12 md:col-${12 / props.column}` : "field col-12 md:col-6";
    return (
        <div className={className}>
            {props.required && <label htmlFor={props.name} style={{ color: props.textcolor ? props.textcolor : "black" }}>{props.label}<span style={{ color: 'red' }}>*</span></label>}
            {!props.required && <label htmlFor={props.name}>{props.label}</label>}
            <div> <Controller name={props.name} control={props.control} render={({ field, fieldState }) => (
                <Checkbox {...field} disabled={props.disabled} checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} tooltip={props.tooltip ? props.tooltip : ""} />
            )} /></div>
        </div>
    );
}