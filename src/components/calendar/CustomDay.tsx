import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DateData } from 'react-native-calendars';
// --- Выделенный мемоизированный компонент дня ---
interface CustomDayProps {
  date?: DateData;
  selDate: string;
  today: string;
  dayData?: { dots: Array<{ color: string }> };
  onSelect: (dateString: string) => void;
}

const CustomDay = memo(({ date, selDate, today, dayData, onSelect }: CustomDayProps) => {
  if (!date) return null;

  const isToday = date.dateString === today;
  const isSelected = date.dateString === selDate;

  const dayDate = new Date(date.dateString)
  const selDayDate = new Date(selDate)

  const isOtherMonth = dayDate.getMonth() !== selDayDate.getMonth();

  const dayNumber = dayDate.getDay();
  const weekend = dayNumber === 0 || dayNumber === 6;
  const showWeekend = !isToday && !isSelected && weekend
  return (
    <Pressable style={styles.dayContainer} onPress={() => onSelect(date.dateString)}>
      <Text style={[
        styles.dayText,
        isToday && styles.todayText,
        isSelected && styles.selectedDayText,
        showWeekend && styles.weekendDayText,
        isOtherMonth && styles.otherMonthDayText, 
      ]}>
        {date.day}
      </Text>
      
      {dayData && (
        <View style={styles.dotsContainer}>
          {dayData.dots[0] && <View style={[styles.dot, { backgroundColor: dayData.dots[0].color }]} />}
          {dayData.dots[1] && <View style={[styles.dot, { backgroundColor: dayData.dots[1].color }]} />}
          {dayData.dots.length > 2 && (
            <Text style={styles.moreDotsText}>
              +{dayData.dots.length - 2}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
});

export default CustomDay

const styles = StyleSheet.create({
  dayContainer: {
    gap: 2,
    alignItems: 'center',
  },
  dayText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'grey',
    backgroundColor: 'white',
    padding: 3,
    borderRadius: 25,
    minWidth: 26,
  },
  todayText: {
    color: '#007aff',
  },
  weekendDayText:{
    color: '#74b9fa',    
  },  
  otherMonthDayText:{
    color:'#D3D3D3',
    fontStyle:'italic',
  },   
  selectedDayText: {
    backgroundColor: '#c0defa',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 14,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  moreDotsText: {
    textAlign: 'center',
    fontSize: 10,
    color: 'gray',
  },
});
