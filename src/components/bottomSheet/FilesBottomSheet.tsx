import { TFileDataObject } from '@/utils/types';
import { formatBytes } from '@/utils/utils';
import BottomSheet, { BottomSheetFlatList, BottomSheetMethods, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { RefObject } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TFilesBottomSheet = {
    files:[],
    addFile:() => void,
    openFile:(uri: string) => void,
    deleteFile:(name:string) => void,
    sheetRef: RefObject<BottomSheetMethods | null>
}

const FilesBottomSheet = ({ files, addFile, openFile, deleteFile, sheetRef }: TFilesBottomSheet) => {

    const itemPress = (uri: string) => {
        openFile(uri)
        //setRef(sheetRef, -1)
    }

    return (
        <SafeAreaView>
            <BottomSheet
                ref={sheetRef}
                index={-1}
                enablePanDownToClose
                backgroundStyle={{ backgroundColor: '#031F2B', }}
            >
                <BottomSheetView style={{ flex: 1, gap: 15 }}>
                    <BottomSheetView style={{alignItems:'center', justifyContent:'center',}}>
                        <Pressable onPress={addFile} style={{width:'60%',padding:10, backgroundColor:'#007aff', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, borderRadius:10}}>
                            <MaterialDesignIcons name='file' color={'white'} size={16}/>
                            <Text style={{fontSize:16, fontWeight:'bold', color:'white'}}>Добавить файл</Text>                          
                        </Pressable>
                    </BottomSheetView>
                    <BottomSheetFlatList
                        nestedScrollEnabled
                        style={{ flex: 1 }}
                        data={files}
                        keyExtractor={(item:TFileDataObject) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 24, backgroundColor: '#031F2B', paddingBottom: 30 }}
                        ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={()=>null}
                                style={{ 
                                    flexDirection: 'row', 
                                    gap: 10, 
                                    backgroundColor: '#263238', 
                                    borderRadius: 15, 
                                    alignItems: 'center', 
                                    borderWidth:2, 
                                    borderColor: '#263238'}}>
                                <View style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <MaterialDesignIcons name='file' color={'white'} size={38} />
                                </View>
                                <View style={{ flex:1, alignItems: 'center', justifyContent: 'center', flexDirection:'column' }}>
                                    <Text style={{ fontSize:14, fontWeight:'bold', color:'white' }}>{item.name}</Text>
                                    <Text style={{ fontSize: 11, color: 'white' }}>{formatBytes(item.size) }</Text>
                                </View>
                                <Pressable onPress={()=>itemPress(item.uri)}>
                                    <MaterialDesignIcons name={'share-variant'} color={'white'} size={38} ></MaterialDesignIcons>
                                </Pressable>                                
                                <Pressable onPress={()=>deleteFile(item.id)}>
                                    <MaterialDesignIcons name={'delete-outline'} color={'red'} size={38} ></MaterialDesignIcons>
                                </Pressable>
                            </Pressable>)
                        }
                    />
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    );
}

export default FilesBottomSheet