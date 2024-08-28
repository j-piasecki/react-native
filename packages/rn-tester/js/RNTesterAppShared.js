import React from 'react';
import { Button, Pressable, SafeAreaView, ScrollView, View } from 'react-native';

export default function App() {
  const [toggle, setToggle] = React.useState(false);
  return (
    <View style={{flex: 1, paddingTop: 100}}>
      <SafeAreaView style={{width: '100%', height: 200}}>
        <Pressable style={{width: 100, height: 100, backgroundColor: 'black'}} onPress={() => setToggle(!toggle)}>
          <ScrollView />
        </Pressable>
        <View style={{display: 'flex', flexDirection: 'row', flex: 1, backgroundColor: 'magenta'}}>
          <SafeAreaView style={{
            // display: 'contents',
            flex: 1,
            }}>
            <View style={{
              display: 'contents',
              width: '100%',
              height: 200,
              }}>
              <View style={{
                  display: 'contents',
                  flex: 1,
                }}>
                { toggle && <View style={{flex: 1, backgroundColor: 'yellow'}} /> }
                <View style={{flex: 1, backgroundColor: 'blue'}} />
                <View style={{flex: 1, backgroundColor: 'cyan'}} />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </View>
  );
}
