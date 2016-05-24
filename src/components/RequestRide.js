'use strict';

var React = require('react-native');
import Message from './Message';
var nativeModules = require('react-native').NativeModules;
var ImagePickerManager = nativeModules.ImagePickerManager;
var GiftedSpinner = require('react-native-gifted-spinner');
var {
Text,
View,
ListView,
TextInput,
Dimensions,
Animated,
Image,
TouchableHighlight,
Platform,
Wrapper,
Picker,
PixelRatio
} = React;

var moment = require('moment');

var Button = require('react-native-button');
const Firebase = require('firebase');
//const FirebaseUrl = 'https://luminous-heat-9071.firebaseio.com/';
const FirebaseUrl = 'https://ujama.firebaseio.com';

var AddKidChat = React.createClass({

firstDisplay: true,
listHeight: 0,
footerY: 0,

getDefaultProps() {
  return {
    displayNames: true,
    displayNamesInsideBubble: false,
    placeholder: '',
    styles: {},
    autoFocus: true,
    onErrorButtonPress: (message, rowID) => {},
    loadEarlierMessagesButton: false,
    loadEarlierMessagesButtonText: 'Load earlier messages',
    onLoadEarlierMessages: (oldestMessage, callback) => {},
    parseText: false,
    handleUrlPress: (url) => {},
    handlePhonePress: (phone) => {},
    handleEmailPress: (email) => {},
    initialMessages: [],
    messages: [],
    handleSend: (message, rowID) => {},
    maxHeight: Dimensions.get('window').height,
    senderName: 'Sender',
    senderImage: null,
    sendButtonText: 'Send',
    onImagePress: null,
    onMessageLongPress: null,
    hideTextInput: true,
    keyboardDismissMode: 'interactive',
    keyboardShouldPersistTaps: true,
    submitOnReturn: false,
    forceRenderImage: false,
    onChangeText: (text) => {},
    autoScroll: false,
  };
},

propTypes: {
  displayNames: React.PropTypes.bool,
  displayNamesInsideBubble: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  styles: React.PropTypes.object,
  autoFocus: React.PropTypes.bool,
  onErrorButtonPress: React.PropTypes.func,
  loadMessagesLater: React.PropTypes.bool,
  loadEarlierMessagesButton: React.PropTypes.bool,
  loadEarlierMessagesButtonText: React.PropTypes.string,
  onLoadEarlierMessages: React.PropTypes.func,
  parseText: React.PropTypes.bool,
  handleUrlPress: React.PropTypes.func,
  handlePhonePress: React.PropTypes.func,
  handleEmailPress: React.PropTypes.func,
  initialMessages: React.PropTypes.array,
  messages: React.PropTypes.array,
  handleSend: React.PropTypes.func,
  onCustomSend: React.PropTypes.func,
  renderCustomText: React.PropTypes.func,
  maxHeight: React.PropTypes.number,
  senderName: React.PropTypes.string,
  senderImage: React.PropTypes.object,
  sendButtonText: React.PropTypes.string,
  onImagePress: React.PropTypes.func,
  onMessageLongPress: React.PropTypes.func,
  hideTextInput: React.PropTypes.bool,
  keyboardDismissMode: React.PropTypes.string,
  keyboardShouldPersistTaps: React.PropTypes.bool,
  forceRenderImage: React.PropTypes.bool,
  onChangeText: React.PropTypes.func,
  autoScroll: React.PropTypes.bool,
},

getInitialState: function() {
  this._data = [];
  this._rowIds = [];

  this.userProfileRef = new Firebase(FirebaseUrl);

  this.userProfileRef.on('value', (snap) => {
    console.log("THis is sanp", snap.val());
    // get children as an array

  })

  var textInputHeight = 44;
  if (this.props.hideTextInput === false) {
    if (this.props.styles.hasOwnProperty('textInputContainer')) {
      textInputHeight = this.props.styles.textInputContainer.height || textInputHeight;
    }
  }


  this.listViewMaxHeight = this.props.maxHeight - textInputHeight;

  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
    if (typeof r1.status !== 'undefined') {
      return true;
    }
    return r1 !== r2;
  }});

  var FirstChat = {
  "chatText" : "For whom is this ride?",
  "ActionType" : [{
      "Field" : "Button",
      "FieldText" : "Danniel",
      "FieldAction" : "wrapthis.requestRide.bind(null,'kid','Danniel')",
      "style":""
    },{
        "Field" : "Button",
        "FieldText" : "Dineo",
        "FieldAction" : "wrapthis.requestRide.bind(null,'kid','Dineo')",
        "style":""
      },
      {
          "Field" : "Button",
          "FieldText" : "Add Child",
          "FieldAction" : "wrapthis.requestRide.bind(null,'kid','Add Child Activity')",
          "style":""
        }
    ]
  }

  setTimeout(() => {this.appendMessage({text: FirstChat["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date(2015, 10, 16, 19, 0)})}, 200);
  return {
    hideTextInputState: false,
    userState: 0,
    dataSource: ds.cloneWithRows([]),
    text: '',
    disabled: true,
    CurrentState : 1,
    StateTemplate: FirstChat,
    kidName : "",
    height: new Animated.Value(this.listViewMaxHeight),
    isLoadingEarlierMessages: false,
    allLoaded: false,
    appearAnim: new Animated.Value(0),
  };
},

getMessage(rowID) {
  if (typeof this._rowIds[this._rowIds.indexOf(rowID)] !== 'undefined') {
    if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID)]] !== 'undefined') {
      return this._data[this._rowIds[this._rowIds.indexOf(rowID)]];
    }
  }
  return null;
},

updateUserState(value){
  this.setState({
    userState : value
  })
},
getPreviousMessage(rowID) {
  if (typeof this._rowIds[this._rowIds.indexOf(rowID - 1)] !== 'undefined') {
    if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]] !== 'undefined') {
      return this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]];
    }
  }
  return null;
},

getNextMessage(rowID) {
  if (typeof this._rowIds[this._rowIds.indexOf(rowID + 1)] !== 'undefined') {
    if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]] !== 'undefined') {
      return this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]];
    }
  }
  return null;
},

renderDate(rowData = {}, rowID = null) {
  var diffMessage = null;
  if (rowData.isOld === true) {
    diffMessage = this.getPreviousMessage(rowID);
  } else {
    diffMessage = this.getNextMessage(rowID);
  }
  if (rowData.date instanceof Date) {
    if (diffMessage === null) {
      return (
        <Text style={[this.styles.date]}>
          {moment(rowData.date).calendar()}
        </Text>
      );
    } else if (diffMessage.date instanceof Date) {
      let diff = moment(rowData.date).diff(moment(diffMessage.date), 'minutes');
      if (diff > 5) {
        return (
          <Text style={[this.styles.date]}>
            {moment(rowData.date).calendar()}
          </Text>
        );
      }
    }
  }
  return null;
},

renderRow(rowData = {}, sectionID = null, rowID = null) {

  var diffMessage = null;
  if (rowData.isOld === true) {
    diffMessage = this.getPreviousMessage(rowID);
  } else {
    diffMessage = this.getNextMessage(rowID);
  }

  return (
    <View>
      {this.renderDate(rowData, rowID)}
      <Message
        rowData={rowData}
        rowID={rowID}
        onErrorButtonPress={this.props.onErrorButtonPress}
        displayNames={this.props.displayNames}
        displayNamesInsideBubble={this.props.displayNamesInsideBubble}
        diffMessage={diffMessage}
        position={rowData.position}
        forceRenderImage={this.props.forceRenderImage}
        onImagePress={this.props.onImagePress}
        onMessageLongPress={this.props.onMessageLongPress}
        renderCustomText={this.props.renderCustomText}

        styles={this.styles}
      />
    </View>
  )
},

onChangeText(text) {
  this.setState({
    text: text
  })
  if (text.trim().length > 0) {
    this.setState({
      disabled: false
    })
  } else {
    this.setState({
      disabled: true
    })
  }

  this.props.onChangeText(text);
},

componentDidMount() {
  this.scrollResponder = this.refs.listView.getScrollResponder();

  if (this.props.messages.length > 0) {
    this.appendMessages(this.props.messages);
  } else if (this.props.initialMessages.length > 0) {
    this.appendMessages(this.props.initialMessages);
  } else {
    // Set allLoaded, unless props.loadMessagesLater is set
    if (!this.props.loadMessagesLater) {
      this.setState({
        allLoaded: true
      });
    }
  }

},

componentWillReceiveProps(nextProps) {
  this._data = [];
  this._rowIds = [];
  this.appendMessages(nextProps.messages);

  var textInputHeight = 44;
  if (nextProps.styles.hasOwnProperty('textInputContainer')) {
    textInputHeight = nextProps.styles.textInputContainer.height || textInputHeight;
  }

  if (nextProps.maxHeight !== this.props.maxHeight) {
    this.listViewMaxHeight = nextProps.maxHeight;
  }

  if (nextProps.hideTextInput && !this.props.hideTextInput) {
    this.listViewMaxHeight += textInputHeight;

    this.setState({
      height: new Animated.Value(this.listViewMaxHeight),
    });
  } else if (!nextProps.hideTextInput && this.props.hideTextInput) {
    this.listViewMaxHeight -= textInputHeight;

    this.setState({
      height: new Animated.Value(this.listViewMaxHeight),
    });
  }
},

onKeyboardWillHide(e) {
  Animated.timing(this.state.height, {
    toValue: this.listViewMaxHeight,
    duration: 150,
  }).start();
},

onKeyboardWillShow(e) {
  Animated.timing(this.state.height, {
    toValue: this.listViewMaxHeight - (e.endCoordinates ? e.endCoordinates.height : e.end.height),
    duration: 200,
  }).start();
},

onKeyboardDidShow(e) {
  if(React.Platform.OS == 'android') {
    this.onKeyboardWillShow(e);
  }
  this.scrollToBottom();
},
onKeyboardDidHide(e) {
  if(React.Platform.OS == 'android') {
    this.onKeyboardWillHide(e);
  }
},

scrollToBottom() {
  if (this.listHeight && this.footerY && this.footerY > this.listHeight) {
    var scrollDistance = this.listHeight - this.footerY;
    this.scrollResponder.scrollTo({
      y: -scrollDistance,
    });
  }
},

scrollWithoutAnimationToBottom() {
  if (this.listHeight && this.footerY && this.footerY > this.listHeight) {
    var scrollDistance = this.listHeight - this.footerY;
    this.scrollResponder.scrollTo({
      y: -scrollDistance,
      x: 0,
      animated: false,
    });
  }
},

onSend() {
  var message = {
    text: this.state.text.trim(),
    name: this.props.senderName,
    image: this.props.senderImage,
    position: 'right',
    date: new Date(),
  };
  if (this.props.onCustomSend) {
    this.props.onCustomSend(message);
  } else {
    var rowID = this.appendMessage(message, true);
    this.props.handleSend(message, rowID);
    this.onChangeText('');
  }
},

postLoadEarlierMessages(messages = [], allLoaded = false) {
  this.prependMessages(messages);
  this.setState({
    isLoadingEarlierMessages: false
  });
  if (allLoaded === true) {
    this.setState({
      allLoaded: true,
    });
  }
},

preLoadEarlierMessages() {
  this.setState({
    isLoadingEarlierMessages: true
  });
  this.props.onLoadEarlierMessages(this._data[this._rowIds[this._rowIds.length - 1]], this.postLoadEarlierMessages);
},

renderLoadEarlierMessages() {
  if (this.props.loadEarlierMessagesButton === true) {
    if (this.state.allLoaded === false) {
      if (this.state.isLoadingEarlierMessages === true) {
        return (
          <View style={this.styles.loadEarlierMessages}>
            <GiftedSpinner />
          </View>
        );
      } else {
        return (
          <View style={this.styles.loadEarlierMessages}>
            <Button
              style={this.styles.loadEarlierMessagesButton}
              onPress={() => {this.getImageUploader(this)}}
            >
              Upload
            </Button>
          </View>
        );
      }
    }
  }
  return null;
},

prependMessages(messages = []) {
  var rowID = null;
  for (let i = 0; i < messages.length; i++) {
    this._data.push(messages[i]);
    this._rowIds.unshift(this._data.length - 1);
    rowID = this._data.length - 1;
  }
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
  });
  return rowID;
},

prependMessage(message = {}) {
  var rowID = this.prependMessages([message]);
  return rowID;
},

appendMessages(messages = []) {
  var rowID = null;
  for (let i = 0; i < messages.length; i++) {
    messages[i].isOld = true;
    this._data.push(messages[i]);
    this._rowIds.push(this._data.length - 1);
    rowID = this._data.length - 1;
  }
  console.log("This is Data", this._data);
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
  });

  return rowID;
},

appendMessage(message = {}, scrollToBottom = true) {
    var rowID = this.appendMessages([message]);



  if (scrollToBottom === true) {
    setTimeout(() => {
      // inspired by http://stackoverflow.com/a/34838513/1385109
      this.scrollToBottom();
    }, (Platform.OS === 'android' ? 200 : 100));
  }

  return rowID;
},

refreshRows() {
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
  });
},

setMessageStatus(status = '', rowID) {
  if (status === 'ErrorButton') {
    if (this._data[rowID].position === 'right') {
      this._data[rowID].status = 'ErrorButton';
      this.refreshRows();
    }
  } else {
    if (this._data[rowID].position === 'right') {
      this._data[rowID].status = status;

      // only 1 message can have a status
      for (let i = 0; i < this._data.length; i++) {
        if (i !== rowID && this._data[i].status !== 'ErrorButton') {
          this._data[i].status = '';
        }
      }
      this.refreshRows();
    }
  }
},

renderAnimatedView() {
  return (
    <Animated.View
      style={{
        height: this.state.height,
      }}

    >
      <ListView
        ref='listView'
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderHeader={this.renderLoadEarlierMessages}
        onLayout={(event) => {
          var layout = event.nativeEvent.layout;
          console.log("This is layout Height", layout.height);
          this.listHeight = 700;
          if (this.firstDisplay === true) {
            requestAnimationFrame(() => {
              this.firstDisplay = false;
              this.scrollWithoutAnimationToBottom();
            });
          }

        }}
        renderFooter={() => {
          return <View onLayout={(event)=>{
            var layout = event.nativeEvent.layout;
            this.footerY = layout.y;

            if (this.props.autoScroll) {
              this.scrollToBottom();
            }
          }}></View>
        }}


        style={this.styles.listView}


        // not working android RN 0.14.2
        onKeyboardWillShow={this.onKeyboardWillShow}
        onKeyboardDidShow={this.onKeyboardDidShow}
        onKeyboardWillHide={this.onKeyboardWillHide}
        onKeyboardDidHide={this.onKeyboardDidHide}


        keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps} // @issue keyboardShouldPersistTaps={false} + textInput focused = 2 taps are needed to trigger the ParsedText links
        keyboardDismissMode={this.props.keyboardDismissMode}


        initialListSize={10}
        pageSize={this.props.messages.length}


        {...this.props}
      />

    </Animated.View>
  );
},

render() {
  return (
    <View
      style={this.styles.container}
      ref='container'
    >
      {this.renderAnimatedView()}
      {this.renderTextInput()}
    </View>
  )
},

renderTextInput() {
  if (this.props.hideTextInput === false) {
    return (
      <View style={this.styles.textInputContainer}>
        <TextInput
          style={this.styles.textInput}
          placeholder={this.props.placeholder}
          ref='textInput'
          onChangeText={this.onChangeText}
          value={this.state.text}
          autoFocus={this.props.autoFocus}
          returnKeyType={this.props.submitOnReturn ? 'send' : 'default'}
          onSubmitEditing={this.props.submitOnReturn ? this.onSend : null}
          enablesReturnKeyAutomatically={true}

          blurOnSubmit={false}
        />
        <Button
          style={this.styles.sendButton}
          styleDisabled={this.styles.sendButtonDisabled}
          onPress={this.onSend}
          disabled= {false}
        >
          {this.props.sendButtonText}
        </Button>
      </View>
    );
  }else if(this.props.hideTextInput === true){
    var items = this.state.StateTemplate["ActionType"]
    switch(items[0]["Field"]){
      case "Text":
      return (
        <View style={this.styles.textInputContainer}>
          <TextInput
            style={this.styles.textInput}
            placeholder={this.props.placeholder}
            ref='textInput'
            onChangeText={this.onChangeText}
            value={this.state.text}
            autoFocus={this.props.autoFocus}
            returnKeyType={this.props.submitOnReturn ? 'send' : 'default'}
            onSubmitEditing={this.props.submitOnReturn ? this.onSend : null}
            enablesReturnKeyAutomatically={true}

            blurOnSubmit={false}
          />
          <Button
            style={this.styles.sendButton}
            styleDisabled={this.styles.sendButtonDisabled}
            onPress={eval(this.state.StateTemplate["ActionType"][0]["FieldAction"])}
            disabled= {false}
          >
            {this.props.sendButtonText}
          </Button>
        </View>
      );
      break;

      case "Button":
          var wrapthis = this;

          var items = this.state.StateTemplate["ActionType"]
          const renderedButtons =  items.map(b => {
            return <Button style={wrapthis.styles.button} key={b.FieldText} onPress={eval(b.FieldAction)}> {b.FieldText} </Button>;
          });

          return(
            <View style={wrapthis.styles.ButtonValContainer} key={'UNIQUE_KEY_HERE'}>
              {renderedButtons}
            </View>
          );
      break;

      case "Options":
          console.log("In OPtions")
          var itemsVal = this.state.StateTemplate["ActionType"]
          const renderedOptions =  itemsVal.map(val => {
            console.log("This is Item", val);
            return <Picker.Item label={val.FieldText} value={val.FieldAction} key={val.FieldText}/>;
          });
          console.log("This is rendered Options", renderedOptions);
          return(
            <View style={this.styles.optionsContainer}>
            <Picker
            style={this.styles.picker}
        selectedValue={this.state.pickupTime}
        onValueChange={(lang) => this.setState({pickupTime: lang})}>
        {renderedOptions}
        </Picker>
        <Button
        style={this.styles.sendButton}
        styleDisabled={this.styles.sendButtonDisabled}
        onPress={this.addTime}
        disabled= {false}
        >
        {this.props.sendButtonText}
        </Button>
            </View>
          );
      break;


      default : console.log("In Ujama Project");
    }
    //setTimeout(() => {this.appendMessage({text: this.state.firstStateTemplate["showText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date(2015, 10, 16, 19, 0)})}, 500)

}
  return null;
},

addTime(){
  var message = {
    text: this.state.pickupTime,
    name: this.props.senderName,
    image: this.props.senderImage,
    position: 'right',
    date: new Date(),
  };

  var rowID = this.appendMessage(message, true);
  this.setState({
        StateTemplate : {
        "chatText" : "Request A Ride",
        "ActionType" : [{
            "Field" : "Text",
            "FieldText" : "20th May 2016",
            "FieldAction" : "",
            "style":""
          },{
              "Field" : "Text",
              "FieldText" : "21st May 2016",
              "FieldAction" : "",
              "style":""
            },
            {
                "Field" : "Text",
                "FieldText" : "22nd May 2016",
                "FieldAction" : "",
                "style":""
              }
          ]
        }
      });
      setTimeout(() => {this.appendMessage({text: this.state.StateTemplate["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date()})}, 1000);

},
requestRide(infoType,kidName) {
  var message;
  var rowID;
  if(kidName == 'other'){

  }
  else{
     message = {
      text: kidName,
      name: this.props.senderName,
      image: this.props.senderImage,
      position: 'right',
      date: new Date(),
    };
     rowID = this.appendMessage(message, true);
  }
  if (this.props.onCustomSend) {
    this.props.onCustomSend(message);
  } else {

    if(infoType == 'kid'){
      this.setState({
          CurrentState : 1,
          StateTemplate : {
          "chatText" : "For Which Activity?",
          "ActionType" : [{
              "Field" : "Button",
              "FieldText" : "School",
              "FieldAction" : "wrapthis.requestRide.bind(null,'activity','School')",
              "style":""
            },{
                "Field" : "Button",
                "FieldText" : "Russian Math",
                "FieldAction" : "wrapthis.requestRide.bind(null,'activity','Russian Math')",
                "style":""
              }
            ]
          },
      });
    }else if(infoType == 'activity'){
      this.setState({
          CurrentState : 1,
          StateTemplate : {
          "chatText" : "For Which Day?",
          "ActionType" : [{
              "Field" : "Button",
              "FieldText" : "Today",
              "FieldAction" : "wrapthis.requestRide.bind(null,'day','Today')",
              "style":""
            },{
                "Field" : "Button",
                "FieldText" : "Tomorrow",
                "FieldAction" : "wrapthis.requestRide.bind(null,'day','Tomorrow')",
                "style":""
              },
              {
                  "Field" : "Button",
                  "FieldText" : "Pick other Day",
                  "FieldAction" : "wrapthis.requestRide.bind(null,'day','other')",
                  "style":""
                }
            ]
          },
      });
    }
    else if(infoType == 'day'){
      if(kidName == 'other'){
        this.setState({
        StateTemplate : {
        "chatText" : "Pick Up a Date",
        "ActionType" : [{
            "Field" : "Options",
            "FieldText" : "20th May 2016",
            "FieldAction" : "20th May 2016",
            "style":""
          },{
              "Field" : "Options",
              "FieldText" : "21st May 2016",
              "FieldAction" : "21st May 2016",
              "style":""
            },
            {
                "Field" : "Options",
                "FieldText" : "22nd May 2016",
                "FieldAction" : "22nd May 2016",
                "style":""
              }
          ]
        }
      });
    }else{
        this.setState({
        StateTemplate : {
        "chatText" : "Request A Ride",
        "ActionType" : [{
            "Field" : "Text",
            "FieldText" : "20th May 2016",
            "FieldAction" : "",
            "style":""
          },{
              "Field" : "Text",
              "FieldText" : "21st May 2016",
              "FieldAction" : "",
              "style":""
            },
            {
                "Field" : "Text",
                "FieldText" : "22nd May 2016",
                "FieldAction" : "",
                "style":""
              }
          ]
        }
      });
    }
    }


    setTimeout(() => {this.appendMessage({text: this.state.StateTemplate["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date()})}, 1000);


    }
},

parse(str) {
  var args = [].slice.call(arguments, 1),
      i = 0;

  return str.replace(/%s/g, function() {
      return args[i++];
  });
},


componentWillMount() {
  this.styles = {
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    listView: {
      flex: 1,
    },
    textInputContainer: {
      height: 44,
      borderTopWidth: 1 / PixelRatio.get(),
      borderColor: '#b2b2b2',
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 10,
    },
    optionsContainer: {
      height: 44,
      borderTopWidth: 1 / PixelRatio.get(),
      borderColor: '#b2b2b2',
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 10,
    },
    ButtonValContainer: {
      height: 190,
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 10,
    },
    textInput: {
      alignSelf: 'center',
      height: 30,
      width: 100,
      backgroundColor: '#FFF',
      flex: 1,
      padding: 0,
      margin: 0,
      fontSize: 15,
    },
    sendButton: {
      marginTop: 11,
      marginLeft: 10,
    },
    date: {
      color: '#aaaaaa',
      fontSize: 12,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 8,
    },
    link: {
      color: '#007aff',
      textDecorationLine: 'underline',
    },
    linkLeft: {
      color: '#000',
    },
    linkRight: {
      color: '#fff',
    },
    loadEarlierMessages: {
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadEarlierMessagesButton: {
      fontSize: 14,
    },
    button: {
    borderWidth:1,
    height:70,
    width:100,
    marginLeft:10,
    borderColor: 'green',
    backgroundColor: '#FFF8F0',
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker:{
    width: 300,
    backgroundColor : 'white',
    marginTop : -40,
  }
  };

  Object.assign(this.styles, this.props.styles);
},
});

module.exports = AddKidChat;
