import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { Form, IRole } from "./Form";
import { Table } from "./Table";
import useToggle from "../../hooks/useToggle";

export interface IModel {
    open: boolean,
    singleData: IRole
}

export const Role = ({ hasPermission }: { hasPermission: (pageName: string, featureName?: string) => boolean }) => {

    const [modal, setModal] = useState({ singleData: {}, open: false } as IModel);
    const [reload, reloadData] = useToggle();
    const toast = useRef<any>(null);

    const hideDialog = () => {
        setModal({ singleData: { name: "" }, open: false })
    };

    return (
        <>
            {/* {(hasPermission("Role", "Add") || hasPermission("Role", "Edit")) && <Form singleData={modal.singleData} open={modal.open} hideDialog={hideDialog} toast={toast} reloadData={reloadData}></Form>} */}
            <Form singleData={modal.singleData} open={modal.open} hideDialog={hideDialog} toast={toast} reloadData={reloadData}></Form>
            <Table hasPermission={hasPermission} setModal={setModal} toast={toast} reload={reload}></Table>
            <Toast ref={toast} />
        </>
    );
}
    