import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Controller, useForm } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { Fetch, ILazyParams } from '../../shared/Fetch';
import { useState, useEffect, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { QAInput } from '../../shared/QAInput';
import { ConfirmDialog } from 'primereact/confirmdialog';

interface Iprops {
    toast: any;
    setModal: (modal: any) => void;
    reload: boolean;
    hasPermission: (pageName: string, featureName?: string) => Boolean;
}

interface IDiscussionMast {
    discussion: string;
    id?: number;
    created_At?: string;
    createdByName?: string;
    discussion_Title?: string;
}

const emptyForm: IDiscussionMast = { discussion: "",discussion_Title:"" };

const schema = yup.object({
    discussion: yup.string().required("Discussion is required"),
});

export const Table = (props: Iprops) => {
    const [submitting, setSubmitting] = useState(false);
    const [discussions, setDiscussions] = useState<IDiscussionMast[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<IDiscussionMast | null>(null);

    const initialParams: ILazyParams = {
        first: 0,
        rows: 5,
        page: 1,
        sortField: 'id',
        sortOrder: -1
    };
    const [lazyParams, setLazyParams] = useState<ILazyParams>(initialParams);

    const { control, handleSubmit, formState: { errors }, reset } = useForm<IDiscussionMast>({
        resolver: yupResolver(schema),
        shouldFocusError: false,
    });

    const loadTableData = async (params: ILazyParams = lazyParams, append = false) => {
        setLoading(true);
        try {
            const response = await Fetch("Discussion_Mast", "GET", null, `lazyParams=${encodeURIComponent(JSON.stringify(params))}`, props.toast);
            if (response) {
                const data = await response.json();
                setTotalRecords(data.count || 0);
                if (append) {
                    setDiscussions(prev => {
                        const merged = [...prev, ...(data.discussion || [])];
                        return merged.filter((item, index, arr) =>
                            arr.findIndex(i => i.id === item.id) === index
                        );
                    });
                } else {
                    setDiscussions(data.discussion || []);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const Remove = async (rowData: IDiscussionMast) => {
        const response = await Fetch(`Discussion_Mast/${rowData.id}`, "DELETE", null, null, props.toast);
        if (response) {
            props.toast.current.show({ severity: 'success', detail: "Deleted", life: 3000 });
            setLazyParams(initialParams);
            await loadTableData(initialParams, false);
        }
    };

    useEffect(() => {
        loadTableData(initialParams, false);
        setLazyParams(initialParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveToDB = async (body: IDiscussionMast) => {
        setSubmitting(true);
        try {
            const response = await Fetch(`Discussion_Mast`, "POST", body, null, props.toast);
            if (response) {
                props.toast.current.show({ severity: 'success', detail: "Added Successfully", life: 3000 });
                reset(emptyForm);
                setLazyParams(initialParams);
                await loadTableData(initialParams, false);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleShowMore = async () => {
        if (loading || discussions.length >= totalRecords) return;
        const nextParams: ILazyParams = {
            ...lazyParams,
            first: lazyParams.first + lazyParams.rows,
            page: (lazyParams.page || 1) + 1
        };
        await loadTableData(nextParams, true);
        setLazyParams(nextParams);
    };

    return (
        <div style={{ padding: "1rem" }}>
            <ConfirmDialog
                visible={!!deleteTarget}
                onHide={() => setDeleteTarget(null)}
                message="Are you sure you want to delete this discussion?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                acceptClassName="p-button-danger"
                accept={() => {
                    if (deleteTarget) Remove(deleteTarget);
                    setDeleteTarget(null);
                }}
                reject={() => setDeleteTarget(null)}
            />

            {/* Form */}
            <form onSubmit={handleSubmit(saveToDB)} className="p-fluid formgrid grid mb-4">
                <div className="field col-12 md:col-3">
                    <QAInput
                        column={1}
                        label="Title"
                        control={control}
                        name="discussion_Title"
                    />
                </div>

                <div className="field col-12 md:col-9">
                    <label htmlFor="discussion">Add Discussion</label>
                    <Controller
                        name="discussion"
                        control={control}
                        render={({ field }) => (
                            <InputTextarea
                                {...field}
                                rows={3}
                                style={{ width: "100%" }}
                                placeholder="Write your discussion..."
                            />
                        )}
                    />
                    {errors.discussion && (
                        <small style={{ color: "red" }}>
                            {errors.discussion.message}
                        </small>
                    )}
                </div>

                <div className="col-12 flex gap-3 justify-content-end mt-2">
                    <Button
                        loading={submitting}
                        label="SAVE"
                        type="submit"
                        className="p-button-rounded"
                    />
                    <Button
                        label="CLEAR"
                        onClick={() => reset(emptyForm)}
                        type="button"
                        className="p-button-rounded p-button-outlined surface-200"
                    />
                </div>
            </form>

            {/* Cards */}
            <h4>Previous Discussions</h4>
            {loading && <p>Loading...</p>}
            {!loading && discussions.length === 0 && (
                <p style={{ color: "#888" }}>No discussions yet.</p>
            )}
            {discussions.map((d) => (
                <Card
                    key={d.id}
                    className="mb-3 shadow-2"
                    style={{ borderRadius: "10px", padding: "1rem", position: "relative" }}
                >
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger p-button-text"
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                        }}
                        onClick={() => setDeleteTarget(d)}
                        tooltip="Delete"
                        tooltipOptions={{ position: 'top' }}
                    />
                    <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                        {d.discussion_Title}
                    </div>
                    <div style={{ whiteSpace: "pre-wrap" }}>
                        {d.discussion}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "8px",
                            fontSize: "0.95rem",
                            color: "#444",
                        }}
                    >
                        <span>
                            By <strong>{d.createdByName}</strong> on{" "}
                            <span
                                style={{
                                    backgroundColor: "#f0f8ff",
                                    color: "#0077b6",
                                    padding: "2px 6px",
                                    borderRadius: "6px",
                                    fontWeight: "500",
                                }}
                            >
                                {new Date(d.created_At!).toLocaleString()}
                            </span>
                        </span>
                    </div>
                </Card>
            ))}

            {discussions.length < totalRecords && (
                <div className="flex justify-content-center mt-3">
                    <Button
                        label="Show More"
                        onClick={handleShowMore}
                        className="p-button-rounded p-button-info"
                        disabled={loading}
                    />
                </div>
            )}
        </div>
    );
};
