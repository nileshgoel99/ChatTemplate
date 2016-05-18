const React = require('react-native')
const {StyleSheet} = React
const constants = {
  actionColor: '#24CE84'
};

var styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listView: {
    flex: 1,
  },
  textInputContainer: {
    height: 44,
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
  }

});
