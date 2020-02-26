import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  FlatList,
  Button,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import SearchInput from './SearchInput';
import Modal from "react-native-modal";
import CameraRoll from "@react-native-community/cameraroll";
import RNFetchBlob from 'react-native-fetch-blob'

export default function App() {
  const [allGifResults, setAllGifResults] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [imgUri, setImgUri] = useState('');

  useEffect(() => {
    fetch(
        'http://api.giphy.com/v1/gifs/trending?api_key=MKSpDwx7kTCbRp23VtVsP4d0EvfwIgSg&limit=50',
    )
        .then(response => response.json())
        .then(responseJson => {
          for (let item of responseJson.data) {
            allGifResultsHandler(item.images.fixed_height.url);
            // console.log(item.images.fixed_height.url);
          }
        })
        .catch(error => {
          console.error(error);
        });
  },[]);

  function showModal(uri) {
    setImgUri(uri);
    setModalVisible(true);
  }

  function toggleModal() {
    setModalVisible(isModalVisible => !isModalVisible);
  }

  async function downloadImage() {
    if (Platform.OS === 'android') {
      RNFetchBlob
          .config({
            fileCache : true,
            appendExt : 'jpg'
          })
          .fetch('GET', imgUri)
          .then((res) => {
            CameraRoll.saveToCameraRoll(res.path())
                .then(Alert.alert('Success', 'Photo added to camera roll!'))
                .catch(err => console.log('err:', err))
          })
    } else {
      CameraRoll.saveToCameraRoll(imgUri)
          .then(Alert.alert('Success', 'Photo added to camera roll!'))
    }
    toggleModal();
  }

  function addSearchResultsHandler(searchTerm) {
    console.log(searchTerm);
    setAllGifResults([]);
    fetchResults(searchTerm);
  }

  function allGifResultsHandler(url) {
    setAllGifResults(currentGifs => [...currentGifs, {id: url, value: url}]);
  }

  function fetchResults(searchTerm) {
    fetch(
      'http://api.giphy.com/v1/gifs/search?q=' +
        searchTerm +
        '&api_key=MKSpDwx7kTCbRp23VtVsP4d0EvfwIgSg&limit=50',
    )
      .then(response => response.json())
      .then(responseJson => {
        for (let item of responseJson.data) {
          allGifResultsHandler(item.images.fixed_height.url);
          console.log(item.images.fixed_height.url);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <SearchInput onSearchButtonPressed={addSearchResultsHandler} />
      </View>

      <FlatList
        keyExtractor={(item, index) => item.id}
        data={allGifResults}
        numColumns={2}
        renderItem={itemData => (
          <TouchableOpacity onPress={showModal.bind(this, itemData.item.value)}>
            <Image
              source={itemData.item.value ? {uri: itemData.item.value} : null}
              style={styles.images}
            />
          </TouchableOpacity>
        )}
      />
      <Modal isVisible={isModalVisible}>
        <View style={modalStyles.content}>
          <Text style={modalStyles.contentTitle}>Are you going to save this gif to camera!</Text>
          <View style={{display:'flex', flexDirection: 'row'}}>
            <View style={{marginRight:10}}>
              <Button onPress={downloadImage} title="Yes"/>
            </View>
            <Button onPress={toggleModal} title="No" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  screen: {
    margin: 10,
  },
  images: {
    width: Dimensions.get('window').width / 2 - 20,
    height: Dimensions.get('window').width / 2 - 20,
    margin: 10,
  },
});

const modalStyles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});
