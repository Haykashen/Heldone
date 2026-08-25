// Описываем единый интерфейс палитры, чтобы темы гарантированно совпадали по ключам
export interface IAppColors {
  name: string;  
  containerBg: string;
  cardBg: string;
  cardBgCompleted: string;
  borderColor: string;
  headerRowBg: string;
  
  titleText: string;
  titleTextCompleted: string;
  subtitleText: string;
  metaText: string;
  
  sectionTitle: string;
  missedSectionTitle: string;
  completedSectionTitle: string;
  
  badgeBg: string;
  badgeText: string;
  missedBadgeBg: string;
  completedBadgeBg: string;
  bulletColor: string;
  
  checkboxOutline: string;
  bellOff: string;
  shadowColor: string;
  shadowOpacity: number;
  fabBg: string;
}

// 🌑 Палитра для Темной Темы
const darkTheme: IAppColors = {
  name:'dark',
  containerBg: '#031F2B',
  cardBg: '#1C3542',
  cardBgCompleted: '#142731',
  borderColor: '#263238',
  headerRowBg: '#031F2B',
  
  titleText: '#FFFFFF',
  titleTextCompleted: '#7A92A5',
  subtitleText: '#7A92A5',
  metaText: '#9BB0C1',
  
  sectionTitle: '#7A92A5',
  missedSectionTitle: '#FF453A',
  completedSectionTitle: '#4CD964',
  
  badgeBg: '#263238',
  badgeText: '#FFFFFF',
  missedBadgeBg: 'rgba(255, 69, 58, 0.2)',
  completedBadgeBg: 'rgba(76, 217, 100, 0.2)',
  bulletColor: '#263238',
  
  checkboxOutline: '#7A92A5',
  bellOff: '#7A92A5',
  shadowColor: '#000000',
  shadowOpacity: 0.3,
  fabBg: '#007AFF'
};

// ☀️ Палитра для Светлой Темы
const lightTheme: IAppColors = {
  name:'light',  
  containerBg: '#F8FAFC',
  cardBg: '#FFFFFF',
  cardBgCompleted: '#F8FAFC',
  borderColor: '#E2E8F0',
  headerRowBg: '#F8FAFC',
  
  titleText: '#1E293B',
  titleTextCompleted: '#94A3B8',
  subtitleText: '#64748B',
  metaText: '#64748B',
  
  sectionTitle: '#64748B',
  missedSectionTitle: '#EF4444',
  completedSectionTitle: '#22C55E',
  
  badgeBg: '#E2E8F0',
  badgeText: '#334155',
  missedBadgeBg: '#FEE2E2',
  completedBadgeBg: '#DCFCE7',
  bulletColor: '#E2E8F0',
  
  checkboxOutline: '#94A3B8',
  bellOff: '#94A3B8',
  shadowColor: '#0F172A',
  shadowOpacity: 0.15,
  fabBg: '#007AFF'
};

export const ThemeColors = {
  dark: darkTheme,
  light: lightTheme,
};
