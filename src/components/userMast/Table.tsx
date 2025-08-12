import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, SortOrder } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import { Fetch } from "../../shared/Fetch";
import { EmptyUser } from "./EmptyUser";
import { IModel, IUserMast } from "./UserMast";
import { format } from "date-fns";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Filter, FilterValues, initialFilter } from "./Filter";
import { Search } from "../../shared/Search";
import { Dialog } from "primereact/dialog";

interface Iprops {
    setModal: (modal: IModel) => void,
    toast: any,
    reload: boolean,
    setReload: (is: boolean) => void,
    hasPermission: (pageName: string, featureName?: string) => Boolean,
}

interface ILazyParams {
    first: number;
    rows: number;
    page: number;
    sortField: string;
    sortOrder: SortOrder;
}

export const Table = (props: Iprops) => {

    const [tableData, setTableData] = useState({ tableData: [], loading: false } as { tableData: Array<IUserMast>, loading: boolean });
    const [attendanceTable, setAttendanceTable] = useState({ user_id: 0, open: false } as { user_id: number, open: boolean });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<FilterValues>(initialFilter);
    const [filter2, setFilter2] = useState<boolean>(false);

    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [tableData1, setTableData1] = useState<IUserMast[]>([])
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [filterDialogVisible, setFilterDialogVisible] = useState(false);

    const dt = useRef<any>(null);
    let loginData: any = null;

    const loginObj = sessionStorage.getItem('loginData');

    if (loginObj) {
        loginData = JSON.parse(loginObj);
    }
    const [lazyParams, setLazyParams] = useState<ILazyParams>({
        first: 0,
        rows: 25,
        page: 1,
        sortField: 'login_ID',
        sortOrder: -1
    });
    const toast = useRef<any>(null);


    const getTableDataCount = async () => {
        const response = await Fetch("User_Mast/count", "GET", null, `filter=${globalFilter}&filters=${JSON.stringify(filter)}`, props.toast);
        if (response) {
            const count: number = parseInt(await response.text(), 10);
            setTotalRecords(count);
        }
    }

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


    // const onPage = (event: any) => {
    //     setLazyParams({
    //         ...lazyParams,
    //         first: event.first,
    //         rows: event.rows,
    //         page: event.page,
    //     });
    // };

    // const onSort = (event: any) => {
    //     setLazyParams({
    //         ...lazyParams,
    //         sortField: event.sortField,
    //         sortOrder: event.sortOrder,
    //     });
    // };

    // useEffect(() => {
    //     loadTableData();
    // }, [props.reload, lazyParams, filter]);

    const exportCSV = () => {
        dt.current.exportCSV();
    };


    // const loadTableData = async () => {
    //     setLoading(true);
    //     const response = await Fetch("User_Mast", "GET", null, `lazyParams=${JSON.stringify(lazyParams)}&filter=${JSON.stringify(filter)}`, props.toast);
    //     if (response) {
    //         const data = await response.json();
    //         setTableData(data.userMastpaginator);
    //         setTotalRecords(data.totalRecords);
    //         setLoading(false);
    //     } else {
    //         setLoading(false);
    //     }
    // }

    const loadTableData = async () => {
        setTableData({ tableData: tableData.tableData, loading: true });
        setLoading(true);
        const response = await Fetch("User_Mast", "GET", null, `lazyParams=${JSON.stringify(lazyParams)}&filters=${JSON.stringify(filter)}&filter=${globalFilter}`, props.toast);
        if (response) {
            const data: Array<IUserMast> = await response.json();
            setTableData({ tableData: data, loading: false });
            setLoading(false);
        } else {
            setTableData({ tableData: tableData.tableData, loading: false });
            setLoading(false);
        }
    }


    const openNew = () => {
        props.setModal({ open: true, singleData: EmptyUser });
    };


    const openEdit = (rowDatauser: IUserMast) => {
        props.setModal({ open: true, singleData: rowDatauser });
    };


    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-lg text-900 font-bold">Manage Users</span>
            <div className="flex align-items-end gap-2">
                <Button icon="pi pi-filter" rounded raised className="p-button-text h-2rem" onClick={() => setFilterDialogVisible(true)} tooltip="Filter" tooltipOptions={{ position: 'top' }} />
                <Button label="New" icon="pi pi-plus" className="p-button mr-2 mt-1 h-2rem" onClick={openNew} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help h-2rem" onClick={exportCSV} />

            </div>
        </div>
    );


    const actionBodyTemplate = (rowData: IUserMast) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil text-primary" className="p-button-rounded p-button-text mr-1" onClick={() => openEdit(rowData)} />
            </div>
        );
    };

    const toggleVal = async (id: number) => {
        setTableData({ tableData: tableData.tableData, loading: true });
        const response = await Fetch("User_Mast/togglestatus", "PUT", null, `Id = ${id}`, props.toast);
        if (response) {
            props.setReload(!props.reload);
            props.toast.current.show({ severity: 'success', detail: "Status Changes", life: 3000 });
        } else setTableData({ tableData: tableData.tableData, loading: false });
    };

    const user_Status = (rowData: IUserMast) => {
        return (
            <span className="cursor-pointer" style={{ color: rowData.user_Status ? 'teal' : 'red' }} onClick={() => { if (rowData.id) toggleVal(rowData.id) }}>{rowData.user_Status ? "Active" : "InActive"}</span>
        );
    };

    const cDate = (rowData: any) => {
        let date;
        if (rowData.created_On) date = format(new Date(rowData.created_On), 'dd/MM/yyyy').toUpperCase();
        else date = "";
        return (<>{date}</>);
    };


    const toggleVal1 = async (login_ID?: number) => {
        const response = await Fetch("User_Mast/togglestatus", "PUT", null, `employeeID=${login_ID}`, props.toast);
        if (response) {
            let message: string = " Status Changzed";
            props.toast.current.show({ severity: 'success', detail: message, life: 3000 });
            loadTableData();
        }
    };


    const activeStatus = (rowData: any) => {
        return (
            loginData?.permissions?.Employee?.Active_Inactive_Status ?
                <span style={{ color: rowData.user_Status == true ? 'teal' : 'red' }} className="cursor-pointer" onClick={() => { toggleVal1(rowData.login_ID) }}>{rowData.user_Status ? "Active" : "InActive"}</span> :
                <span style={{ color: rowData.user_Status == true ? 'teal' : 'red' }}  >{rowData.user_Status ? "Active" : "InActive"}</span>

        );
    };

    useEffect(() => {
        getTableDataCount();
        loadTableData();
    }, [globalFilter, lazyParams, props.reload]);

    useEffect(() => {
        getTableDataCount();
        loadTableData();
    }, [filter]);

    return (
        <>

            <Dialog header="Filter Employee" visible={filterDialogVisible} style={{ width: '40vw', height: '90vh' }} onHide={() => setFilterDialogVisible(false)} draggable={false} resizable={false} position="right">
                <Filter filter={filter} setFilter={(f: FilterValues) => { setFilter(f); setFilter2(!filter2); setFilterDialogVisible(false); }} />
            </Dialog>
            <DataTable style={{ border: '1px solid rgba(105,105,105,0.17)', borderTopWidth: "0" }}
                ref={dt} size="small" exportFilename={format(new Date(), 'dd-MM-yyyy hh_mm_ss a').toUpperCase()}
                value={tableData.tableData} lazy dataKey="id"
                paginator first={lazyParams.first} rows={lazyParams.rows} rowsPerPageOptions={[25, 50, 100, 200]}
                totalRecords={totalRecords} onPage={onPage}
                onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                emptyMessage="No Users found."
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                header={header}
                loading={tableData.loading}
            >
                <Column field="user_EmailID" header="EmailID" sortable />
                {/* <Column field="password" header="Password" sortable /> */}
                <Column field="login_Name" header="User Name" sortable />
                <Column field="branchName" header="Branch Name" sortable />
                <Column field="companyName" header="Company Name" sortable />

                {/* <Column field="" header="Created On" sortable body={cDate} /> */}
                <Column field="" header="User Status" sortable body={activeStatus} />
                <Column body={actionBodyTemplate} />
                {/* <Column header="History" body={(rowData) => <i className="cursor-pointer text-primary pi pi-clock" onClick={() => setAttendanceTable({ user_id: rowData.login_ID, open: true })}></i>} /> */}
            </DataTable>


        </>
    );
}
