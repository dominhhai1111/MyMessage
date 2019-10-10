import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { Constants } from 'expo-constants';

import Status from './components/Status';

export default class App extends React.Component {
  renderMessageList() {
    return (
      <View style={styles.content}></View>
    );
  }

  renderInputMethodEditor() {
    return (
      <View style={styles.inputMethodEditor}></View>
    );
  }

  renderToolbar() {
    return (
      <View style={styles.toolbar}></View>
    );
  }

  render() {
    return (
      // <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#00BCD4" translucent = {true}/>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      // <View style={styles.container}>
      //   <Status />
      //   {this.renderMessageList()}
      //   {this.renderToolbar()}
      //   {this.renderInputMethodEditor()}
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
});
