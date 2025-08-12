import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Fetch } from '../../shared/Fetch';
import { QAInput } from '../../shared/QAInput';

interface IProps {
    singleData: any;
    open: boolean;
    hideDialog: () => void;
    toast: any;
    reload: boolean;
    setReload: (is: boolean) => void;
    hasPermission: (pageName: string, featureName?: string) => Boolean;
}

export interface IFormData {
    testCaseID?: number;
    module: string;
    subModule: string;
    scenario: string;
    description: string;
    testType: boolean;
    stepsToExecute: string; // comma-separated in final payload
    preconditions: string;
    expectedResult: string;
    actualResult: string;
    status: boolean;
    comment?: string;
}

export const emptyFormData: IFormData = {
    module: '',
    subModule: '',
    scenario: '',
    description: '',
    testType: false,
    stepsToExecute: '',
    preconditions: '',
    expectedResult: '',
    actualResult: '',
    status: false,
};

const schema = yup.object().shape({
    module: yup.string().required('Module required'),
    subModule: yup.string().required('Sub-Module required'),
    scenario: yup.string().required('Scenario required'),
    description: yup.string().required('Description required'),
    stepsToExecute: yup.string().required('Steps To Execute required'),
    preconditions: yup.string().required('Preconditions required'),
    expectedResult: yup.string().required('Expected Result required'),
    actualResult: yup.string().required('Actual Result required'),
    status: yup.boolean().required('Status required'),
    testType: yup.boolean().required('Test Type required'),
});

export const Form = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [steps, setSteps] = useState<string[]>(['']); // store each step separately

    const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<IFormData>({
        resolver: yupResolver(schema),
        defaultValues: props.singleData
    });

    useEffect(() => {
        setValue(
            "stepsToExecute",
            steps.filter(s => s.trim() !== "").join(", "),
            { shouldValidate: true }
        );
    }, [steps, setValue]);


    useEffect(() => {
        if (props.singleData?.stepsToExecute) {
            // split into array if provided
            setSteps(props.singleData.stepsToExecute.split(',').map((s: string) => s.trim()));
        } else {
            setSteps(['']);
        }
        reset(props.singleData);
    }, [props.singleData]);

    const handleStepChange = (index: number, value: string) => {
        const updated = [...steps];
        updated[index] = value;
        setSteps(updated);
    };

    const addStep = () => {
        setSteps(prev => [...prev, '']);
    };

    const removeStep = (index: number) => {
        setSteps(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: IFormData) => {
        setLoading(true);

        // join steps into comma-separated string
        data.stepsToExecute = steps.filter(s => s.trim() !== '').join(', ');

        const method = props.singleData?.score_ID ? "PUT" : "POST";
        const message = props.singleData?.score_ID ? " updated successfully." : "Posted successfully.";
        const response = await Fetch("testCase", method, data, null, props.toast);
        if (response) {
            props.setReload(true);
            props.hideDialog();
            props.toast.current.show({ severity: 'success', detail: message, life: 3000 });
        }
        setLoading(false);
    };

    const onHide = () => {
        props.hideDialog();
        reset(emptyFormData);
        setSteps(['']);
    };

    return (
        <Dialog visible={props.open} style={{ width: '85vw' }} header="Add/Edit Test Cases" modal className="p-fluid" onHide={onHide}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid formgrid grid">
                <QAInput required name='module' control={control} label='Module' error={errors.module?.message} />
                <QAInput required name='subModule' control={control} label='Sub Module' error={errors.subModule?.message} />
                <QAInput required name='scenario' control={control} label='Scenario' error={errors.scenario?.message} />
                <QAInput required name='description' control={control} label='Description' error={errors.description?.message} />

                {/* Test Type */}
                <div className="col-12 md:col-6 mb-3">
                    <label className="font-lg mb-2">
                        Test Type <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className="flex gap-4 mt-2">
                        <div className="flex align-items-center">
                            <input
                                type="radio"
                                checked={watch('testType') === true}
                                onChange={() => setValue('testType', true, { shouldValidate: true })}
                            />
                            <label className="ml-2">Positive</label>
                        </div>
                        <div className="flex align-items-center">
                            <input
                                type="radio"
                                checked={watch('testType') === false}
                                onChange={() => setValue('testType', false, { shouldValidate: true })}
                            />
                            <label className="ml-2">Negative</label>
                        </div>
                    </div>
                    {errors.testType && <small className="p-error">{errors.testType.message}</small>}
                </div>

                {/* Steps To Execute */}
                <div className="col-12">
                    <label className="mb-2 flex items-center gap-1">
                        Steps To Execute <span className="text-red-500">*</span>
                    </label>

                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={step}
                                onChange={(e) => handleStepChange(index, e.target.value)}
                                className="p-inputtext p-component flex-1"
                                placeholder={`Step ${index + 1}`}
                            />
                            {steps.length > 1 && (
                                <Button
                                    type="button"
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger p-button-sm"
                                    onClick={() => removeStep(index)}
                                    tooltip="Remove Step"
                                />
                            )}
                            {index === steps.length - 1 && (
                                <Button
                                    type="button"
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-success p-button-sm"
                                    onClick={addStep}
                                    tooltip="Add Step"
                                />
                            )}
                        </div>
                    ))}

                    {errors.stepsToExecute && (
                        <small className="p-error">{errors.stepsToExecute.message}</small>
                    )}
                </div>


                <QAInput required name='preconditions' control={control} label='Preconditions' error={errors.preconditions?.message} />
                <QAInput required name='expectedResult' control={control} label='Expected Result' error={errors.expectedResult?.message} />
                <QAInput required name='actualResult' control={control} label='Actual Result' error={errors.actualResult?.message} />

                {/* Status */}
                <div className="col-12 md:col-6">
                    <label className="font-lg mb-2">
                        Status <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className="flex gap-4 mt-2">
                        <div className="flex align-items-center">
                            <input
                                type="radio"
                                checked={watch('status') === true}
                                onChange={() => setValue('status', true, { shouldValidate: true })}
                            />
                            <label className="ml-2">Pass</label>
                        </div>
                        <div className="flex align-items-center">
                            <input
                                type="radio"
                                checked={watch('status') === false}
                                onChange={() => setValue('status', false, { shouldValidate: true })}
                            />
                            <label className="ml-2">Fail</label>
                        </div>
                    </div>
                    {errors.status && <small className="p-error">{errors.status.message}</small>}
                </div>

                <QAInput required name='comment' control={control} label='Comment' error={errors.comment?.message} />

                <div className="col-12 md:col-12 flex gap-4">
                    <Button type="submit" loading={loading} className="mr-2" rounded>Save</Button>
                    <Button type="button" onClick={() => reset()} className="mr-2 btn btn-grey" severity="secondary" rounded>Cancel</Button>
                </div>
            </form>
        </Dialog>
    );
};
