export type TName = {
    [key: string]: string
}

export type TDataItem = {
    id: string,
    name: TName,
    color: string,
    icon: string,
    backColor: string
}

export type TDataDir = {
    [id: string]: TDataItem 
}
export type TPropsItem = {item:TItem}
export type TItem = TTask & {onItemPress: (() => void), onCompletePress: (() => void), onDeletePress: (() => void)};//id:string
export type TTask = {id:string, date:Date, title:string, category:TDataItem, status:TDataItem, timeStatus:TDataItem, notes?:string};
export type TMarkedDays = {[key:string]:{marked:boolean}}
export type TTaskByDays  = {[key:string]:{data:any}}

export interface ITranslate {
    [word: string] : {
        [lang: string] : string
    }
}
export type TCategoryPanel = { onPressCategory :(arg:string)=>void, category:string, language:string}
export type TNavPanel = { onPressStatus:(arg:string)=>void, onPressAdd:()=>void, theme:any, status:string}
// type TCategory = {
//     [id:string]:{
//         [atr:string]:{
//             [key:string]:string
//         }
//     }
// }
