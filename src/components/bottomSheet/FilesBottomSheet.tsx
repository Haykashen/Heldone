import { TFileDataObject } from '@/components/types/types';
import { useAppColors } from '@/context/ThemeContext';
import { formatBytes } from '@/utils/fileUtils';
import BottomSheet, { BottomSheetFlatList, BottomSheetMethods, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ListEmptyComponent from '../items/ListEmptyComponent';

// СИНХРОНИЗАЦИЯ: Интерфейс типов полностью переписан под пропсы из TaskCardScreen
type TFilesBottomSheet = {
  files: TFileDataObject[];
  onPick: () => void;
  onOpen: (uri: string) => void;
  onShare: (uri: string, fileName: string) => void;
  onDelete: (id: string, uri: string) => void;
  sheetRef: React.RefObject<BottomSheetMethods | null>;
};

const FilesBottomSheet = ({ files = [], onPick, onOpen, onShare, onDelete, sheetRef }: TFilesBottomSheet) => {
  // Получаем динамическую палитру цветов
  const colors = useAppColors();
  
  // Мемоизируем хэндлеры для стабильности ссылок renderItem
  const handleOpenPress = useCallback((uri: string) => {
    onOpen(uri);
  }, [onOpen]);

  const handleSharePress = useCallback((uri: string, fileName: string) => {
    onShare(uri, fileName);
  }, [onShare]);

  const handleDeletePress = useCallback((id: string, uri: string) => {
    onDelete(id, uri);
  }, [onDelete]);

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const renderEmpty = useCallback(() => (
    <ListEmptyComponent
      onPress={onPick}
      date=''
      title='У задачи нет прикрепленных файлов.' // Исправлено "нету"
      text='Прикрепите файлы, нужные для задачи, чтобы потом их не искать.'
    />
  ), [onPick]);

  // Оптимизированный рендер карточки файла
  const renderItem = useCallback(({ item }: { item: TFileDataObject }) => (
    <View style={[styles.fileCard,{backgroundColor:  colors.cardBg,  borderColor: colors.borderColor }]}>              
      {/* Кликабельная зона для открытия файла */}
      <Pressable 
        onPress={() => handleOpenPress(item.uri)} 
        style={styles.fileInfoPressable}
      >
        <View style={styles.fileIconWrapper}>
          <MaterialDesignIcons name='file' color='white' size={28} />
        </View>
        <View style={styles.textContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.fileNameText, {color:colors.badgeText}]}>
            {item.name}
          </Text>
          <Text style={[styles.fileSizeText, {color:colors.badgeText}]}>
            {formatBytes(item.size)}
          </Text>
        </View>
      </Pressable>

      {/* Кнопка Поделиться */}
      <Pressable 
        onPress={() => handleSharePress(item.uri, item.name)} 
        style={styles.actionButton}
      >
        <MaterialDesignIcons name='share-variant' color={colors.badgeText} size={22} />
      </Pressable>                                

      {/* Кнопка Удалить */}
      <Pressable 
        onPress={() => handleDeletePress(item.id, item.uri)} 
        style={styles.actionButton}
      >
        <MaterialDesignIcons name='delete-outline' color={colors.missedSectionTitle} size={22} />
      </Pressable>
    </View>
  ), [handleOpenPress, handleSharePress, handleDeletePress]);

  // Динамический отступ снизу в зависимости от наполненности списка
  const listContentStyle = useMemo(() => [
    styles.listContent,
    { paddingBottom: files.length > 4 ? 80 : 30 }
  ], [files.length]);

  return (
    // ИСПРАВЛЕНО: Убран SafeAreaView, чтобы избежать багов с нативным расчетом высоты оверлея
    <BottomSheet
      ref={sheetRef}
      index={-1}
      enablePanDownToClose
      snapPoints={['55%', '85%']}
      backgroundStyle={[styles.sheetBackground, {backgroundColor:colors.containerBg}]}
    >
      <BottomSheetView style={styles.innerContainer}>
        {/* Кнопка добавления файла */}
        <View style={styles.addFileHeader}>
          <Pressable onPress={onPick} style={styles.addFileButton}>
            <MaterialDesignIcons name='file-plus-outline' color='white' size={18} />
            <Text style={styles.addFileButtonText}>Добавить файл</Text>
          </Pressable>
        </View>

        {/* Список вложений */}
        <BottomSheetFlatList
          nestedScrollEnabled
          style={[styles.list,, {backgroundColor:colors.containerBg}]}
          data={files}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[listContentStyle, {backgroundColor:colors.containerBg}]}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default React.memo(FilesBottomSheet);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#031F2B',
  },
  innerContainer: {
    flex: 1,
    gap: 10,
  },
  addFileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  addFileButton: {
    width: '65%',
    paddingVertical: 12,
    backgroundColor: '#007aff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
  },
  addFileButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 15,
    //backgroundColor: '#031F2B',
  },
  separator: {
    height: 10,
  },
  fileCard: {
    flexDirection: 'row', 
    //backgroundColor: '#263238', 
    borderRadius: 15, 
    borderWidth: 2,
    alignItems: 'center', 
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  fileInfoPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fileIconWrapper: {
    height: 44,
    width: 44,
    backgroundColor: '#37474F',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fileNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 18,
  },
  fileSizeText: {
    fontSize: 12,
    //color: '#7a92a5',
    marginTop: 2,
  },
  actionButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
});
