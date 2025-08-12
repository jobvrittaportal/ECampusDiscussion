// import { color } from 'html2canvas/dist/types/css/types/color';
import { MultiSelect } from 'primereact/multiselect';

interface IMultiselect {
    label?: string,
    options: any,
    optionLabel: string,
    value: any,
    placeholder: string,
    required?: boolean,
    column?: number,
    onChange: (e: any) => void,
    disabled?: boolean,
    textcolor?: string,
}

export const QAMultiselect = (props: IMultiselect) => {
    const className = props.column ? `field col-12 md:col-${12 / props.column}` : "field col-12 md:col-6";
    return (
        <div className={className}>
            <label style={{ color: props.textcolor ? props.textcolor : "black" }}>{props.label}{props.required && <span style={{ color: 'red' }}>*</span>}</label>
            <MultiSelect disabled={props.disabled} value={props.value} options={props.options} onChange={(e) => props.onChange(e.value)} optionLabel={props.optionLabel} placeholder={props.placeholder} display="chip" />
        </div>
    )
}