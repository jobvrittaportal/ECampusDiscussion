import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { IModal } from "./Page";
import { Fetch } from "../../shared/Fetch";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Search } from "../../shared/Search";
import { format } from "date-fns";

export interface IPage {
    id?: number,
    name: string,
    label?: string,
    url?: string,
    description?: string,
    isFeature?: boolean,
    parentId?: number,
    parent?: string
};

interface Iprops {
    setModal: (modal: IModal) => void,
    hasPermission: (pageName: string, featureName?: string) => boolean,
    toast: any,
    reload: Boolean
}

export const EmptyPage: IPage = {
    id: undefined,
    name: "",
    label: "",
    isFeature: false,
    url: "",
    parentId: undefined
}

export const Table = (props: Iprops) => {
    const [text, setText] = useState<string | null>(null);
    const [initialPages, setInitialPages] = useState([] as IPage[]);
    const [tableData, setTableData] = useState({ data: [], loading: false } as { data: IPage[], loading: boolean });
    const dt = useRef<any>(null);
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const openNew = () => {
        props.setModal({ open: true, singleData: EmptyPage });
    };
    const openAddNewFeature = (rowData: IPage) => {
        props.setModal({ open: true, singleData: { ...EmptyPage, isFeature: true, parentId: rowData.id } });
    }
    const openEdit = (rowData: IPage) => {
        props.setModal({ open: true, singleData: rowData });
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-4">
            <div className="flex gap-4 w-full">
                {/* {props.hasPermission("Page", "Add") && ( */}
                    <Button style={{ width: '80px', height: '30px' }} label="New" icon="pi pi-plus" className="p-button-sm p-button-rounded p-button-success" onClick={openNew} />
                {/* )} */}
                <div className="w-full flex align-items-center justify-content-center">
                    <h4 style={{ margin: 0, textTransform: 'uppercase', fontFamily: 'Rancho', letterSpacing: 1 }}>Page & Feature</h4>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="p-input-icon-left">
                    <Search setSearch={setText} />
                </div>
                {props.hasPermission("Page", "Export") && (
                    <Button style={{ width: '80px', height: '30px' }} label="Export" icon="pi pi-upload" className="p-button-sm p-button-rounded p-button-help" onClick={exportCSV} />
                )}
            </div>
        </div>
    );

    const Remove = async (rowData: IPage) => {
        setTableData((prev) => ({ ...prev, loading: true, }));
        const response = await Fetch(`page`, "DELETE", null, `pageId=${rowData.id}`, props.toast);
        if (response) {
            props.toast.current.show({ severity: 'success', detail: "Page/Feature Deleted", life: 3000 });
            loadTableData();
        }
    }

    const rejectFunc = () => { }

    const confirmDelete = (rowData: IPage) => {
        confirmDialog({
            message: rowData.isFeature
                ? `Are you sure you want to delete the feature "${rowData.name}"?`
                : `Deleting the page "${rowData.name}" will also remove all its associated features. Are you sure you want to proceed?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => Remove(rowData),
            reject: () => rejectFunc()
        });
    }

    const action = (rowData: IPage) => {
        return (
            <div className="flex gap-3">
                {props.hasPermission("Page", "Edit") && <Button icon="pi pi-pencil" className='p-button-success p-button-text p-0' onClick={() => openEdit(rowData)}></Button>}
                {props.hasPermission("Page", "Remove") && <Button icon="pi pi-trash" className='p-button-danger p-button-text p-0' onClick={() => { confirmDelete(rowData) }} ></Button>}
                {/* {(!rowData.isFeature && props.hasPermission("Page", "Add")) && <Button icon="pi pi-plus" className='p-button-success p-button-text p-0' onClick={() => openAddNewFeature(rowData)}></Button>} */}
                <Button icon="pi pi-plus" className='p-button-success p-button-text p-0' onClick={() => openAddNewFeature(rowData)}></Button>
            </div>
        );
    }

    const orderFeatureUnderPageAndFilterByPageName = (pages: IPage[], pageName: string | null): IPage[] => {
        let parentPages: IPage[];
        if (pageName)
            parentPages = pages.filter(p => !p.isFeature && p.name?.toLowerCase().includes(pageName.toLowerCase()));
        else
            parentPages = pages.filter(p => !p.isFeature);
        const orderedPages: IPage[] = [];
        parentPages.forEach(p => {
            orderedPages.push(p);
            pages.forEach(f => {
                if (f.parentId === p.id) { orderedPages.push(f); }
            });
        });
        return orderedPages;
    }

    const loadTableData = async () => {
        setTableData((prev) => ({ ...prev, loading: true, }));
        const response = await Fetch("page", "GET", null, null, props.toast);
        if (response) {
            const data: IPage[] = await response.json();
            setInitialPages(data);
            setTableData({ data: orderFeatureUnderPageAndFilterByPageName(data, text), loading: false });
        }
    }

    useEffect(() => {
        if (initialPages.length > 1) {
            setTableData({ data: orderFeatureUnderPageAndFilterByPageName(initialPages, text), loading: false });
        }
    }, [text]);

    useEffect(() => {
        loadTableData();
    }, [props.reload]);

    const decideBg = (rowData: IPage) => {
        if (rowData.isFeature) {
            return 'surface-300';
        } else {
            return '';
        }
    };

    return (
        <>
            <DataTable style={{ border: '1px solid rgba(105,105,105,0.17)', borderTopWidth: "0" }}
                ref={dt} size="small" stripedRows scrollable scrollHeight="75vh" exportFilename={format(new Date(), 'dd-MM-yyyy hh_mm_ss a').toUpperCase()}
                value={tableData.data}
                header={header}
                loading={tableData.loading}
                rowClassName={decideBg}
            >
                <Column field="name" header="Page/Feature" />
                <Column field="label" header="Label" />
                <Column field="url" header="URL" />
                <Column field="description" header="Description" />
                <Column field="" header="Action" body={action} />
            </DataTable>
            <ConfirmDialog />
        </>
    );
}