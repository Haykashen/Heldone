import PriorityData from '@/data/PriorityData';
import { TBottomSheet } from '@/utils/types';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PriorityBottomSheet = ({ currentId, setValue, setRef, sheetRef }: TBottomSheet) => {

    const array = Object.values(PriorityData);

    const itemPress = (id: string) => {
        setValue(id)
        setRef(sheetRef, -1)
    }

    return (
        <SafeAreaView>
            <BottomSheet
                ref={sheetRef}
                index={-1}
                enablePanDownToClose
                backgroundStyle={{ backgroundColor: '#031F2B', }}
            >
                <BottomSheetView style={{ flex: 1 }}>
                    <BottomSheetFlatList
                        nestedScrollEnabled
                        style={{ flex: 1 }}
                        data={array}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingHorizontal: 24, backgroundColor: '#031F2B', paddingBottom: 30 }}
                        ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
                        renderItem={({ item }) => (
                            <Pressable
                                key={item.id}
                                onPress={() => itemPress(item.id)}
                                style={{ 
                                    flexDirection: 'row', 
                                    gap: 10, 
                                    backgroundColor: '#263238', 
                                    borderRadius: 15, 
                                    alignItems: 'center', 
                                    borderWidth:2, 
                                    borderColor: item.id == currentId ? 'silver' : '#263238'}}>
                                <View style={{ height: 50, width: 50, backgroundColor: item.backColor, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                                    <MaterialDesignIcons name={item.icon as any} color={item.color} size={38} />
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: '70%' }}>
                                    <Text style={{ paddingVertical: 16, color: 'white' }}>{item.name.ru}</Text>
                                </View>
                            </Pressable>)
                        }
                    />
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    );
}

export default PriorityBottomSheet
