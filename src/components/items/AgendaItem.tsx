import { TListItem } from "@/components/types/typesTask";
import { useAppColors } from "@/context/ThemeContext"; // Импортируем наш хук
import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

const AgendaItem = (props: TListItem) => {
  const { id, date, title, category, status, priority, files, sendNotify, onItemPress, onCompletePress, showDate } = props;
  const scale = useRef(new Animated.Value(1)).current;
  const isCompleted = status?.id === 'Completed';
  const colors = useAppColors(); // Вся палитра доступна здесь автоматически!

  let bellIcon = 'bell-off';
  let bellColor = colors.bellOff;
  
  if (sendNotify) {
    const isUpcoming = new Date().getTime() < new Date(date).getTime();
    bellIcon = isUpcoming ? 'bell-ring' : 'bell';
    bellColor = isUpcoming ? '#007aff' : colors.metaText;
  }

  const formattedTime = date instanceof Date 
    ? date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : '00:00';

  const formattedDate = date instanceof Date 
    ? date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '00:00';

  const handlePressIn = useCallback(() => {
    scaleStart(scale, 0.85);
    Vibration.vibrate(20);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1);
  }, [scale]);

  return (
    <Pressable 
      onPress={onItemPress} 
      style={[
        styles.itemCard, 
        { 
          backgroundColor: isCompleted ? colors.cardBgCompleted : colors.cardBg,
          borderColor: isCompleted ? 'transparent' : colors.borderColor,
          shadowColor: colors.shadowColor,
          opacity: isCompleted ? 0.5 : 1,
          elevation: isCompleted ? 0 : 2,
          shadowOpacity: isCompleted ? 0 : 0.08
        }
      ]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: category.color || '#64748B' }]}>
        <MaterialDesignIcons name={(category?.icon as any) || 'folder'} color={'white'} size={24} />
      </View>

      <View style={styles.contentContainer}>
        <Text 
          numberOfLines={2} 
          style={[
            styles.itemTitleText, 
            { color: isCompleted ? colors.titleTextCompleted : colors.titleText },
            isCompleted && styles.completedTitleText
          ]}
        >
          {title}
        </Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaGroup}>
            <MaterialDesignIcons name={bellIcon as any} color={bellColor} size={14} />
            <Text style={[styles.metaText, { color: colors.metaText }]}>{formattedTime} {showDate&&formattedDate}</Text>            
          </View>   
          <Text style={[styles.bullet, { color: colors.metaText }]}>•</Text>
          <View style={styles.metaGroup}>
            <MaterialDesignIcons name={(priority?.icon as any) || 'flag'} color={priority?.color || colors.metaText} size={14} />
            <Text style={[styles.metaText, { color: colors.metaText }]} numberOfLines={1}>
              {priority?.name?.ru || 'Без приоритета'}
            </Text>
          </View>
          {files && files.length > 0 && (
            <>
              <Text style={[styles.bullet, { color: colors.metaText }]}>•</Text>
              <View style={styles.metaGroup}>
                <MaterialDesignIcons name='paperclip' color={colors.metaText} size={14} />
                <Text style={[styles.metaText, { color: colors.metaText }]}>{files.length}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <Pressable
        onPress={onCompletePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.checkboxContainer}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <MaterialDesignIcons 
            name={isCompleted ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
            color={isCompleted ? "#4CD964" : colors.checkboxOutline} 
            size={26} 
          />
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  itemCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconWrapper: {
    height: 44,
    width: 44,
    borderRadius: 22, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 6,
    justifyContent: 'center',
  },
  itemTitleText: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
  },
  completedTitleText: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bullet: {
    paddingHorizontal: 6,
    fontSize: 12,
  },
  checkboxContainer: {
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
});

