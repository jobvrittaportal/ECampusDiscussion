import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Fetch } from "../../shared/Fetch";
import { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { IRole } from "./Form";

interface IPagePermission {
    id: number,
    name: string,
    lable?: string,
    url?: string,
    description?: string,
    isFeature: boolean,
    parentId?: number,
    parent?: string,
    permission: boolean
}

interface Iprops {
    data: IRole,
    open: boolean,
    hideDialog: () => void,
    toast: any,
}

interface IPagePerm {
    pageId: number,
    permission: boolean
}

export const PagePermissionForm = (props: Iprops) => {
    const [tableData, setTableData] = useState({ tableData: [], loading: true } as { tableData: IPagePermission[], loading: boolean });

    const saveToDB = async () => {
        const data: IPagePerm[] = tableData.tableData.map(item => ({
            pageId: item.id,
            permission: item.permission
        }));
        const response = await Fetch(`page/permission/${props.data.id}`, "POST", data, null, props.toast);
        if (response) {
            props.hideDialog();
            props.toast.current.show({ severity: 'success', detail: "Updated Successfully", life: 3000 });
        }
    }

    const loadTableData = async () => {
        setTableData({ tableData: [], loading: true });
        const response = await Fetch(`page/permission/${props.data.id}`, "GET", null, null, props.toast);
        if (response) {
            const data: Array<IPagePermission> = await response.json();
            setTableData({ tableData: data, loading: false });
        }
    }

    useEffect(() => {
        if (props.open) {
            loadTableData();
        }
    }, [props.open]);

    const onHide = () => {
        props.hideDialog();
    }

    const onCheckChange = (rowData: IPagePermission) => {
        setTableData(prevState => ({
            ...prevState,
            tableData: prevState.tableData.map(d =>
                d.id === rowData.id ? { ...d, permission: !d.permission } : d
            ),
            loading: false
        }));
    };

    const footerTemplate = () => {
        return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '10px', marginTop: '5px' }}>
            <Button className="p-button-rounded p-button-sm my-1" label="SAVE" onClick={saveToDB} type="button"></Button>
            <Button className="p-button-rounded p-button-sm p-button-outlined my-1" label="CLOSE" type="button" onClick={onHide}></Button>
        </div>
    }

    return (
        <Dialog visible={props.open} style={{ width: '80vw' }} header={<span style={{ fontWeight: '500', color: 'white', background: 'var(--gray-700)', padding: '1px 5px', borderRadius: '2px' }}>{props.data.name}</span>} footer={footerTemplate} className="p-fluid" onHide={onHide}>
            <div className="bg-white">
                {tableData.tableData
                    .filter((page) => !page.isFeature)
                    .map((parent) => (
                        <div key={parent.id} className="mb-4">
                            <div className="flex items-center justify-between bg-gray-300 p-2 rounded">
                                <span className="font-semibold">{parent.name}</span>
                                <Checkbox className="ml-2" checked={parent.permission} onChange={() => onCheckChange(parent)} />
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2 ml-4">
                                {tableData.tableData
                                    .filter((feature) => feature.parentId === parent.id)
                                    .map((feature) => (
                                        <div key={feature.id}
                                            className="flex items-center border px-3 py-1 rounded-md bg-gray-100">
                                            <span className="text-gray-700">{feature.name}</span>
                                            <Checkbox className="ml-2" checked={feature.permission} onChange={() => onCheckChange(feature)} />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
            </div>
        </Dialog>
    );
}
