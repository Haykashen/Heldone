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
