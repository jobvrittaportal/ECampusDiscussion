import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useRef, useState } from "react";
import { Fetch, baseUrl } from "../../shared/Fetch";
import { EmptyUser } from "./EmptyUser";
import { Toast } from 'primereact/toast';
import { IUserMast } from "./UserMast";
import { QACheckbox } from "../../shared/QACheckbox";
import { QAMultiselect } from "../../shared/QAMultiselect";
import { IBranchMastDropdown, ICompanyMastDropdown, IRolesDropdown } from "../../models/IDropdown";
import { format } from "date-fns";
import { QADropdown } from "../../shared/QADropdown";
import { QAInput } from "../../shared/QAInput";
// import { ICompanyMast } from "../../models/ICompanyMast";


const schema = yup.object({
    user_EmailID: yup.string().required("UserEmailID is required*").email(),
    login_Name: yup.string().required("Login is required*"),
    company: yup.number().min(1, "Branch is required").required("Branch Name is required").nullable(),
    branch: yup.number().required("Company Name is required").nullable(),

});

interface Roles {
    role_ID: number
}
interface Branches {
    branch_ID: number
}
interface Companies {
    company_Id: number
}
interface Iprops {
    singleData: IUserMast,
    open: boolean,
    hideDialog: () => void,
    toast: any,
    reload: boolean,
    setReload: (is: boolean) => void,
    hasPermission: (pageName: string, featureName?: string) => Boolean,
}

export const Form = (props: Iprops) => {
    // const [companies, setCompanies] = useState<Array<ICompanyMastDropdown>>();
    // const [selectedCompanies, setSelectedCompanies] = useState<Array<ICompanyMastDropdown>>();
    // const [branches, setBranches] = useState<Array<IBranchMastDropdown>>();
    // const [selectedBranches, setSelectedBranches] = useState<Array<IBranchMastDropdown>>();
    const [roles, setRoles] = useState<Array<IRolesDropdown>>();
    const [selectedRoles, setSelectedRoles] = useState<Array<IRolesDropdown>>();
    const [loading, setLoading] = useState(false);
    const [branchName, setBranchName] = useState<any>([]);


    const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<IUserMast>({
        resolver: yupResolver(schema),
        defaultValues: props.singleData,
        shouldFocusError: false
    });

    const toast = useRef<Toast>(null);
    
    const saveToDB = async (body: IUserMast) => {
        setLoading(true);
        let formattedData = {
            login_Name: body.login_Name,
            user_EmailID: body.user_EmailID,
            login_Password: body.login_Password,
            created_On: body.created_On,
            added_By: body.added_By,
            branch: body.branch,
            company: body.company
        }

        const method = props.singleData.login_ID ? "PUT" : "POST";
        const message = props.singleData.login_ID ? "Updated Successfully" : "Added Successfully";

        const _roles: Array<Roles> = [];
        selectedRoles?.forEach(role => {
            _roles.push({ role_ID: role.role_ID });
        });
        // const _branches: Array<Branches> = [];
        // selectedBranches?.forEach(branch => {
        //     _branches.push({ branch_ID: branch.branch_ID });
        // });

        // const _companies: Array<Companies> = [];
        // selectedCompanies?.forEach(company => {
        //     _companies.push({ company_Id: company.company_ID });
        // });
        let query: null | string = null;
        if (_roles.length > 0) query = "roles=" + JSON.stringify(_roles);

        if (query === null) {
            props.toast.current.show({ severity: 'error', detail: "Select at least one Role", life: 3000 });
        } else {
            // if (_branches.length > 0) query = query + "&branches=" + JSON.stringify(_branches);
            // if (_companies.length > 0) query = query + "&companies=" + JSON.stringify(_companies);

            if (!props.singleData.login_ID) {
                const response = await Fetch("Employee_Personal_Details/createUserDetail", method, formattedData, query, props.toast);
                if (response) {
                    onHide();
                    props.toast.current.show({ severity: 'success', detail: message, life: 3000 });
                    props.setReload(!props.reload);
                }
            } else {
                const response = await Fetch("User_Mast", 'PUT', body, query, props.toast);
                if (response) {
                    onHide();
                    props.toast.current.show({ severity: 'success', detail: message, life: 3000 });
                    props.setReload(!props.reload);
                }
            }
        }
        setLoading(false);
    }

    // const loadcompany = async () => {
    //     const response = await Fetch("Dropdown/company", "GET", null, null, null);
    //     if (response) {
    //         const data = await response.json();
    //         setCompanies(data);
    //     }
    // }

    // const loadBranches = async () => {
    //     const response = await Fetch("Dropdown/branches", "GET", null, null, null);
    //     if (response) {
    //         const data: Array<IBranchMastDropdown> = await response.json();
    //         setBranches(data);
    //     }
    // }

    const branchData = async (companyID?: number) => {
        const response = await Fetch("Branch_Mast/DropDown", "GET", null, companyID ? `companyId=${companyID}` : null, null);
        if (response) {
            const data = await response.json();
            // console.log(data);
            setBranchName(data);
        }
    }

    const loadRoles = async () => {
        const response = await Fetch("Dropdown/roles", "GET", null, null, null);
        if (response) {
            const data: Array<IRolesDropdown> = await response.json();
            const _data: Array<IRolesDropdown> = [];
            data.forEach(d => {
                _data.push({ role_ID: d.role_ID, role_Name: d.role_Name });
            })
            setRoles(_data);
        }
    }

    const loadAssignedRoles = async (login_ID: number) => {
        const response = await Fetch("Dropdown/assignedRoles", "GET", null, `login_id=${login_ID}`, null);
        if (response) {
            const data: Array<IRolesDropdown> = await response.json();
            const _data: Array<IRolesDropdown> = [];
            data.forEach(d => {
                _data.push({ role_ID: d.role_ID, role_Name: d.role_Name });
            })
            setSelectedRoles(_data);

        }
    }
    // const loadAssignedBranches = async (login_ID: number) => {
    //     const response = await Fetch("Dropdown/assignedBranches", "GET", null, `login_id=${login_ID}`, null);
    //     if (response) {
    //         const data: Array<Branches> = await response.json();
    //         const _branches = branches?.filter(branch => {
    //             let is_included: boolean = false;
    //             for (let i = 0; i < data.length; i++) {
    //                 if (branch.branch_ID === data[i].branch_ID) {
    //                     is_included = true;
    //                     break;
    //                 }
    //             }
    //             return is_included;
    //         });
    //         setSelectedBranches(_branches);
    //     }
    // }
    // const loadAssignedCompanies = async (login_ID: number) => {
    //     const response = await Fetch("Dropdown/assignedCompanies", "GET", null, `login_id=${login_ID}`, null);
    //     if (response) {
    //         const data: Array<Companies> = await response.json();
    //         // console.log(data);
    //         // console.log(companies);
    //         const _assingCompanies = companies?.filter(company => {
    //             let is_included: boolean = false;
    //             for (let i = 0; i < data.length; i++) {
    //                 if (company.company_ID === data[i].company_Id) {
    //                     is_included = true;
    //                     break;
    //                 }
    //             }
    //             return is_included;
    //         });
    //         setSelectedCompanies(_assingCompanies);
    //     }
    // }

    useEffect(() => {
        // loadcompany();
        // loadRoles();
        // loadBranches();
        branchData(props.singleData?.company || 0);
    }, []);


    const onHide = () => {
        props.hideDialog();
        reset(EmptyUser);
        setSelectedRoles(undefined);
        // setSelectedBranches(undefined);
        // setSelectedCompanies(undefined);
    }

    function onSubmit(data: IUserMast) {
        const _roles: Array<Roles> = [];
        selectedRoles?.forEach(role => {
            _roles.push({ role_ID: role.role_ID });
        });
        // console.log(_roles);
        const HRrole = _roles.some(r => r.role_ID === 2)
        // if (HRrole && (!selectedBranches || selectedBranches.length === 0)) {
        //     props.toast.current.show({ severity: 'error', detail: "Please select at least one Branch", life: 3000 });
        // } else {
            saveToDB(data);
        // }

    }

    useEffect(() => {
        reset(props.singleData);
        if (props.singleData.login_ID) {
            loadAssignedRoles(props.singleData.login_ID);
            // loadAssignedBranches(props.singleData.login_ID);
            // loadAssignedCompanies(props.singleData.login_ID);
        } else {
            setSelectedRoles([]);
        }
        branchData(props.singleData?.company || 0);
    }, [props.singleData]);

    useEffect(() => {
        reset(props.singleData)
    }, [props.singleData])



    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === "company") {
                if (value.company != null) {
                    branchData(Number(value.company || "0"));
                } else {
                    branchData();
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);



    return (
        <Dialog visible={props.open} style={{ width: '80vw' }} header="Add/Edit User" modal className="p-fluid" onHide={onHide}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid formgrid grid">
                <QAInput required label="Email" control={control} name="user_EmailID" error={errors.user_EmailID?.message} />
                <QAInput required label="Password" control={control} name="login_Password" error={errors.login_Password?.message} />
                <QAInput required label="Name" control={control} name="login_Name" error={errors.login_Name?.message} />
                {/* <JVMultiselect label="Assign Roles" options={roles} optionLabel="role_Name" placeholder="Select Roles" required value={selectedRoles} onChange={setSelectedRoles} /> */}
                {/* <JVMultiselect label="Assign Companies" options={companies} optionLabel="company_Name" placeholder="Select Companies" value={selectedCompanies} onChange={setSelectedCompanies} /> */}
                {/* <JVHRMSDropdown required name="company" control={control} placeholder="--Select US Company--" options={companies} optionValue={"company_ID"} optionLabel={"company_Name"} label="US Company" error={errors.company?.message} /> */}
                {/* <JVHRMSDropdown required name="branch" control={control} placeholder="--Select Branch--" options={branchName} optionValue={"branchId"} optionLabel={"branchName"} label="Branch" error={errors.branch?.message} /> */}
                {/* {selectedRoles && selectedRoles.some(role => role.role_ID === 2 || role.role_ID ===6) && <JVMultiselect required label="Assign Branches" options={branches} optionLabel="branchName" placeholder="Select Branches" value={selectedBranches} onChange={setSelectedBranches} />} */}
                {/* <JVMultiselect label="Assign Companies" options={companies} optionLabel="company_Name" placeholder="Select Companies" value={selectedCompanies} onChange={setSelectedCompanies} /> */}
                <div className="col-12 md:col-12">
                    <Button className="field col-12 md:col-6" loading={loading} label="SAVE" type="submit"></Button>
                    <Button className="field col-12 md:col-6 p-button-outlined" label="CLOSE" onClick={onHide} type="button"></Button>
                </div>
            </form>
        </Dialog>
    );
}