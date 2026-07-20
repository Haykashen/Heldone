import BottomSheet, { BottomSheetFlatList, BottomSheetMethods, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
//import { router } from 'expo-router';
import PriorityData from '@/data/PriorityData';
import { RefObject } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const PriorityBottomSheet = ({setPriority, setRef, sheetRef }: { setPriority:(id:string)=>void, setRef: ((arg: RefObject<BottomSheetMethods | null>, index: number) => void), sheetRef: RefObject<BottomSheetMethods | null> }) => {

    const array = Object.values(PriorityData);

    const itemPress = (id:string) => {
        setPriority(id)
        setRef(sheetRef, -1)
    }

    return (
        <SafeAreaView>
            <BottomSheet
                ref={sheetRef}
                index={-1}
                snapPoints={['70%', '90%']}
                //onClose={() => setRef(sheetRef, -1)}
                enablePanDownToClose
                backgroundStyle ={{backgroundColor:'#031F2B', }}
            >
                <BottomSheetView style={{ flex: 1 }}>
                    <BottomSheetFlatList
                        nestedScrollEnabled
                        style={{ flex: 1 }}
                        data={array}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ padding: 24, backgroundColor: '#031F2B', paddingBottom: 100 }}
                        ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
                        renderItem={({ item }) => (
                            <Pressable
                                key={item.id}
                                onPress={()=>itemPress(item.id)}
                                style={{ flexDirection: 'row', gap: 10, backgroundColor: '#263238', borderRadius: 15, alignItems: 'center' }}>
                                <View style={{ height: 50, width: 50, backgroundColor: item.backColor, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                                    <MaterialDesignIcons name={item.icon as any} color={item.color} size={38} />
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: '70%' }}>
                                    <Text style={{ paddingVertical: 16, color: 'white' }}>{item.name.ru}</Text>
                                </View>
                            </Pressable>)}
                    />
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    );
}

export default PriorityBottomSheet
