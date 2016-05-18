'use strict';

var React = require('react-native');
var {
  LinkingIOS,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text
} = React;

var nativeModules = require('react-native').NativeModules;
var ImagePickerManager = nativeModules.ImagePickerManager;
//var AddKidChat = require('react-native-gifted-messenger');
var AddKidChat = require('./AddKidChat')


var addKid = React.createClass({
  getMessages() {

  },

  handleReceive(message = {}) {
    this._AddKidChat.appendMessage(message);
  },

  onErrorButtonPress(message = {}, rowID = null) {
    // Your logic here
    // Eg: Re-send the message to your server
  },

  // will be triggered when the Image of a row is touched
  onImagePress(rowData = {}, rowID = null) {
    // Your logic here
    // Eg: Navigate to the user profile
  },


  render() {
    return (
      <AddKidChat
        ref={(c) => this._AddKidChat = c}

        styles={{
          bubbleRight: {
            marginLeft: 70,
            backgroundColor: '#007aff',
          },
        }}

        autoFocus={false}
        messages={this.getMessages()}
        handleSend={this.handleSend}
        onErrorButtonPress={this.onErrorButtonPress}
        maxHeight={Dimensions.get('window').height - navBarHeight - statusBarHeight}
        loadEarlierMessagesButton={true}
        onLoadEarlierMessages={this.onLoadEarlierMessages}

        senderName='User'
        senderImage={null}
        onImagePress={this.onImagePress}
        displayNames={true}

        parseText={true} // enable handlePhonePress and handleUrlPres
        handleUrlPress={this.handleUrlPress}

        inverted={true}
      />

    );
  },

  handleUrlPress(url) {
    if (Platform.OS !== 'android') {
      LinkingIOS.openURL(url);
    }
  },

});

var navBarHeight = (Platform.OS === 'android' ? 56 : 64);
// warning: height of android statusbar depends of the resolution of the device
// http://stackoverflow.com/questions/3407256/height-of-status-bar-in-android
// @todo check Navigator.NavigationBar.Styles.General.NavBarHeight
var statusBarHeight = (Platform.OS === 'android' ? 25 : 0);


module.exports = addKid;
