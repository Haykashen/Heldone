import NavigationButton from '@/components/buttons/NavigationButton';
import { THeader } from '@/utils/types';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

const Header = ({title, text}: THeader) => {
    
    return (
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{title}</Text>
          <Text style={{ color: '#7a92a5', fontSize: 16 }}>{text}</Text>
        </View>
        <NavigationButton onPress={()=> router.push('/setting')} icon={'cog'} size={38}/>
      </View>    
    )
}

export default Header
