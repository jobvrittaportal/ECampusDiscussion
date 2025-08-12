import { useMemo } from "react";

export interface IPageFeature extends IPagePermission {
    features: IPagePermission[];
}

export interface IPagePermission {
    id: number,
    name: string,
    label?: string,
    url?: string,
    description?: string,
    isFeature: boolean,
    parentId?: number,
    parent?: string,
    permission: boolean
}

export interface ILogin {
    employeeId: number,
    employeeName: string,
    token: string,
    permissions: Array<IPagePermission>
}

const useAuth = (): {
    loginObj: ILogin | null;
    pageFeatures: IPageFeature[],
    hasPermission: (pageName: string, featureName?: string) => boolean
} => {

    const auth: string = sessionStorage.getItem("loginData") ?? "";
    const loginObj: ILogin | null = auth ? JSON.parse(auth) : null;

    const pageFeatures = useMemo(() => {
        if (!loginObj) return [];

        const features: IPageFeature[] = [];

        const parentPages = loginObj.permissions?.filter(p => !p.isFeature);

        parentPages?.forEach(pp => {
            const pageFeature: IPageFeature = {
                ...pp,
                features: []
            };

            loginObj.permissions?.forEach(p => {
                if (pp.id === p.parentId) {
                    pageFeature.features.push(p);
                }
            });

            features.push(pageFeature);
        });

        return features;
    }, [loginObj]);

    const hasPermission = (pageName: string, featureName?: string): boolean => {
        const page = pageFeatures.find(page => page.name === pageName);
        if (!page) return false;
        if (!featureName) {
            return page.permission;
        }
        return page.features.some(f => f.name === featureName && f.permission);
    };

    return { loginObj, pageFeatures, hasPermission };
};

export default useAuth;
