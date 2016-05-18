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
        var FirstChat = {"chatText" : "Whats your kid name?","ActionType" : [{"Field" : "Text","FieldAction" : "this.addKidProfile.bind(null,'name')","style":""}]}
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
        selectedValue={this.state.language}
        onValueChange={(lang) => this.setState({language: lang})}>
        <Picker.Item label="Test" value="Test" key="Test"/>
        </Picker>
        <Button
        style={this.styles.sendButton}
        styleDisabled={this.styles.sendButtonDisabled}
        onPress={this.addKidProfile}
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

addKidProfile(profileType) {
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

    console.log("This is message", message);
    var rowID = this.appendMessage(message, true);
    console.log("This is profile type", profileType);
    if(profileType == "name"){
      this.setState({
        CurrentState : 2,
        kidName : message["text"],
        StateTemplate : {  "chatText" : "Please upload %s photo","ActionType" : [{"Field" : "Button",  "FieldText" : "Upload","FieldAction" : "wrapthis.getImageUploader.bind(null,wrapthis)","style":""  }]}

      })

      this.state.StateTemplate["chatText"] = this.parse(this.state.StateTemplate["chatText"] , this.state.kidName );
      setTimeout(() => {this.appendMessage({text: this.state.StateTemplate["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date(2015, 10, 16, 19, 0)})}, 500);

    }
    else if(profileType == "number"){
      this.setState({
          CurrentState : 5,
          StateTemplate : {
          "chatText" : "Upload a photo key for %s to validate the driver at pick up",
          "ActionType" : [{"Field" : "Button",  "FieldText" : "Upload","FieldAction" : "wrapthis.getIdentityImage.bind(null,wrapthis)","style":""  }]
          },
      });
      this.state.StateTemplate["chatText"] = this.parse(this.state.StateTemplate["chatText"] , this.state.kidName );
      setTimeout(() => {this.appendMessage({text: this.state.StateTemplate["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date()})}, 1000);

    }
    else if(profileType == "grade"){

      this.setState({
          CurrentState : 7,
          StateTemplate : {
          "chatText" : "Which Elementary School does she go to?",
          "ActionType" : [{
              "Field" : "Button",
              "FieldText" : "Test",
              "FieldAction" : "wrapthis.addKidProfile",
              "style":""
            },{
                "Field" : "Button",
                "FieldText" : "Test2",
                "FieldAction" : "wrapthis.addKidProfile",
                "style":""
              },
              {
                  "Field" : "Button",
                  "FieldText" : "Test3",
                  "FieldAction" : "wrapthis.addKidProfile",
                  "style":""
                }
            ]
          },
      });
      this.state.StateTemplate["chatText"] = this.parse(this.state.StateTemplate["chatText"] , this.state.kidName );
      setTimeout(() => {this.appendMessage({text: this.state.StateTemplate["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date()})}, 1000);

    }
    }
},

parse(str) {
  var args = [].slice.call(arguments, 1),
      i = 0;

  return str.replace(/%s/g, function() {
      return args[i++];
  });
},

kidCellNumber(responseVal){
    if(responseVal == "no"){
      setTimeout(() => {this.appendMessage({text: 'Thanks', name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date()})}, 1000);

    }else{
      this.setState({
          CurrentState : 4,
          StateTemplate : {
          "chatText" : "Please Enter the %s Number",
          "ActionType" : [{"Field" : "Text","FieldAction" : "this.addKidProfile.bind(null,'number')","style":""}]
          },
      });
      this.state.StateTemplate["chatText"] = this.parse(this.state.StateTemplate["chatText"] , this.state.kidName );
      setTimeout(() => {this.appendMessage({text: this.state.StateTemplate["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date()})}, 1000);

    }
},

getIdentityImage(){
  setTimeout(() => {this.appendMessage({text: 'Uploaded', position: 'right', date: new Date()})}, 500);
  this.setState({
        CurrentState : 6,
       StateTemplate : {
       "chatText" : "What grade is %s in?",
       "ActionType" : [{"Field" : "Text","FieldAction" : "this.addKidProfile.bind(null,'grade')","style":""}]
       },
   });



   this.state.StateTemplate["chatText"] = this.parse(this.state.StateTemplate["chatText"] , this.state.kidName );
   setTimeout(() => {this.appendMessage({text: this.state.StateTemplate["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date(2015, 10, 16, 19, 0)})}, 1000);

},

getImageUploader(){

  /*
  var options = {
    title: 'Select Avatar', // specify null or empty string to remove the title
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
    chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
    customButtons: {
      'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
    },
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    videoQuality: 'high', // 'low', 'medium', or 'high'
    durationLimit: 10, // video recording max time in seconds
    maxWidth: 100, // photos only
    maxHeight: 100, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.2, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
      skipBackup: true, // ios only - image will NOT be backed up to icloud
      path: 'images' // ios only - will save image at /Documents/images rather than the root
    }
  };



      ImagePickerManager.showImagePicker(options, (response) => {


        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePickerManager Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
      else {
        // You can display the image using either data:
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // uri (on iOS)
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        setTimeout(() => {this.appendMessage({text: 'Done', position: 'right', date: new Date()})}, 500);
         this.setState({
             StateTemplate : {
             "chatText" : "Does %s have a cell phone",
             "ActionType" : [{
                 "Field" : "Button",
                 "FieldText" : "No",
                 "FieldAction" : "wrapthis.kidCellNumber.bind(null,'no')",
                 "style":""
               },{
                   "Field" : "Button",
                   "FieldText" : "Yes",
                   "FieldAction" : "wrapthis.kidCellNumber.bind(null,'yes')",
                   "style":""
                 }]
             },
         });

         this.state.StateTemplate["chatText"] = this.parse(this.state.StateTemplate["chatText"] , this.state.kidName );
         setTimeout(() => {this.appendMessage({text: this.state.StateTemplate["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date(2015, 10, 16, 19, 0)})}, 1000);

        this.setState({
          avatarSource: source
        });
      }
    }); */

    setTimeout(() => {this.appendMessage({text: 'Done', position: 'right', date: new Date()})}, 500);
    this.setState({
          CurrentState : 3,
         StateTemplate : {
         "chatText" : "Does %s have a cell phone",
         "ActionType" : [{
             "Field" : "Button",
             "FieldText" : "No",
             "FieldAction" : "wrapthis.kidCellNumber.bind(null,'no')",
             "style":""
           },{
               "Field" : "Button",
               "FieldText" : "Yes",
               "FieldAction" : "wrapthis.kidCellNumber.bind(null,'yes')",
               "style":""
             }]
         },
     });



     this.state.StateTemplate["chatText"] = this.parse(this.state.StateTemplate["chatText"] , this.state.kidName );
     setTimeout(() => {this.appendMessage({text: this.state.StateTemplate["chatText"], name: 'Ujama', image: {uri: 'https://bytebucket.org/ujama/ujama-reactnative-objectivec-app/raw/8bbf632a468cc0303c5df4e3507f24a422a22223/docs/Ujama-linkedin-logo.png?token=f585d46f345d7ba07ebb4be0ef7af3822ec18bf9'}, position: 'left', date: new Date(2015, 10, 16, 19, 0)})}, 1000);

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
    height:100,
    width:150,
    borderColor: 'green',
    backgroundColor: '#FFF8F0',
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker:{
    backgroundColor : 'red',
    marginTop : -100,
  }
  };

  Object.assign(this.styles, this.props.styles);
},
});

module.exports = AddKidChat;
