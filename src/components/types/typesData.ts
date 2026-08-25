export type TDataItem = {
    id: string,
    name: {
      [key: string]: string
    },
    color: string,
    icon: string,
    backColor?: string,
}

export type TDataDir = {
    [id: string]: TDataItem 
}