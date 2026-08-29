import { TBottomSheet } from '@/components/types/types';
import { TDataItem } from '@/components/types/typesData';
import { SettingContext } from '@/context/SettingContext';
import { useAppColors } from '@/context/ThemeContext';
import CategoryData from '@/data/CategoryData';
import BottomSheet, { BottomSheetFlatList, BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import React, { RefObject, useCallback, useContext, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ОПТИМИЗАЦИЯ: Преобразуем объект в массив ОДИН раз при компиляции файла,
// чтобы не тратить процессорное время в рантайме.
const CATEGORIES_ARRAY:ArrayLike<TDataItem> = Object.values(CategoryData);

const CategoryBottomSheet = ({ }: TBottomSheet) => {

  const { 
    defaultCategory, setDefaultCategory, 
  } = useContext(SettingContext);
  const colors = useAppColors();  
  const sheetCategoryRef = useRef<BottomSheet>(null);

  const setSheetRef = useCallback((ref: RefObject<BottomSheetMethods | null>, index: number) => {
    ref.current?.snapToIndex(index);
  }, []);

  // Мемоизируем обработчик клика по категории
  const handleItemPress = useCallback((id: string) => {
    setDefaultCategory(id);
    setSheetRef(sheetCategoryRef, -1); // Закрываем шторку
  }, [setDefaultCategory, setSheetRef, sheetCategoryRef]);
  
  const handleClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  }, []);
  // Мемоизированный разделитель элементов списка
  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  // Оптимизированный рендер строки категории
  const renderItem = useCallback(({ item }: { item: TDataItem}) => {
    const isSelected = item.id === defaultCategory;

    return (
      <Pressable
        onPress={() => handleItemPress(item.id)}
        style={[
          styles.cardRow,
          { borderColor: isSelected ? 'silver' : colors.borderColor, backgroundColor:  colors.cardBg }
        ]}
      >
        {/* Иконка категории */}
        <View style={[styles.iconContainer, { backgroundColor: item.backColor }]}>
          <MaterialDesignIcons name={item.icon as any} color={item.color} size={32} />
        </View>
        
        {/* Текстовая область */}
        <View style={styles.textContainer}>
          <Text style={[styles.categoryText, {color:colors.badgeText}]}>{item.name.ru}</Text>
        </View>

        {/* Опционально: галочка для выбранного элемента для улучшения UX */}
        {isSelected && (
          <MaterialDesignIcons name="check-bold" color="silver" size={20} style={styles.checkIcon} />
        )}
      </Pressable>
    );
  }, [defaultCategory, handleItemPress]);

  return (
    <BottomSheet
      ref={sheetCategoryRef}
      index={0}
      snapPoints={['50%', '100%']} // Немного уменьшили стартовую высоту для аккуратности
      enablePanDownToClose
      backgroundStyle={[styles.sheetBackground, {backgroundColor:colors.containerBg}]}
      onClose={handleClose}       
    >
      <BottomSheetFlatList
        nestedScrollEnabled
        style={[styles.list, {backgroundColor:colors.containerBg}]}
        data={CATEGORIES_ARRAY}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, {backgroundColor:colors.containerBg}]}
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



