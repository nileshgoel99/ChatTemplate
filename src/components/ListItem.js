var React = require('react-native');
const styles = require('../styles.js')
const { View, TouchableHighlight, Text } = React;

class ListItem extends React.Component {
  render() {
    return (
      <TouchableHighlight onpress="{this.props.onPress}">
        <View style="{styles.li}">
          <Text style="{styles.liText}">{this.props.item.title}</Text>
        </View>
      </View></TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
  },

});

module.exports = ListItem;
