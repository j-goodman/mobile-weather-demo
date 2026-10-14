import { useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const styles = StyleSheet.create({
  mainView: {
    alignItems: "center",
    flexDirection: "column",
    gap: 8,
    marginVertical: 20,
    paddingTop: 90,
    margin: 0,
  }
})

const forecast = [
  { day: 0, temp: 16, weather: "Cloudy" },
  { day: 1, temp: 19, weather: "Partly Cloudy" },
  { day: 2, temp: 20, weather: "Sunny" }
]

const dayNames = [
  "Today", "Tomorrow", "Day after tomorrow"
]

export default function App() {
  const [city, setCity] = useState('')
  const [shownCity, setShownCity] = useState('Winnipeg')

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: "#abf",
      }}>
        <View style={styles.mainView}>
          <Text style={{
            fontSize: 40,
          }}>{shownCity}</Text>
          <TextInput
            placeholder="City name"
            value={city}
            onChangeText={setCity}
            style={{
              textAlign: "center",
              fontSize: 24
            }}
          ></TextInput>
          <Pressable
            onPress={() => {
              setShownCity(city)
            }}
            style={{
              backgroundColor: "rgb(53, 70, 177)",
              borderRadius: 8
            }}
          >
            <Text
              style={{
                color: "#fff",
                padding: 8,
              }}
            >Search</Text>
          </Pressable>
          <Text style={{
            fontSize: 24
          }}>16°, Cloudy</Text>
          <FlatList
            data={forecast}
            keyExtractor={item => item.day}
            renderItem={({ item }) => <Text>{dayNames[item.day]}: {item.temp}°</Text>}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}