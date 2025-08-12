import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { emptyFormData, Form, IFormData } from "./Form";
import { Table } from "./Table";

export interface IModal {
    open: boolean,
    singleData: IFormData
}

export const Project = ({ hasPermission }: { hasPermission: (pageName: string, featureName?: string) => boolean }) => {

    const [modal, setModal] = useState({ singleData: emptyFormData, open: false } as IModal);
    const [reload, setReload] = useState(false);
    const toast = useRef<any>(null);

    const hideDialog = () => {
        setModal({ singleData: emptyFormData, open: false })
    };


    return (
        <>
            <Form singleData={modal.singleData} open={modal.open} hideDialog={hideDialog} toast={toast} reload={reload} setReload={setReload} hasPermission={hasPermission}></Form>
            <Table setModal={setModal} toast={toast} reload={reload} hasPermission={hasPermission}></Table>
            <Toast ref={toast} />
        </>
    );
}
