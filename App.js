import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Alert,
  Image,
  BackHandler,
} from 'react-native';
import { Constants } from 'expo-constants';

import Test from './screens/Test';

import Status from './components/Status';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';
import ImageGrid from './components/ItemGrid';
import KeyBoardState from './components/KeyboardState';
import MeasureLayout from './components/MeasureLayout';
import MessagingContainer, { INPUT_METHOD } from './components/MessagingContainer';

import { createTextMessage, createImageMessage, createLocationMessage } from './utils/MessageUtils';

export default class App extends React.Component {
  state = {
    messages: [
      createTextMessage('Hello'),
      createImageMessage('https://unsplash.it/300/300'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ],
    fullScreenImageId: null,
    isInputFocused: false,
    inputMethod: INPUT_METHOD.NONE,
  };

  componentWillMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullScreenImageId } = this.state;

      if (fullScreenImageId) {
        this.dismissFullScreenImage();
        return true;
      }

      return false;
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  handlePressToolbarCamera = () => {
    this.setState({
      isInputFocused: false,
      inputMethod: INPUT_METHOD.CUSTOM,
    });
  };

  handlePressToolbarLocation = () => {
    const { messages } = this.state;

    navigator.geolocation.getCurrentPosition((position) => {
      const { coords: { latitude, longitude } } = position;

      this.setState({
        messages: [
          createLocationMessage({
            latitude,
            longitude,
          }),
          ...messages,
        ]
      });
    });
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;

    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  handleChangeInputMethod = (inputMethod) => {
    this.setState({ inputMethod });
  };

  renderFullscreenImage = () => {
    const { messages, fullScreenImageId } = this.state;

    if (!fullScreenImageId) return null;

    const image = messages.find(message => message.id === fullScreenImageId);

    if (!image) return null;

    const { uri } = image;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullScreenImage}
      >
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  dismissFullScreenImage = () => {
    this.setState({ fullScreenImageId: null });
  };

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                const { messages } = this.state;
                this.setState({ messages: messages.filter(message => message.id !== id) });
              }
            }
          ],
        );
        break;
      case 'image':
        this.setState({ fullScreenImageId: id });
        console.log(id);
        break;
      default:
        break;
    }
  };

  handlePressImage = (uri) => {
    const { messages } = this.state;

    this.setState({
      messages: [createImageMessage(uri), ...messages],
    });
  };

  renderMessageList() {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
      </View>
    );
  }

  renderInputMethodEditor() {
    return (
      <View style={styles.inputMethodEditor}>
        <ImageGrid onPressImage={this.handlePressImage} />
      </View>
    );
  }

  renderToolbar() {
    const { isInputFocused } = this.state;

    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

  render() {
    const { inputMethod } = this.state;

    return (
      // <Test></Test>
      <View style={styles.container}>
        <Status />
        <MeasureLayout>
          {layout => (
              <KeyBoardState layout={layout}>
                {keyboardInfo => (
                  <MessagingContainer
                    {...keyboardInfo}
                    inputMethod={inputMethod}
                    onChangeInputMethod={this.handleChangeInputMethod}
                    renderInputMethodEditor={this.renderInputMethodEditor}
                  >
                    {this.renderMessageList()}
                    {this.renderToolbar()}
                  </MessagingContainer>
                )}
              </KeyBoardState>
          )}
        </MeasureLayout>
        {this.renderFullscreenImage()}
      </View>
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
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});
