import { useRef, useState } from "react";
import { EmptyPage, IPage, Table } from "./Table"
import { Form } from "./Form";
import { Toast } from "primereact/toast";
import useToggle from "../../hooks/useToggle";

export interface IModal {
    singleData: IPage,
    open: boolean
}

export const Page = ({ hasPermission }: { hasPermission: (pageName: string, featureName?: string) => boolean }) => {
    const [modal, setModal] = useState({ singleData: {}, open: false } as IModal);
    const [reload, reloadData] = useToggle();
    const toast = useRef<any>(null);

    const hideDialog = () => {
        setModal({ singleData: EmptyPage, open: false });
    };

    return (
        <>
            {/* {(hasPermission("Page", "Add") || hasPermission("Page", "Edit")) && <Form singleData={modal.singleData} open={modal.open} hideDialog={hideDialog} toast={toast} reloadData={reloadData}></Form>} */}
            <Form singleData={modal.singleData} open={modal.open} hideDialog={hideDialog} toast={toast} reloadData={reloadData}></Form>
            <Table setModal={setModal} toast={toast} reload={reload} hasPermission={hasPermission}></Table>
            <Toast ref={toast} />
        </>
    );
}