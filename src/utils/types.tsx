import { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
import { RefObject } from 'react';

export type TBottomSheet = {
    setValue: (id: string) => void,
    setRef: ((arg: RefObject<BottomSheetMethods | null>, index: number) => void),
    sheetRef: RefObject<BottomSheetMethods | null>,
    currentId: string
}

export type TTask = {
    id:string, 
    date:Date, 
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

// export type TName = {
//     [key: string]: string
// }

export type TDataItem = {
    id: string,
    name: {
      [key: string]: string
    },
    color: string,
    icon: string,
    backColor?: string,
    clockIcon?: string,
}

export type TDataDir = {
    [id: string]: TDataItem 
}

export type TTaskByDays  = {[key:string]:{data:any}}

export type TFileDataObject ={
    id:string,
    name:string,
    size:number,
    uri:string
}
/// 
export type TNavigationButton = { icon: any, size: number, onPress: ()=>void, }
export type THeader = { title: string, text: string, };