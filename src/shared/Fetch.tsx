export interface IEnvironmentConfig {
    websiteUrl: string;
    baseUrl: string;
}

const localConfig: IEnvironmentConfig = {
    websiteUrl: "http://localhost:3000/",
    baseUrl: "https://localhost:7177/api/"
};

const stageConfig: IEnvironmentConfig = {
    websiteUrl: "https://discussion-stg.jobvritta.com/",
    baseUrl: "https://discussion-stg.jobvritta.com/api/"
};

const productionConfig: IEnvironmentConfig = {
    websiteUrl: "https://www.hrlense.com/",
    baseUrl: "https://hrmsapi.jobvritta.com/api/"
};

let config: IEnvironmentConfig;
const hostname = window.location.hostname;

if (hostname.includes("localhost")) {
    config = localConfig;
} else if (hostname.includes("stg")) {
    config = stageConfig;
} else {
    config = productionConfig;
}

export const websiteUrl = config.websiteUrl;
export const baseUrl = config.baseUrl;

export interface ILazyParams {
    first: number;
    rows: number;
    page: number;
    sortField: string;
    sortOrder?: 1 | 0 | -1 | undefined | null;
}

export const Fetch = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: any,
    query: string | null,
    toast: any
) => {
    const token = sessionStorage.getItem('token')?.toString();

    const params: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        ...(body && { body: JSON.stringify(body) })
    };

    try {
        const response = await fetch(`${baseUrl}${url}${query ? `?${query}` : ''}`, params);

        if (response.status === 401) {
            sessionStorage.clear();
            toast?.current?.show({ severity: 'error', detail: "Unauthorized Please Login!", life: 5000 });
            return undefined;
        } else if (response.status === 400) {
            const message = await response.text();
            toast?.current?.show({ severity: 'error', detail: message, life: 3000 });
            return undefined;
        } else if (!response.ok) {
            toast?.current?.show({ severity: 'error', detail: 'Something went Wrong', life: 3000 });
            return undefined;
        }

        return response;
    } catch (error) {
        toast?.current?.show({ severity: 'error', detail: 'Something went Wrong', life: 3000 });
        return undefined;
    }
};
