// import CategoryData from '@/data/CategoryData';
// import { TBottomSheet } from '@/utils/types';
// import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@expo/ui/community/bottom-sheet';
// import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
// import { Pressable, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const CategoryBottomSheet = ({ currentId, setValue, setRef, sheetRef }: TBottomSheet) => {

//     const array = Object.values(CategoryData);

//     const itemPress = (id: string) => {
//         setValue(id)
//         setRef(sheetRef, -1)
//     }

//     return (
//         <SafeAreaView>
//             <BottomSheet
//                 ref={sheetRef}
//                 index={-1}
//                 snapPoints={['70%', '90%']}
//                 //onClose={() => setRef(sheetRef, -1)}
//                 enablePanDownToClose
//                 backgroundStyle={{ backgroundColor: '#031F2B', }}
//             >
//                 <BottomSheetView style={{ flex: 1 }}>
//                     <BottomSheetFlatList
//                         nestedScrollEnabled
//                         style={{ flex: 1 }}
//                         data={array}
//                         keyExtractor={item => item.id}
//                         contentContainerStyle={{ padding: 24, backgroundColor: '#031F2B', paddingBottom: 100 }}
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
//                                     borderWidth: 2,
//                                     borderColor: item.id == currentId ? 'silver' : '#263238',
//                                 }}>
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

// export default CategoryBottomSheet


import CategoryData from '@/data/CategoryData';
import { TBottomSheet } from '@/utils/types';
import BottomSheet, { BottomSheetFlatList } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ОПТИМИЗАЦИЯ: Преобразуем объект в массив ОДИН раз при компиляции файла,
// чтобы не тратить процессорное время в рантайме.
const CATEGORIES_ARRAY = Object.values(CategoryData);

const CategoryBottomSheet = ({ currentId, setValue, setRef, sheetRef }: TBottomSheet) => {

  // Мемоизируем обработчик клика по категории
  const handleItemPress = useCallback((id: string) => {
    setValue(id);
    setRef(sheetRef, -1); // Закрываем шторку
  }, [setValue, setRef, sheetRef]);

  // Мемоизированный разделитель элементов списка
  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  // Оптимизированный рендер строки категории
  const renderItem = useCallback(({ item }: { item: typeof CATEGORIES_ARRAY[0] }) => {
    const isSelected = item.id === currentId;

    return (
      <Pressable
        onPress={() => handleItemPress(item.id)}
        style={[
          styles.cardRow,
          { borderColor: isSelected ? 'silver' : '#263238' }
        ]}
      >
        {/* Иконка категории */}
        <View style={[styles.iconContainer, { backgroundColor: item.backColor }]}>
          <MaterialDesignIcons name={item.icon as any} color={item.color} size={32} />
        </View>
        
        {/* Текстовая область */}
        <View style={styles.textContainer}>
          <Text style={styles.categoryText}>{item.name.ru}</Text>
        </View>

        {/* Опционально: галочка для выбранного элемента для улучшения UX */}
        {isSelected && (
          <MaterialDesignIcons name="check-bold" color="silver" size={20} style={styles.checkIcon} />
        )}
      </Pressable>
    );
  }, [currentId, handleItemPress]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['50%', '100%']} // Немного уменьшили стартовую высоту для аккуратности
      enablePanDownToClose
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetFlatList
        nestedScrollEnabled
        style={styles.list}
        data={CATEGORIES_ARRAY}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
      />
    </BottomSheet>
  );
};

// Экспортируем через React.memo, так как шторка лежит на экранах форм 
// и не должна перерисовываться при каждом вводе символа в TextInput
export default React.memo(CategoryBottomSheet);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#031F2B',
    flex: 1,
  },
  innerView: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    backgroundColor: '#031F2B',
    paddingBottom: 60, // Защита от перекрытия системной навигационной полосой на Android/iOS
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
    padding: 10, // Добавили внутренний отступ для аккуратного выравнивания
  },
  iconContainer: {
    height: 48,
    width: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1, // ИСПРАВЛЕНО: Заменили minWidth на flex, теперь текст адаптивен
    justifyContent: 'center',
    paddingLeft: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  checkIcon: {
    marginRight: 4,
  }
});



