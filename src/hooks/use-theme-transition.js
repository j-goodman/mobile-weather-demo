import { useEffect, useMemo, useState } from 'react'
import { AccessibilityInfo, Animated } from 'react-native'
import { darkColors, lightColors } from '../theme/colors'

export function useThemeTransition(colorScheme) {
  const target = colorScheme === 'dark' ? 1 : 0
  const [progress] = useState(() => new Animated.Value(target))
  const [reduceMotion, setReduceMotion] = useState(true)

  useEffect(() => {
    let active = true
    let receivedChange = false
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', enabled => {
      receivedChange = true
      setReduceMotion(enabled)
    })

    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      if (active && !receivedChange) setReduceMotion(enabled)
    }).catch(error => {
      console.error('Unable to read Reduce Motion setting; theme animation is disabled.', error)
    })

    return () => {
      active = false
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(target)
      return
    }

    const animation = Animated.timing(progress, {
      toValue: target,
      duration: 2000,
      useNativeDriver: false,
      isInteraction: false,
    })
    animation.start()

    return () => animation.stop()
  }, [target, reduceMotion, progress])

  return useMemo(() => Object.fromEntries(
    Object.keys(lightColors).map(key => [key, progress.interpolate({
      inputRange: [0, 1],
      outputRange: [lightColors[key], darkColors[key]],
    })]),
  ), [progress])
}
