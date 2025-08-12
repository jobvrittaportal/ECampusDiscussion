import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { IPage } from "./Table";
import { Fetch } from "../../shared/Fetch";
import { useEffect, useState } from "react";
import { QACheckbox } from "../../shared/QACheckbox";
import { QAInput } from "../../shared/QAInput";
import { QADropdown } from "../../shared/QADropdown";


interface IProps {
    singleData: IPage,
    open: boolean,
    hideDialog: () => void,
    toast: any,
    reloadData: () => void
}

const schema = yup.object({
    name: yup.string().required(" Name is required"),
});

export const Form = (props: IProps) => {
    const [submitting, setSubmitting] = useState(false);
    const [pagesDrop, setPagesDrop] = useState<any[]>([]);

    const { control, handleSubmit, watch, formState: { errors }, reset } = useForm<IPage>({
        resolver: yupResolver(schema),
        defaultValues: props.singleData,
        shouldFocusError: false
    });
    const isFeature = watch("isFeature");

    const onSubmit = (data: IPage) => {
        saveToDB(data);
    }

    const saveToDB = async (data: any) => {
        setSubmitting(true);
        const method = props.singleData.id != null ? "PUT" : "POST";
        const message = props.singleData.id != null ? "Updated Successfully" : "Added Successfully";

        const response = await Fetch(`page`, method, data, null, props.toast);
        if (response) {
            props.hideDialog();
            props.toast.current.show({ severity: 'success', detail: message, life: 3000 });
            props.reloadData();
            loadParentPages();
        }
        setSubmitting(false);
    }

    const onHide = () => {
        props.hideDialog();
    }

    const loadParentPages = async () => {
        const response = await Fetch("page/parents", "GET", null, null, null);
        if (response) {
            const data: any = await response.json();
            setPagesDrop(data);
        }
    }

    useEffect(() => {
        reset(props.singleData);
    }, [props.open]);

    useEffect(() => {
        loadParentPages();
    }, []);

    return (
        <Dialog visible={props.open} style={{ width: '80vw' }} header="Add/Edit Page or Feature" modal className="p-fluid" onHide={onHide}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid formgrid grid">
                <QAInput required label="Name" disabled={(props.singleData.id !== undefined && props.singleData.id > 0) ? true : false} control={control} name="name" />
                <QAInput label="Label" control={control} name="label" />
                <QAInput label="Url" control={control} name="url" />
                <QAInput label="Description" control={control} name="description" />
                <QACheckbox control={control} disabled={(props.singleData.id !== undefined && props.singleData.id > 0) ? true : false} name="isFeature" label="Is Feature" />
                {isFeature && <QADropdown disabled={(props.singleData.id !== undefined && props.singleData.id > 0) ? true : false} label="Parent Page" required control={control} name="parentId" options={pagesDrop} optionLabel="name" optionValue="id" placeholder="Select " />}

                <div className="col-12 md:col-12 flex gap-4 justify-content-end">
                    <Button style={{ width: '100px' }} loading={submitting} label="SAVE" type="submit" className="p-button-rounded"></Button>
                    <Button style={{ width: '100px' }} label="CLOSE" onClick={onHide} type="button" className="p-button-rounded p-button-outlined surface-200"></Button>
                </div>
            </form>
        </Dialog>
    );
}