import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Fetch } from "../../shared/Fetch";
import { QAInput } from "../../shared/QAInput";

const schema = yup.object({
    name: yup.string().required("Role Name is required*"),
});

interface Iprops {
    singleData: IRole,
    open: boolean,
    hideDialog: () => void,
    toast: any,
    reloadData: () => void
}

export interface IRole {
    id?: number
    name: string
    desc?: string
}

export const Form = (props: Iprops) => {
    const [submitting, setSubmitting] = useState(false);
    const { control, handleSubmit, formState: { errors }, reset } = useForm<IRole>({
        resolver: yupResolver(schema),
        defaultValues: props.singleData
    });

    useEffect(() => {
        reset(props.singleData);
    }, [props.singleData, reset])

    const saveToDB = async (body: IRole) => {
        setSubmitting(true);
        const method = props.singleData.id ? "PUT" : "POST";
        const message = props.singleData.id ? "Updated Successfully" : "Added Successfully";

        const response = await Fetch(`role${props.singleData.id ? '/' + props.singleData.id : ''}`, method, body, null, props.toast);

        if (response) {
            onHide();
            props.toast.current.show({ severity: 'success', detail: message, life: 3000 });
            props.reloadData();
        }
        setSubmitting(false);
    }

    const onHide = () => {
        props.hideDialog();
        reset({});
    }

    function onSubmit(data: IRole) {
        saveToDB(data);
    }

    return (
        <Dialog visible={props.open} style={{ width: '80vw', maxWidth: '400px' }} header="Add/Edit Role" modal className="p-fluid" onHide={onHide}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid formgrid grid">
                <QAInput column={1} required label="Role Name" control={control} name="name" error={errors.name?.message} />
                <QAInput column={1} label="Description" control={control} name="desc" error={errors.desc?.message} />
                <div className="col-12 md:col-12 flex gap-4 justify-content-end mt-2">
                    <Button style={{ width: '100px' }} loading={submitting} label="SAVE" type="submit" className="p-button-rounded"></Button>
                    <Button style={{ width: '100px' }} label="CLOSE" onClick={onHide} type="button" className="p-button-rounded p-button-outlined surface-200"></Button>
                </div>
            </form>
        </Dialog>
    );
}
