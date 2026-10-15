import { useMemo, useState } from 'react'
import { Animated, FlatList, Pressable, TextInput, View, useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useThemeTransition } from '../hooks/use-theme-transition'
import { createWeatherScreenStyles } from '../styles/weatherScreen'

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const dayNames = [
  "Today", "Tomorrow", "Day after tomorrow"
]

export default function App() {
  const colorScheme = useColorScheme()
  const colors = useThemeTransition(colorScheme)
  const styles = useMemo(() => createWeatherScreenStyles(colors), [colors])
  const [city, setCity] = useState('')
  const [shownCity, setShownCity] = useState('Winnipeg')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])

  async function search () {
    console.log("Searching...")
    const key = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY
    try {
      const query = `q=${encodeURIComponent(city)}&units=metric&appid=${key}`
      const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?${query}`)
      const current = await weatherResponse.json()
      if (!weatherResponse.ok) throw new Error (current.message || "Weather not found.")
        
      const forecastResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?${query}`)
      const upcoming = await forecastResponse.json()
      if (!forecastResponse.ok) throw new Error (upcoming.message || "Weather not found.")
      setWeather(current)
      setForecast(upcoming.list.slice(0, 3))
    } catch (error) {
      setError(error.message)
    }
    console.log("weather:", weather)
    console.log("forecast:", forecast)
    setLoading(false)
  }

  return (
    <SafeAreaProvider>
      <AnimatedSafeAreaView style={styles.screen}>
        <View style={styles.mainView}>
          <Animated.Text style={styles.colorScheme}>{colorScheme}</Animated.Text>
          <Animated.Text style={styles.city}>{shownCity}</Animated.Text>
          <AnimatedTextInput
            placeholder="City name"
            value={city}
            onChangeText={setCity}
            style={styles.input}
          ></AnimatedTextInput>
          <AnimatedPressable
            onPress={() => {
              setShownCity(city)
              search()
            }}
            style={styles.searchButton}
          >
            <Animated.Text style={styles.searchButtonText}>Search</Animated.Text>
          </AnimatedPressable>
          <Animated.Text style={styles.temperature}>{weather?.main.temp}, {weather?.weather[0].main}</Animated.Text>
          {forecast.length > 0 && (
            <FlatList
              data={forecast}
              keyExtractor={item => String(item.dt)}
              renderItem={({ item }) => <Animated.Text style={styles.forecastItem}>{item.main.temp}°</Animated.Text>}
            />
          )}
          <Animated.Text style={styles.error}>{error}</Animated.Text>
        </View>
      </AnimatedSafeAreaView>
    </SafeAreaProvider>
  )
}