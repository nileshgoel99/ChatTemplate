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
const StatusBar = require('./statusBar')
const FirebaseUrl = 'https://ujama.firebaseio.com';


module.exports = React.createClass({



    getChat(){
        this.props.navigator.push({name:'chat'})
    },
    componentDidMount() {
       this.setState({
         //dataSource: this.state.dataSource.cloneWithRows(this.state.NotificationItems)
         //dataSource: this.state.dataSource.cloneWithRows([{ id:'1',type:'video',title: 'Account Opening Tutorial', description:'Video for account opening Tutorial', url:'https://www.youtube.com/watch?v=mU4VCNrSxwA',read:'no',viewedTime:'',location:'',clickedView:''},{ id:'2',type:'video',title: 'Get started with Investor Notebook', description:'Fidelity has recently launched new feature Notebook', url:'https://dpcsqa1.fmr.com/ftgw/dpcs/notebook/#?option=AllNotes',read:'no',viewedTime:'',location:'',clickedView:''}, { id:'3',type:'video',title: 'Mutual Fund Infographics', description:'Inside the Mind of Investors', url:'https://s-media-cache-ak0.pinimg.com/236x/94/cc/90/94cc900987fc8fc73d2b5c84a3ac3e1a.jpg',read:'no',viewedTime:'',location:'',clickedView:''}])
       })
     },

    render : function(){
      return(
        <View style="{styles.container}">
        <View style={styles.addressBarRow}>
        <TouchableOpacity
            onPress={this.getChat}
            style={styles.navButton}>
            <Text style={styles.mark}>
               {'+'}
            </Text>
          </TouchableOpacity>
          </View>
              <StatusBar title="Your Kids" />

              <ListView
                dataSource={this.state.dataSource}
                style="{styles.listview}"
                renderRow={(rowData) => <Text>{rowData}</Text>}
              />
        </View>



      );
    },

    getInitialState(props) {

      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.userProfileRef = new Firebase(FirebaseUrl).child('profile');

      return{
        test:"test",
        dataSource: ds.cloneWithRows(['Danielle', 'Dineo']),
      }
    },

});

var styles = {
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  listview: {
   flex: 1,
 },
 addressBarRow: {
   flexDirection: 'row',
   padding: 15,
 },
 mark: {
   fontSize:16,
   fontweight:500,
 },
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
}
