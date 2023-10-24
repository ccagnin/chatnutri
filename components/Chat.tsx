import React from 'react';
import { View, Text, TextInput } from 'react-native';

const ChatComponent = ({ question, answer, setAnswer }) => {
  return (
    <View>
      <Text>{question}</Text>
      {/* <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Digite sua resposta"
        value={answer}
        onChangeText={setAnswer}
      /> */}
    </View>
  );
};

export default ChatComponent;
