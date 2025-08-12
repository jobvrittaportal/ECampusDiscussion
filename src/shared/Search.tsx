import { InputText } from "primereact/inputtext";

export const Search = ({ setSearch, removeIcon }: { setSearch: (search: string | null) => void, removeIcon?: boolean }) => {
    let timeoutID: undefined | ReturnType<typeof setTimeout> = undefined;
    const piyum = (data: string, delay: number = 500) => {
        clearInterval(timeoutID);
        timeoutID = setTimeout(() => {
            if (data !== "") setSearch(data);
            else setSearch(null);
        }, delay);
    }
    return (
        <>{!removeIcon && <i className="pi pi-search" />}
            <InputText type="search" onChange={e => piyum(e.target.value)} placeholder="Search..." /></>
    );
}