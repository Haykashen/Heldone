import { SettingContext } from '@/context/SettingContext';
import { Column, FieldGroup, Host, Icon, Row, Spacer, Switch, Text } from '@expo/ui';
import { router } from 'expo-router';
import { useCallback, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STAR = Icon.select({
  ios: 'star.fill',
  android: require('@/assets/icons/clock_outline.xml'),
});
const CHEVRON = Icon.select({
  ios: 'chevron.right',
  android: require('@expo/material-symbols/chevron_right.xml'),
});

const notification_active = Icon.select({
  ios: 'chevron.right',
  android: require('@/assets/icons/notifications_active_24px.xml'),
});

const notification_off = Icon.select({
  ios: 'chevron.right',
  android: require('@/assets/icons/notifications_off_24px.xml'),
});

const flag = Icon.select({
  ios: 'chevron.right',
  android: require('@/assets/icons/flag.xml'),
});

const target = Icon.select({
  ios: 'chevron.right',
  android: require('@/assets/icons/bullseye_arrow.xml'),
});

const help = Icon.select({
  ios: 'chevron.right',
  android: require('@/assets/icons/help_circle_outline.xml'),
});

const forum = Icon.select({
  ios: 'chevron.right',
  android: require('@/assets/icons/forum_outline.xml'),
});

const star = Icon.select({
  ios: 'chevron.right',
  android: require('@/assets/icons/family_star_24px.xml'),
});

const info = Icon.select({
  ios: 'chevron.right',
  android: require('@/assets/icons/info_24px.xml'),
});

const back = Icon.select({
  ios: 'chevron.right',
  android: require('@/assets/icons/arrow_back_24px.xml'),
});


const Example = () => {
  const {
    defaultCategory, setDefaultCategory,
    defaultPriority, setDefaultPriority,
    defaultTime, setDefaultTime,
    defaultNotify, setDefaultNotify
  } = useContext(SettingContext);

  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'blue', flex: 1 }}>
      <Host style={{ backgroundColor: 'green', flex: 1 }}>
        <FieldGroup>
          <FieldGroup.SectionHeader>

            <Row alignment='center'>
              <Column>
                <Text textStyle={{ fontSize: 22, fontWeight: 'bold', color: ink.color }}>Настройки</Text>
                <Text textStyle={{ fontSize: 14, color: ink.color }}>приложения и аккаунта</Text>
              </Column>
            </Row>
          </FieldGroup.SectionHeader>
          <FieldGroup.Section title="Значения по умолчанию">
            <Row alignment='center'>
              <Icon name={STAR} size={28} />
              <Spacer size={12} />
              <Column>
                <Text textStyle={{ fontSize: 16, fontWeight: 'bold' }}>{defaultTime}</Text>
                <Text textStyle={{ fontSize: 10 }}>Время</Text>
              </Column>
              <Spacer flexible />
              <Icon name={CHEVRON} size={18} color="gray" />
            </Row>
            <Row alignment='center'>
              <Icon name={defaultNotify ? notification_active : notification_off} size={28} />
              <Spacer size={12} />
              <Switch label="Создавать уведомления" value={defaultNotify} onValueChange={(value) => setDefaultNotify(value)} />
            </Row>
            <Row alignment='center'>
              <Icon name={flag} size={28} color={'red'} />
              <Spacer size={12} />
              <Column>
                <Text textStyle={{ fontSize: 16 }}>Высокий</Text>
                <Text textStyle={{ fontSize: 10 }}>Приоритет</Text>
              </Column>
              <Spacer flexible />
              <Icon name={CHEVRON} size={18} color="gray" />
            </Row>
            <Row alignment='center'>
              <Icon name={target} size={28} color={'#4894FE'} />
              <Spacer size={12} />
              <Column>
                <Text textStyle={{ fontSize: 16 }}>Цель</Text>
                <Text textStyle={{ fontSize: 10 }}>Категория</Text>
              </Column>
              <Spacer flexible />
              <Icon name={CHEVRON} size={18} color="gray" />
            </Row>
          </FieldGroup.Section>
          <FieldGroup.Section title="О приложении">
            <Row alignment='center'>
              <Icon name={star} size={28} />
              <Spacer size={12} />
              <Text>Оценить приложение</Text>
            </Row>
            <Row alignment='center'>
              <Icon name={help} size={28} />
              <Spacer size={12} />
              <Text>Задать вопрос</Text>
            </Row>
            <Row alignment='center'>
              <Icon name={forum} size={28} />
              <Spacer size={12} />
              <Text>Сообщить об ошибке</Text>
            </Row>
            <Row alignment='center'>
              <Icon name={info} size={28} />
              <Spacer size={12} />
              <Text>Версия 1.0.0</Text>
            </Row>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </SafeAreaView>

  );
}

export default Example;