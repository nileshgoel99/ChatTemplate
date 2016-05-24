var React = require('react-native')
var{
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Image,

} = React;

const Firebase = require('firebase');
const StatusBar = require('./statusBar');
const FirebaseUrl = 'https://ujama.firebaseio.com';
var nativeModules = require('react-native').NativeModules;
var ImagePickerManager = nativeModules.ImagePickerManager;

module.exports = React.createClass({



    getWeb(item){

    },
    componentDidMount() {
       this.setState({
         //dataSource: this.state.dataSource.cloneWithRows(this.state.NotificationItems)
         //dataSource: this.state.dataSource.cloneWithRows([{ id:'1',type:'video',title: 'Account Opening Tutorial', description:'Video for account opening Tutorial', url:'https://www.youtube.com/watch?v=mU4VCNrSxwA',read:'no',viewedTime:'',location:'',clickedView:''},{ id:'2',type:'video',title: 'Get started with Investor Notebook', description:'Fidelity has recently launched new feature Notebook', url:'https://dpcsqa1.fmr.com/ftgw/dpcs/notebook/#?option=AllNotes',read:'no',viewedTime:'',location:'',clickedView:''}, { id:'3',type:'video',title: 'Mutual Fund Infographics', description:'Inside the Mind of Investors', url:'https://s-media-cache-ak0.pinimg.com/236x/94/cc/90/94cc900987fc8fc73d2b5c84a3ac3e1a.jpg',read:'no',viewedTime:'',location:'',clickedView:''}])
       })
     },

    render : function(){
      console.log("This is render Function Image ref", this.state.avatarSource)
      return(
        <View>
        <View style={styles.addressBarRow}>
          <TouchableOpacity
              onPress={this.saveData}
              style={styles.navButtonRight}>
              <Text>
                 Save
              </Text>
            </TouchableOpacity>
          </View>
          <StatusBar title="Your Profile" onPress={this.saveData} />

       <Image source={this.state.avatarSource} style={{width: 100, height: 100, alignSelf: 'center', marginTop:10}} />

          <TouchableHighlight onPress={this.getImage}>
            <Text style={styles.updatePhotoMain}> Update photo </Text>
          </TouchableHighlight>

          <View style={{ marginLeft:15, borderBottomColor: '#000000', borderBottomWidth: 1, width:300, marginTop:10 }}>
          <TextInput placeholder="First Name" style = {styles.input}  onChangeText={(firstName) => this.setState({firstName})} value={this.state.firstName}/>
          </View>
          <View style={{  marginLeft:15, borderBottomColor: '#000000', borderBottomWidth: 1, width:300 }}>
          <TextInput placeholder="Last Name" style = {styles.input}  onChangeText={(lastName) => this.setState({lastName})} value={this.state.lastName}/>
          </View>
          <View style={{  marginLeft:15, borderBottomColor: '#000000', borderBottomWidth: 1, width:300 }}>
          <TextInput placeholder="Phone Number" style = {styles.input}  onChangeText={(phone) => this.setState({phone})} value={this.state.phone}/>
          </View>
          <View style={{  marginLeft:15, borderBottomColor: '#000000', borderBottomWidth: 1, width:300 }}>
          <TextInput placeholder="Home Address" style = {styles.input}  onChangeText={(home) => this.setState({home})} value={this.state.home}/>
          </View>
          <View style={{  marginLeft:15, borderBottomColor: '#000000', borderBottomWidth: 1, width:300 }}>
          <TextInput placeholder="Work Address (optional)" style = {styles.input}  onChangeText={(work) => this.setState({work})} value={this.state.work}/>
          </View>

          <Image source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} onPress={this.kidListNav}
       style={{width: 100, height: 100, alignSelf: 'flex-start', marginTop:60, marginLeft:40}} />

       <Image source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
    style={{width: 100, height: 100, alignSelf: 'flex-end', marginTop:-100, marginRight:40}} />

    <TouchableHighlight onPress={this.kidListNav}>
      <Text style={styles.labelTag}> Your Kids(2) </Text>
    </TouchableHighlight>
        </View>



      );
    },

    kidListNav: function(){
        this.props.navigator.push({name:'kidList'})
    },

    getImage: function(){
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

            /**
            * The first arg will be the options object for customization, the second is
            * your callback which sends object: response.
            *
            * See the README for info about the response
            */

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
            // uri (on android)
          //  const source = {uri: response.uri, isStatic: true};

            this.setState({
              avatarSource: source
            });
            }
            });
    },

    saveData:function(){

      var name = this.state.firstName + this.state.lastName
      //this.userProfileRef.push({{name}:{phone:this.state.phone,homeAddress:this.state.home,workAddress:this.state.work}});

      this.userProfileRef.child(name).set({phone:this.state.phone,homeAddress:this.state.home,workAddress:this.state.work});
    },

    goBack: function() {
       this.props.navigator.pop();
     },

    getInitialState(props) {

      this.userProfileRef = new Firebase(FirebaseUrl).child('profile');
      const Imagesource = {uri: 'http://thesocialmediamonthly.com/wp-content/uploads/2015/08/photo.png', isStatic: true};
      return{
        test:"test",
        avatarSource: Imagesource
      }
    },

});

var styles = {
  navButton: {
      width: 20,
      padding: 3,
      marginRight: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderColor: 'transparent',
      borderRadius: 3,
    },
    navButtonRight: {

        padding: 3,
        marginRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderColor: 'transparent',
        alignSelf:'flex-end',
        borderRadius: 3,
      },
    addressBarRow: {
      flexDirection: 'row',
      padding: 15,
    },
    input : {
      padding: 4,
      height: 40,
      width: 200,
      alignSelf: 'center'
    },
    updatePhotoMain: {
      fontSize: 16,
      fontWeight: "500",
      alignSelf: 'center'

    },
    labelTag: {
      fontSize: 14,
      fontWeight: "500",
      alignSelf: 'flex-start',
      marginLeft : 40,

    }
}
