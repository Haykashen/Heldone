import { TBottomSheet } from '@/components/types/types';
import BottomSheet, { BottomSheetFlatList } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TDataItem } from '../types/typesData';

const SelectionBottomSheet = ({ currentId, setValue, setRef, sheetRef, data }: TBottomSheet) => {

  // Мемоизируем клик по элементу
  const handleItemPress = useCallback((id: string) => {
    setValue(id);
    setRef(sheetRef, -1); // Закрываем шторку
  }, [setValue, setRef, sheetRef]);

  // Мемоизированный разделитель строк
  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  // Оптимизированный рендер строки
  const renderItem = useCallback(({ item }: { item: TDataItem }) => {
    const isSelected = item.id === currentId;

    return (
      <Pressable
        onPress={() => handleItemPress(item.id)}
        style={[
          styles.cardRow,
          { borderColor: isSelected ? 'silver' : '#263238' }
        ]}
      >
        {/* Иконка элемента */}
        <View style={[styles.iconContainer, { backgroundColor: item.backColor || '#263238' }]}>
          <MaterialDesignIcons name={item.icon as any} color={item.color} size={32} />
        </View>
        
        {/* Адаптивный текст названия */}
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{item.name.ru}</Text>
        </View>

        {/* Рабочая галочка для выбранного элемента */}
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
      enablePanDownToClose
      backgroundStyle={styles.sheetBackground}
      snapPoints={['50%', '100%']}
    >
      <BottomSheetFlatList
        nestedScrollEnabled
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
      />
    </BottomSheet>
  );
};

// Мемоизируем экспорт для предотвращения холостых перерисовок
export default React.memo(SelectionBottomSheet);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#031F2B',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: '#031F2B',
    paddingBottom: 60, // Защита от перекрытия системной навигационной полосой
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
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 4,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  checkIcon: {
    marginRight: 4,
  }
});
