export interface ICompanyMastDropdown {
  company_ID: number;
  company_Name: string;
}

export interface IBranchMastDropdown {
  branch_ID: number;
  branchName: string;
  company_ID: number;
}

export interface ICityMastDropdown {
  city_ID?: number;
  city_Name?: string;
}

export interface IStateMastDropdown {
  state_ID?: number;
  state_Name?: string;
}

export interface IEndClientsDropdown {
  end_Client_Id?: number;
  end_Client_Name?: string;
}

export interface ICountryMastDropdown {
  country_ID?: number;
  country_Name?: string;
}

export interface IBenchConsDropdown {
  consultant_ID: number;
  consultant_Name: string;
}

export interface IIndustryMastDropdown {
  industry_Id?: number;
  industry_Name?: string;
}
export interface IDesignationDropdown {
  id?: number;
  designation_Name?: string;
}

export interface ISkillCategoriesDropdown {
  req_CategoryID?: number;
  req_CategoryName?: string;
  req_CategoryStatus?: boolean;
}

export interface IClientCategoriesDropdown {
  reqType_ID?: number;
  reqType?: string;
}

export interface IClientCompanyDropdown {
  vendor_Company_ID?: number;
  vendor_Company_Name?: string;
  website_URL?: string;
}

export interface IDesignationMastDropdown {
  designationId: number;
  designation_Name: string;
}

export interface IDocumentMastDropdown {
  document_ID: number;
  document_Name: string;
}

export interface IVendorTypeMastDropdown {
  vendortypeid: number;
  vendor_Type: string;
}

export interface IRolesDropdown {
  role_ID: number;
  role_Name: string;
}

export interface IUsersDropdown {
  login_ID?: number;
  user_Name?: string;
}

export interface ITeamsDropdown {
  team_ID: number;
  team_Name: string;
}

export interface IVisaDropdown {
  visaId: number;
  visa_Name: string;
}

export interface IDepartmentDropdown {
  department_ID: number;
  department_Name: string;
}

export interface ITicketSubjectDropdown {
  subject_ID: number;
  ticket_Sub: string;
  department_ID: number;
}

export interface IUniversityDropdown {
  university_ID?: number;
  university_Name?: string;
}

export interface ITimeZoneDropdown {
  timezone_ID?: number;
  time_Zone_Name?: string;
}

export interface IECIStatusDropdown {
  ecI_Type_ID?: number;
  ecI_Type_Name?: string;
}

export interface ISubmissionStatusDropdown {
  status_ID?: number;
  status_Name?: string;
}

export interface IEmailTempDropdown {
  template_Id: number;
  template_Name: string;
}
export interface IStatusDropdown {
  blacklist_Status_ID: number;
  blacklist_Status: string;
}

export interface IBankDropdown {
  bank_Name_ID: number;
  bank_Name: string;
}
export interface IIndustryMastDropdown {
  industry_Type_ID: number;
  industry_Type_Name: string;
}
export interface IBloodGroupDropdown {
  blood_Group_ID: number;
  blood_Group: string;
}
export interface IDegreeDropdown {
  degree_ID: number;
  degree: string;
}
export interface IGenderDropdown {
  gender_ID: number;
  gender: string;
}
export interface IMartialStatusDropdown {
  marital_ID: number;
  marital_Status: string;
}
export interface IReferenceDropdown {
  reference_ID: number;
  reference: string;
}
export interface IRelationDropdown {
  relation_ID: number;
  relation: string;
}
export interface IScoreDropdown {
  score_ID: number;
  score: string;
}
export interface IShiftDropdown {
  shift_ID: number;
  shift: string;
}

export interface IInterviewerDropdown {
  employeeID?: number;
  emp_Name?: string;
}
