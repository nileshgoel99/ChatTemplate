var React = require('react-native');
var {
  View,
  Text,
  Button,
  StyleSheet,
  Navigator

} = React;

const chat = require('./components/chat');
const updateProfile = require('./components/updateProfile');
const kidList = require('./components/kidsList');
const styles = require('./components/styles');

var ROUTES  =   {
  chat: chat  ,
  updateProfile : updateProfile,
  kidList : kidList
}
module.exports = React.createClass({

  renderScene : function(route, navigator) {
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  },
  render : function(){
    return(
        <Navigator
          style = {styles.container}
          initialRoute = {{name: 'updateProfile'}}
          renderScene={this.renderScene}
          configureScene={() => {return Navigator.SceneConfigs.FloatFromRight; }}
        />
    )
  }

});
