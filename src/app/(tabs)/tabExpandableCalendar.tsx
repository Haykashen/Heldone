import { StyleSheet, Text, View } from 'react-native';




interface Props {
  weekView?: boolean;
}

const ExpandableCalendarScreen = (props: Props) => {

  return (
     <View>
        <Text>Tab calendar</Text>
     </View>
  
  );
};

export default ExpandableCalendarScreen;

const style = (Theme:any)=> StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  headerTitle: {fontSize: 16, fontWeight: 'bold', marginRight: 6},
  section: {
    backgroundColor: '#031F2B',
    color: 'white',
    textTransform: 'capitalize'
  },
 textHeader:{
    color: Theme.colors.text_Primary, 
    fontSize:22,
    fontWeight:'bold'
  },
});