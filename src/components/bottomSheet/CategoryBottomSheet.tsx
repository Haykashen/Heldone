import Categorys from '@/data/CategoryData';
import BottomSheet, { BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
//import { router } from 'expo-router';
import { useRef } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

const CategoryBottomSheet = ({ index, setCategory }: { index: number, setCategory: ((arg:number) => void) }) => {
    const sheetRef = useRef<BottomSheet>(null);
    {/* <Button title="Open" onPress={() => sheetRef.current?.snapToIndex(0)} /> sheetRef.current?.snapToIndex(-1)*/ }
    return (
            <BottomSheet
                ref={sheetRef}
                index={index}
                snapPoints={['70%', '90%']}
                onClose={() => sheetRef.current?.snapToIndex(-1)}
                enablePanDownToClose
            >
                <BottomSheetView style={{ flex: 1 }}>
                    <FlatList
                        nestedScrollEnabled
                        style={{ flex: 1 }}
                        data={Object.values(Categorys)}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ padding: 24, backgroundColor: '#031F2B', paddingBottom: 100 }}
                        ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => sheetRef.current?.snapToIndex(-1)}
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

    );
}

export default CategoryBottomSheet
