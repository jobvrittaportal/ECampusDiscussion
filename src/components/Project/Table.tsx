
import { Button } from 'primereact/button'

import { IModal } from './Project'
import { Controller, useForm } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { Fetch } from '../../shared/Fetch';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


interface Iprops {
    toast: any,
    setModal: (modal: IModal) => void,
    reload: boolean,
    hasPermission: (pageName: string, featureName?: string) => Boolean,
}

const schema = yup.object({
});
export const Table = (props: Iprops) => {
    const [saveDis, setSaveDis] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [description, setDescription] = useState("");
    const [imageType, setImageType] = useState<string>("");
    const [image, setImage] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null | any>(null);
    const { control, handleSubmit, formState: { errors }, reset } = useForm<any>({
        resolver: yupResolver(schema),
        // defaultValues: props.singleData,
        shouldFocusError: false,
    });



    const saveToDB = async (body: any) => {
        setSubmitting(true);

        const response = await Fetch(`FAQ`, "POST", body, null, props.toast);
        if (response) {
            onHide();
            props.toast.current.show({ severity: 'success', detail: "Added Successfully", life: 3000 });
            //  props.reloadData();
        }
        setSubmitting(false);
    }

    const onHide = () => {
        reset({});
    }

    function onSubmit(data: any) {
        console.log("Form data:", data); // Check if values are there
        saveToDB(data);
    }



    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid formgrid grid">
                <div className="field col-12 md:col-12 mt-0">
                    <label htmlFor="discussion"> Add Discussion<span style={{ color: 'red' }}>*</span> </label>
                    <Controller
                        name="discussion"
                        control={control}
                        rules={{ required: "Discussion is required" }}
                        render={({ field }) => (
                            <InputTextarea
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                rows={5}
                                cols={20}
                            />
                        )}
                    />
                </div>
                <div className="col-12 md:col-12 flex gap-4 justify-content-end mt-2">
                    <Button style={{ width: '100px' }} loading={submitting} label="SAVE" type="submit" className="p-button-rounded"></Button>
                    <Button style={{ width: '100px' }} label="CLEAR" onClick={onHide} type="button" className="p-button-rounded p-button-outlined surface-200"></Button>
                </div>
            </form>
        </>
    )
}

