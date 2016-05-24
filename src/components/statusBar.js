'use strict';
const React = require('react-native');

const { StyleSheet, Text, View, TouchableOpacity } = React;

//const styles = require('./styles');

class StatusBar extends React.Component {
  render() {
    return (
      <View>
        <View style={styles.statusbar}/>
        <View style={styles.navbar}>
          <Text style={styles.navbarTitle}>{this.props.title}</Text>
          
        </View>
      </View>
    );
  }
};


var styles = {
  navbar: {
  alignItems: 'center',
  backgroundColor: '#fff',
  borderBottomColor: '#eee',
  borderColor: 'transparent',
  borderWidth: 1,
  justifyContent: 'center',
  height: 44,
  flexDirection: 'row'
},
navbarTitle: {
  color: '#444',
  fontSize: 16,
  fontWeight: "500"
},
}

module.exports = StatusBar;
