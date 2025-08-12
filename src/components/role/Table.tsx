import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { Fetch, ILazyParams } from "../../shared/Fetch";
import { Search } from "../../shared/Search";
import { PagePermissionForm } from "./PagePermissionForm";
import { IModel } from "./RoleMast";
import { format } from "date-fns";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { IRole } from "./Form";

interface Iprops {
    setModal: (modal: IModel) => void,
    toast: any,
    reload: boolean,
    hasPermission: (pageName: string, featureName?: string) => boolean
}
export interface IModel2 {
    open: boolean,
    singleData: IRole
}

export const Table = (props: Iprops) => {
    const [modal2, setModal2] = useState({ singleData: {name:""}, open: false } as IModel2);
    const hideDialog2 = () => {
        setModal2({ singleData: {name:""}, open: false });
    };

    const [tableData, setTableData] = useState({ data: [], count: 0, loading: false } as { data: IRole[], count: number, loading: boolean });
    const [text, setText] = useState<string | null>(null);
    const dt = useRef<any>(null);
    const [lazyParams, setLazyParams] = useState<ILazyParams>({
        first: 0,
        rows: 25,
        page: 1,
        sortField: 'id',
        sortOrder: -1
    });

    useEffect(() => {
        loadTableData();
    }, [text, lazyParams, props.reload]);

    const onPage = (event: any) => {
        delete event.filters;
        delete event.multiSortMeta;
        setLazyParams(event);
    }

    const onSort = (event: any) => {
        delete event.filters;
        delete event.multiSortMeta;
        setLazyParams(event);
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const loadTableData = async () => {
        setTableData((prev) => ({ ...prev, loading: true, }));
        const response = await Fetch("role", "GET", null, `lazyParams=${JSON.stringify(lazyParams)}${text ? '&text=' + text : ''}`, props.toast);
        if (response) {
            const data: { roles: IRole[], count: number } = await response.json();
            setTableData({ data: data.roles, count: data.count, loading: false });
        } else {
            setTableData((prev) => ({ ...prev, loading: false, }));
        }
    }

    const openNew = () => {
        props.setModal({ open: true, singleData: {name:""} });
    };

    const openEdit = (rowDatauser: IRole) => {
        props.setModal({ open: true, singleData: rowDatauser });
    };

    const Remove = async (rowData: IRole) => {
        setTableData((prev) => ({ ...prev, loading: true, }));
        const response = await Fetch(`role/${rowData.id}`, "DELETE", null, null, props.toast);
        if (response) {
            props.toast.current.show({ severity: 'success', detail: "Role Deleted", life: 3000 });
            loadTableData();
        }
    }

    const rejectFunc = () => { }

    const confirmDelete = (rowData: IRole) => {
        confirmDialog({
            message: `Are you sure you want to delete role "${rowData.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => Remove(rowData),
            reject: () => rejectFunc()
        });
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-4">
            <div className="flex gap-4 w-full">
                {/* {props.hasPermission("Role", "Add") && ( */}
                    <Button style={{ width: '80px', height: '30px' }} label="New" icon="pi pi-plus" className="p-button-sm p-button-rounded p-button-success" onClick={openNew} />
                {/* )} */}
                <div className="w-full flex align-items-center justify-content-center">
                    <h4 style={{ margin: 0, textTransform: 'uppercase', fontFamily: 'Rancho', letterSpacing: 1 }}>Role</h4>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="p-input-icon-left">
                    <Search setSearch={setText} />
                </div>
                {props.hasPermission("Role", "Export") && (
                    <Button style={{ width: '80px', height: '30px' }} label="Export" icon="pi pi-upload" className="p-button-sm p-button-rounded p-button-help" onClick={exportCSV} />
                )}
            </div>
        </div>
    );

    const openEditPagePermission = (rowData: IRole) => {
        setModal2({ singleData: rowData, open: true });
    }

    const nameBodyTemplate = (rowData: IRole) => {
        return (
            <span onClick={() => openEditPagePermission(rowData)} className="cursor-pointer text-cyan-700 underline">
                {rowData.name}
            </span>
        );
    };

    const actionBodyTemplate = (rowData: IRole) => {
        return (
            <div className="actions">
                {props.hasPermission("Role", "Edit") && <Button icon="pi pi-pencil" className='p-button-success p-button-text p-0' onClick={() => openEdit(rowData)} />}
                {props.hasPermission("Role", "Remove") && <Button icon="pi pi-trash" className='p-button-danger p-button-text p-0' onClick={() => { confirmDelete(rowData) }}  ></Button>}
            </div>
        );
    };

    return (
        <>
            <DataTable style={{ border: '1px solid rgba(105,105,105,0.17)', borderTopWidth: "0" }}
                ref={dt} size="small" stripedRows scrollable scrollHeight="75vh" exportFilename={format(new Date(), 'dd-MM-yyyy hh_mm_ss a').toUpperCase()}
                value={tableData.data} lazy dataKey="id"
                paginator first={lazyParams.first} rows={lazyParams.rows} rowsPerPageOptions={[25, 50, 100, 200]}
                totalRecords={tableData.count} onPage={onPage}
                onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                header={header}
                loading={tableData.loading}
            >
                <Column field="id" header="Role ID" sortable />
                <Column field="name" header="Role Name" body={nameBodyTemplate} sortable />
                <Column field="desc" header="Description" />
                <Column body={actionBodyTemplate} />
            </DataTable>
            <PagePermissionForm data={modal2.singleData} open={modal2.open} hideDialog={hideDialog2} toast={props.toast}></PagePermissionForm>
            <ConfirmDialog />
        </>
    );
}
