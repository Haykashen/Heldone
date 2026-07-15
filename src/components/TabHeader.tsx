import Notice from '@/components/buttons/Notice';
import { Text, View } from 'react-native';

export type THeader = {
    title: string,
    text: string,
}

const Header = ({title, text}: THeader) => {
    
    return (
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{title}</Text>
          <Text style={{ color: '#7a92a5', fontSize: 16 }}>{text}</Text>
        </View>
        <Notice/>
      </View>    
    )
}

export default Header
