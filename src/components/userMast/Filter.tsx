import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { QAInput } from '../../shared/QAInput';
import { Button } from 'primereact/button';
import { QADropdown } from '../../shared/QADropdown';
import { QACheckbox } from '../../shared/QACheckbox';
// import { IBranchMastDropdown, ICompanyMastDropdown } from '../../models/IDropdown';
import { Fetch } from '../../shared/Fetch';



export interface FilterValues {
    email?: string | null;
    user_Name?: string | null;
    status?: boolean | null;
    isToDelete?: boolean | null;
    company: number | null,
    branch: number | null,


}
export const initialFilter: FilterValues = {
    email: "",
    user_Name: "",
    status: null,
    isToDelete: null,
    company: null,
    branch: null,
};
const schema = yup.object().shape({
    email: yup.string().nullable(),
    user_Name: yup.string().nullable(),
    status: yup.boolean().nullable(),
    isToDelete: yup.boolean().nullable(),
    company: yup.number().nullable(),
    branch: yup.number().nullable(),
});

interface Iprops {
    filter: FilterValues,
    setFilter: (filter: FilterValues) => void,
}

export const Filter = (props: Iprops) => {
    const [loading, setLoading] = useState(false);
    // const [companies, setCompanies] = useState<Array<ICompanyMastDropdown>>();
    // const [branches, setBranches] = useState<Array<IBranchMastDropdown>>();
    // const [employees, setEmployees] = useState([]);
    const loginObj = JSON.parse(sessionStorage.getItem('loginData') || "");
    const Status = [
        { label: "--Select--", status: null },
        { label: "Active", status: true },
        { label: "Inactive", status: false }
    ];
    const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FilterValues>({
        resolver: yupResolver(schema as any),
        defaultValues: {}
    });


    // const loadBranches = async (company?: number | null | undefined) => {
    //     let queryParam = company ? `company_id=${company}` : null;
    //     const response = await Fetch("Dropdown/branches", "GET", null, queryParam, null);
    //     if (response) {
    //         const data: Array<IBranchMastDropdown> = await response.json();
    //         const emptyData = {
    //             branch_ID: 0,
    //             branchName: "-- SELECT --",
    //             company_ID: 0
    //         };
    //         data.unshift(emptyData);
    //         setBranches(data);
    //     }
    // }
    // const loadCompanies = async () => {
    //     const response = await Fetch("Dropdown/company", "GET", null, null, null);
    //     if (response) {
    //         const data: Array<ICompanyMastDropdown> = await response.json();
    //         const emptyData = {
    //             company_ID: 0,
    //             company_Name: "-- SELECT --"
    //         };
    //         data.unshift(emptyData);
    //         setCompanies(data);
    //     }
    // }

    const onSubmit = (data: FilterValues) => {
        // console.log(data);
        setLoading(true);
        props.setFilter(data);
        setLoading(false);
    }

    // useEffect(() => {
    //     loadCompanies();
    //     loadBranches();
    //     //loadRoles();
    // }, []);

    // useEffect(() => {
    //     const subscription = watch((value, { name, type }) => {
    //         if (name === "company") {
    //             if (value.company != 0 && value.company != null) {
    //                 loadBranches(value.company);
    //             } else {
    //                 loadBranches();
    //             }
    //         }
    //     });

    //     return () => subscription.unsubscribe();
    // }, [watch]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid formgrid grid">
            <QAInput column={2} label='Email' control={control} name='email' />
            <QAInput column={2} label='User Name' control={control} name='user_Name' />
            <QADropdown column={2} control={control} label="Status" name="status" options={Status} optionLabel="label" optionValue="status" placeholder="Select Status" />
            {/* <JVHRMSDropdown column={2} label="Company" control={control} name="company" options={companies} optionLabel="company_Name" optionValue="company_ID" placeholder="Select Company" />
            <JVHRMSDropdown column={2} label="Branch" control={control} name="branch" options={branches} optionLabel="branchName" optionValue="branch_ID" placeholder="Select Branch" /> */}
            {loginObj.roleId === 1 && <QACheckbox column={2} name="isToDelete" control={control} label="Is To Delete" />}

            <div className="col-12 md:col-12 flex gap-4">
                <Button type="submit" loading={loading} className="mr-2 h-1rem" rounded>Search</Button>
                <Button type="button" onClick={() => reset(initialFilter)} className="mr-2  btn-grey h-1rem" severity="secondary" rounded>Clear</Button>
            </div>
        </form >
    )
}
