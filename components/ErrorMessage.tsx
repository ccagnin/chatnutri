import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ErrorMessage } from './types'


const ErrorMessage: React.FC<ErrorMessage> = ({ message }) => {
  return (
    <View>
      <Text>{message}</Text>
    </View>
  )
}

export default ErrorMessage
