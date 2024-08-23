import React from 'react';
import { SafeAreaView, View } from 'react-native';

export default function App() {
  return (
    <View style={{flex: 1, paddingTop: 100}}>
      <SafeAreaView style={{width: '100%', height: 200}}>
        <View style={{flex: 1, backgroundColor: 'red'}} />
        <View style={{flex: 2, backgroundColor: 'green'}} />
        <SafeAreaView style={{display: 'contents'}}>
          <View style={{flex: 1, backgroundColor: 'blue'}} />
          <View style={{flex: 1, backgroundColor: 'cyan'}} />
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}
