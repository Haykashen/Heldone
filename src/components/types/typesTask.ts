import { TDataItem } from "./typesData";

export type TTask = {
    id:string, 
    date:Date, 
    dateString?: string,
    title:string, 
    category:string,
    status:TDataItem,
    priority:string,
    notes?:string,
    sendNotify:boolean,
    notifyId?:string,
    files:any[]    
};

export type TListItem = TTask & {onItemPress: (() => void), onCompletePress: (() => void), showDate?: boolean };