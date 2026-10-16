import { StyleSheet } from 'react-native'

export function createWeatherScreenStyles(colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    mainView: {
      alignItems: 'center',
      flexDirection: 'column',
      gap: 8,
      marginVertical: 20,
      paddingTop: 90,
      margin: 0,
    },
    colorScheme: {
      color: colors.text,
    },
    city: {
      fontSize: 40,
      color: colors.text,
    },
    input: {
      textAlign: 'center',
      fontSize: 24,
      color: colors.inputText,
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
    },
    searchButton: {
      backgroundColor: colors.searchButton,
      borderRadius: 5,
    },
    searchButtonText: {
      color: colors.searchButtonText,
      padding: 8,
    },
    temperature: {
      fontSize: 24,
      color: colors.text,
    },
    forecastItem: {
      color: colors.text,
    },
    error: {
      color: colors.text,
    },
  })
}
