import { Dropdown } from "primereact/dropdown"
import { classNames } from "primereact/utils"
import { Controller } from "react-hook-form"

interface IDropdown {
    label?: string,
    name: string,
    defaultValue?: any,
    control: any,
    error?: string
    options: any
    optionValue: string,
    optionLabel: string,
    placeholder?: string,
    required?: boolean,
    column?: number,
    disabled?: boolean,
    textcolor?: string,
}

export const QADropdown = (props: IDropdown) => {
    const className = props.column ? `field col-12 md:col-${12 / props.column}` : "field col-12 md:col-6";
    return (
        <div className={className}>
            {props.label && <label htmlFor={props.name} style={{ color: props.textcolor ? props.textcolor : "black" }}>{props.label}{props.required && <span style={{ color: 'red' }}>*</span>}</label>}
            <Controller name={props.name} control={props.control} defaultValue={props.defaultValue} render={({ field, fieldState }) => (
                <Dropdown inputId={field.name} disabled={props.disabled} {...field} options={props.options} optionValue={props.optionValue} optionLabel={props.optionLabel} value={field.value} placeholder={props.placeholder} className={classNames({ 'p-invalid': fieldState.invalid })} style={{ height: '2.5rem', fontSize: '0.85rem', paddingBottom: "0 0.75rem", lineHeight: "1rem", }} />
            )} />
            <small className="p-error" >{props.error}</small>
        </div>
    )
}