import { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
import { RefObject } from 'react';
import { TDataItem } from './typesData';

export type TBottomSheet = {
    setValue: (id: string) => void,
    setRef: ((arg: RefObject<BottomSheetMethods | null>, index: number) => void),
    sheetRef: RefObject<BottomSheetMethods | null>,
    currentId: string,
    data: ArrayLike<TDataItem>
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