import { TDataItem } from "./typesData";

export type TTask = {
    id:string, 
    date:Date, 
    dateString?: string,
    title:string, 
    category:TDataItem, 
    status:TDataItem,
    priority:TDataItem, 
    notes?:string,
    sendNotify:boolean,
    notifyId?:string,
    files:any[]    
};

export type TListItem = TTask & {onItemPress: (() => void), onCompletePress: (() => void) };