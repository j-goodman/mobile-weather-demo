import { useEffect, useMemo, useState } from 'react'
import { FlatList, Pressable, Text, TextInput, View, useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { createWeatherScreenStyles } from '../styles/weatherScreen'
import { darkColors, lightColors } from '../theme/colors'

const dayNames = [
  "Today", "Tomorrow", "Day after tomorrow"
]

type SavedCity = {
  _id: string
  name: string
}

const citiesUrl = 'https://mobile-weather-server-demo.onrender.com/api/cities'

async function fetchSavedCities(): Promise<SavedCity[]> {
  const response = await fetch(citiesUrl)
  if (!response.ok) throw new Error(`Failed to load saved cities (${response.status})`)
  return response.json()
}

export default function App() {
  const colorScheme = useColorScheme()
  const colors = colorScheme === 'dark' ? darkColors : lightColors
  const styles = useMemo(() => createWeatherScreenStyles(colors), [colors])
  const [city, setCity] = useState('')
  const [shownCity, setShownCity] = useState('Enter a City Below')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [savedCities, setSavedCities] = useState<SavedCity[]>([])
  const [savingCity, setSavingCity] = useState(false)

  useEffect(() => {
    async function loadSavedCities() {
      try {
        setSavedCities(await fetchSavedCities())
      } catch (error) {
        console.error('Failed to load saved cities:', error)
      }
    }

    void loadSavedCities()
  }, [])

  async function saveCity() {
    if (savingCity) return
    const name = city.trim()
    if (!name) {
      setError('Enter a city name before saving.')
      return
    }

    setSavingCity(true)
    setError('')
    let saved = false
    try {
      const response = await fetch(citiesUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) throw new Error(`Failed to save city (${response.status})`)
      saved = true
      setSavedCities(await fetchSavedCities())
    } catch (error) {
      const message = error instanceof Error ? error.message : 'City request failed.'
      setError(saved ? `City saved, but the list could not be refreshed: ${message}` : message)
    } finally {
      setSavingCity(false)
    }
  }

  async function search (cityToSearch = city) {
    console.log("Searching...")
    const key = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY
    try {
      const query = `q=${encodeURIComponent(cityToSearch)}&units=metric&appid=${key}`
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
      <SafeAreaView style={styles.screen}>
        <View style={styles.mainView}>
          <Text style={styles.city}>{shownCity}</Text>
          <TextInput
            placeholder="City name"
            value={city}
            onChangeText={setCity}
            style={styles.input}
          />
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => {
                setShownCity(city)
                search()
              }}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
            <Pressable
              onPress={saveCity}
              disabled={savingCity}
              style={styles.searchButton}
              accessibilityRole="button"
              accessibilityState={{ disabled: savingCity, busy: savingCity }}
            >
              <Text style={styles.searchButtonText}>{savingCity ? 'Saving...' : 'Save City'}</Text>
            </Pressable>
          </View>
          <Text style={styles.temperature}>{weather?.main.temp}, {weather?.weather[0].main}</Text>
          {forecast.length > 0 && (
            <FlatList
              data={forecast}
              keyExtractor={item => String(item.dt)}
              renderItem={({ item }) => <Text style={styles.forecastItem}>{item.main.temp}°</Text>}
            />
          )}
          <Text style={styles.error}>{error}</Text>
          <FlatList
            data={savedCities}
            keyExtractor={item => item._id}
            renderItem={({ item }) => <Pressable onPress={() => {
              setShownCity(item.name)
              setCity(item.name)
              console.log(item.name)
              search(item.name)
            }}><Text style={styles.forecastItem}>{item.name}</Text></Pressable>}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}