import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

export default function SearchInput(props) {
  const [searchTerm, setSearchTerm] = useState('');

  function inputHandler(enteredText) {
    setSearchTerm(enteredText);
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Search Term"
        style={styles.input}
        onChangeText={inputHandler}
        value={searchTerm}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={props.onSearchButtonPressed.bind(this, searchTerm)}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  input: {
    width: '70%',
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 16,
  },
  searchButton: {
    height: 50,
    width: 100,
    backgroundColor: 'lightblue',
    marginLeft: 10,
  },
  searchButtonText: {
    height: 50,
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
