var React = require('react-native');
var {
  View,
  Text,
  Button,
  StyleSheet,
  Navigator

} = React;

const addKid = require('./components/addKid');
const styles = require('./components/styles');

var ROUTES  =   {
  addKid: addKid
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
          initialRoute = {{name: 'addKid'}}
          renderScene={this.renderScene}
          configureScene={() => {return Navigator.SceneConfigs.FloatFromRight; }}
        />
    )
  }

});
