// import PriorityData from '@/data/PriorityData';
// import { TBottomSheet } from '@/utils/types';
// import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@expo/ui/community/bottom-sheet';
// import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
// import { Pressable, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const PriorityBottomSheet = ({ currentId, setValue, setRef, sheetRef }: TBottomSheet) => {

//     const array = Object.values(PriorityData);

//     const itemPress = (id: string) => {
//         setValue(id)
//         setRef(sheetRef, -1)
//     }

//     return (
//         <SafeAreaView>
//             <BottomSheet
//                 ref={sheetRef}
//                 index={-1}
//                 enablePanDownToClose
//                 backgroundStyle={{ backgroundColor: '#031F2B', }}
//             >
//                 <BottomSheetView style={{ flex: 1 }}>
//                     <BottomSheetFlatList
//                         nestedScrollEnabled
//                         style={{ flex: 1 }}
//                         data={array}
//                         keyExtractor={item => item.id}
//                         contentContainerStyle={{ paddingHorizontal: 24, backgroundColor: '#031F2B', paddingBottom: 30 }}
//                         ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
//                         renderItem={({ item }) => (
//                             <Pressable
//                                 key={item.id}
//                                 onPress={() => itemPress(item.id)}
//                                 style={{ 
//                                     flexDirection: 'row', 
//                                     gap: 10, 
//                                     backgroundColor: '#263238', 
//                                     borderRadius: 15, 
//                                     alignItems: 'center', 
//                                     borderWidth:2, 
//                                     borderColor: item.id == currentId ? 'silver' : '#263238'}}>
//                                 <View style={{ height: 50, width: 50, backgroundColor: item.backColor, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
//                                     <MaterialDesignIcons name={item.icon as any} color={item.color} size={38} />
//                                 </View>
//                                 <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: '70%' }}>
//                                     <Text style={{ paddingVertical: 16, color: 'white' }}>{item.name.ru}</Text>
//                                 </View>
//                             </Pressable>)
//                         }
//                     />
//                 </BottomSheetView>
//             </BottomSheet>
//         </SafeAreaView>
//     );
// }

// export default PriorityBottomSheet


import PriorityData from '@/data/PriorityData';
import { TBottomSheet } from '@/utils/types';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ОПТИМИЗАЦИЯ: Преобразуем объект в массив ОДИН раз при компиляции файла
const PRIORITIES_ARRAY = Object.values(PriorityData);

const PriorityBottomSheet = ({ currentId, setValue, setRef, sheetRef }: TBottomSheet) => {

  // Мемоизируем клик по элементу
  const handleItemPress = useCallback((id: string) => {
    setValue(id);
    setRef(sheetRef, -1);
  }, [setValue, setRef, sheetRef]);

  // Мемоизированный разделитель строк
  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  // Оптимизированный рендер строки приоритета
  const renderItem = useCallback(({ item }: { item: any }) => {
    const isSelected = item.id === currentId;

    return (
      <Pressable
        onPress={() => handleItemPress(item.id)}
        style={[
          styles.cardRow,
          { borderColor: isSelected ? 'silver' : '#263238' }
        ]}
      >
        {/* Иконка флага / приоритета */}
        <View style={[styles.iconContainer, { backgroundColor: item.backColor || '#263238' }]}>
          <MaterialDesignIcons name={item.icon as any} color={item.color} size={32} />
        </View>
        
        {/* Адаптивный текст названия */}
        <View style={styles.textContainer}>
          <Text style={styles.priorityText}>{item.name?.ru || item.title}</Text>
        </View>

        {/* Рабочая галочка для выбранного элемента */}
        {isSelected && (
          <MaterialDesignIcons name="check-bold" color="silver" size={20} style={styles.checkIcon} />
        )}
      </Pressable>
    );
  }, [currentId, handleItemPress]);

  return (
    // ИСПРАВЛЕНО: Убран SafeAreaView, блокировавший отображение нативного BottomSheet
    <BottomSheet
      ref={sheetRef}
      index={-1}
      //snapPoints={['50%', '75%']} // Для приоритетов (обычно их 3-4) достаточно меньшего размера шторки
      enablePanDownToClose
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={styles.innerView}>
        <BottomSheetFlatList
          nestedScrollEnabled
          style={styles.list}
          data={PRIORITIES_ARRAY}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={renderSeparator}
          renderItem={renderItem}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

// Мемоизируем экспорт, чтобы шторка не перерисовывалась при открытии клавиатуры на родительском экране
export default React.memo(PriorityBottomSheet);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#031F2B',
  },
  innerView: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: '#031F2B',
    paddingBottom: 50, // Безопасная зона для нативных кнопок Android/iOS
  },
  separator: {
    height: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#263238',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    padding: 10,
  },
  iconContainer: {
    height: 48,
    width: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1, // ИСПРАВЛЕНО: Текст автоматически занимает ширину экрана без процентов
    justifyContent: 'center',
    paddingLeft: 4,
  },
  priorityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  checkIcon: {
    marginRight: 4,
  }
});
