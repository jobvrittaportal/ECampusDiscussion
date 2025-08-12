import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

import { EmptyUser } from "././EmptyUser";
import { Form } from "./Form";
import { Table } from "./Table";

export interface IUserMast {
    id?: number,
    login_ID?: number,
    user_EmailID: string,
    added_By?: number | null,
    user_Status?: boolean,
    created_On?: Date | null,
    login_Password?: string,
    login_Name: string,
    company:number | null,
    branch:number | null,

}
export interface IModel {
    open: boolean,
    singleData: IUserMast
}

export const UserMast = ({ hasPermission }: { hasPermission: (pageName: string, featureName?: string) => boolean }) => {

    const [modal, setModal] = useState({ singleData: EmptyUser, open: false } as IModel);
    const [reload, setReload] = useState(false);
    const toast = useRef<any>(null);

    const hideDialog = () => {
        setModal({ singleData: EmptyUser, open: false })
    };

    return (
        <>
            <Form singleData={modal.singleData} open={modal.open} hideDialog={hideDialog} toast={toast} reload={reload} setReload={setReload} hasPermission={hasPermission}></Form>
            <Table setModal={setModal} toast={toast} reload={reload} setReload={setReload} hasPermission={hasPermission}></Table>
            <Toast ref={toast} />
        </>
    );
}
