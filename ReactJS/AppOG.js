import React, { useState, useEffect } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View, Text, Button, Image, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ImageCropper from "./ImageCropper.js";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import axios from 'axios';
import { useFonts } from 'expo-font';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
//Need to use this to store theme data so users don't have to change it everytime 
    //import AsyncStorage from '@react-native-async-storage/async-storage';

// all of the assets that store the images for the starters
const charizardBackground = require('./assets/charizardBackground.png');
const ivysaurBackground = require('./assets/ivysaurBack.png');
const squirtleBackground = require('./assets/squirtleBack.png');
const pikachuBackground = require('./assets/pikachuBack.png');
const backgroundImg =require('./assets/background.png');
const APIUrl = "127.0.0.1"

const createFormData = (img) => {
  const formData = new FormData();
  const file = new File([img], "filename.png");
  formData.append('image', file);
  return formData;
};
const fetchImageFromUri = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

// The homepage for everything
const HomePage = ({ Toolbar, colorScheme, headerScheme, handleBackButton, pickImageAsync, pokemonList, renderPokemon, handleMainButton, handleInfoButton }) => {
  const [searchText, setSearchText] = useState('');

  const filteredPokemonList = pokemonList.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <ImageBackground source={colorScheme} style={styles.backImageHome}>
      <Toolbar />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View style={styles.container}>
          <Button style={styles.photoButton} title="Choose a photo" onPress={pickImageAsync}></Button>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Pokemon"
              placeholderTextColor={"grey"}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <View>
            <FlatList
              data={filteredPokemonList}
              renderItem={renderPokemon}
              keyExtractor={(item) => item.name}
              numColumns={3}
              contentContainerStyle={styles.pokemonList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </ImageBackground>

  );
};

const InfoPage = ({ Toolbar, colorScheme, headerScheme, handleBackButton, handleMainButton, handleInfoButton}) => {
  return (
    <ImageBackground source={colorScheme} style={styles.backImageHome}>
    <Toolbar/>
        <View style={ styles.infoPage }>
          <Text style={styles.text}>
            This app is a simple tool to help you identify the Pokémon in your photos.
            Simply take a photo of a Pokémon and the app will identify it for you.
          </Text>
          <Text style={styles.text}>
            This app was created by a group of students at the Illinois Institute of Technology.
          </Text>
          <Text style={styles.text}>
          We are using a Convolutional Neural Network trained using TensorFlow. Overall, this model consists of two convolutional layers with max pooling, followed by a fully connected layer. The input layer takes 256&#xd7;256 image data. The max pooling layers helps reduce the feature space from the convolutional layers. Finally, the fully connected layer returns 151 output units &#x2013; each corresponding to a probability for a Pokémon class. 
          The model was trained on a dataset of almost 11,000 images sourced from <a href="https://www.kaggle.com/datasets/unexpectedscepticism/11945-pokemon-from-first-gen?select=PokemonData">kaggle</a>. About 20% of the dataset was used for validation. The accuracy on the validation set came out to be 98%. However, this accuracy is only reflective of the dataset that was used. Our model works best on square images with the subject inscribed its boundaries.
          </Text>
          </View>
      </ImageBackground>
  );
};

// The image cropping view
const ImageCroppingPage = ({ Toolbar, colorScheme, headerScheme, src, handleCroppedImage, handleBackButton, handleMainButton, handleInfoButton}) => {
  return (
    <ImageBackground source={colorScheme} style={styles.backImageHome}>
    <Toolbar/>
    <ScrollView>
      <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.8)', width: '60%', alignContent:'center', textAlign:'center', alignItems:'center', alignSelf:'center', top: 10}} >
        <Text style={styles.title}>Crop your Image</Text>
        <ImageCropper src={src} handleCroppedImage={handleCroppedImage}/>
        <StatusBar style="auto" />
      </View>
    </ScrollView>

    </ImageBackground>
  );
};

const PokedexEntry = ({Toolbar, pokemonId, headerScheme, colorScheme, handleBackButton, handleMainButton, handleInfoButton}) => {
  const [size, setSize] = useState({});
  Image.getSize(pokemonId.meta.img, (width, height) => {setSize({width, height})});
  return ( 
    <ImageBackground source={colorScheme} style={[styles.backImageHome, { backgroundColor: headerScheme }]}>
        <Toolbar/>
        <View style={[styles.container, { backgroundColor: colorScheme }]}>
          <View style={{ padding: 10, backgroundColor: 'rgba(52, 52, 52, 0.8)', alignItems: 'center', alignContent: 'center'}}>
            <Image style={{height: size.height, width: size.width}} source={{ uri: pokemonId.meta.img }} />
            <Text style={styles.pokemonDesc}>{pokemonId.name}</Text>
            <Text style={styles.pokemonDesc}>Pokedex Number: {pokemonId.id}</Text>
            <Text style={styles.pokemonDesc}>Type: {pokemonId.meta.types.toString()}</Text>
            <Text style={styles.pokemonDesc}>Description: {pokemonId.meta.description}</Text>
            <Text style={styles.pokemonDesc}>Strengths: {pokemonId.meta.strength.toString()}</Text>
            <Text style={styles.pokemonDesc}>Weaknesses: {pokemonId.meta.weakness.toString()}</Text>
            <Text style={styles.pokemonDesc}>Abilities: {pokemonId.meta.abilities.toString()}</Text>
            <Text style={styles.pokemonDesc}>Evolutions: {pokemonId.meta.evolutions.toString()}</Text>
            <StatusBar style="auto" />
          </View>
        </View>

    </ImageBackground>
    );
};

// Page for choosing your stater Pokemon
const ChoosePokemon = ({handleButtonClick}) => {
  return (
    <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Choose your starter Pokemon for a theme color:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.welcomeButton,{backgroundColor:'#78C850'}]} onPress={() => handleButtonClick(ivysaurBackground, '#1e5d04', 'Bulbasaur')}>
            <Text style={styles.welcomeText}>Bulbasaur</Text>
            <Image source={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.welcomeButton,{backgroundColor:'#F08030'}]} onPress={() => handleButtonClick(charizardBackground, '#a24c00', 'Charmander')}>
            <Text style={styles.welcomeText}>Charmander</Text>  
            <Image source={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.welcomeButton,{backgroundColor:'#6890F0'}]} onPress={() => handleButtonClick(squirtleBackground, '#00397b', 'Squirtle')}>
            <Text style={styles.welcomeText}>Squirtle</Text>
            <Image source={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.welcomeButton,{backgroundColor:'#F8D030'}]} onPress={() => handleButtonClick(pikachuBackground, '#7f5c0a', 'Pikachu')}>
            <Text style={styles.welcomeText}>Pikachu</Text>  
            <Image source={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"} style={styles.image} />
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
};

// Main function that runs the website, handles all buttons, also handles if selected pokemon selected or not
export default function App() {
  const [colorScheme, setColorScheme] = useState('#FFCB05'); // default color scheme
  const [headerScheme, setHeaderScheme] = useState('#FFCB05'); // default header color scheme
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [pokedexPokemonId, setPokedexPokemonId] = useState({});
  const [pokemonList, setPokemonList] = useState([]);
  const [dragDropFile, setDragDropFile] = useState(null);

  const [fontsLoaded] = useFonts({
    'PokeFont': require('./assets/fonts/PocketMonk-15ze.ttf'),
    'PokeG': require('./assets/fonts/PokeGBA.ttf'),
  });

  const Toolbar = () => {
    return (
      <View style={{ backgroundColor: headerScheme, height: 182, alignItems: 'center', textAlign: 'center', }}>
      <Text style={styles.title}>PokéScanner</Text>
        <View style={ styles.tabContainer }>
          <TouchableOpacity style={styles.tabButton} onPress={handleMain}>
            <Text style={styles.backButtonText}>Home</Text> 
            <Entypo name="home" size={24} color="white" />
            <Text style={styles.backButtonText}>Page</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={handleInfo}>
            <Text style={styles.backButtonText}>Team</Text> 
            <FontAwesome5 name="info-circle" size={24} color="white"/>
            <Text style={styles.backButtonText}>Info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={() => handleTheme('#FFCB05','#FFCB05',null)}>
            <Text style={styles.backButtonText}>Change</Text> 
            <MaterialCommunityIcons name="pokeball" size={24} color="white" />
            <Text style={styles.backButtonText}>Theme</Text>
          </TouchableOpacity>
        </View>
    </View>
    )
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      quality: 1,
    });
    if (!result.canceled) {
      const img = await fetchImageFromUri(result.assets[0].uri);
      setDragDropFile(img);
      setCurrentPage("dragdrop");
    } else {
      alert('You did not select any image.');
    }
  };

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => response.json())
      .then(data => setPokemonList(data.results))
      .catch(error => console.error(error));
  }, []);

  const renderPokemon = ({ item }) => {
    const pokemonId = item.url.split('/')[6];
    const pokemonImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    return (
      <View style={styles.pokemon}>
       <TouchableOpacity onPress={() => handlePokemonButton(pokemonId)}>
          <Image style={styles.pokemonImage} source={{ uri: pokemonImageUrl }} />
          <Text style={styles.pokemonName}>{item.name} </Text>
        </TouchableOpacity>
      </View>
    );
  };


  const handleTheme = (color, color2, pokemon) => {
    setColorScheme(color);
    setHeaderScheme(color2);
    setSelectedTheme(pokemon);
    setPokedexPokemonId({});
  };

  const handleSelect = (pokemonId) => {
    setPokedexPokemonId(pokemonId);
  };

  const handleInfo = () => {
    setCurrentPage("info");
    setPokedexPokemonId({});
  };

  const handleMain = () => {
    setCurrentPage("main");
    setPokedexPokemonId({});
  };

  const handleCroppedImage = async (uri) => {
    const formData = createFormData(await fetchImageFromUri(uri));
    setTimeout(
      function() {
        axios({
          method: 'post',
          url: 'http://' + APIUrl + ':8000/classify_image',
          data: formData,
          transformRequest: formData => formData
        })
        .then(function (response){
          handleSelect(response.data)
          setDragDropFile(null);
          setCurrentPage("home");
        })
        .catch(error => {
          // Handle any errors here
          console.error(error);
        });
      }
      .bind(this),
      1000
  );
  };

  const handlePokemonButton = (pokemonId) => {
    fetch('http://' + APIUrl + `:8000/get_pokemon_meta?pokemonId=${pokemonId}`, {
            method: 'GET',
          })
          .then(response => response.json())
          .then(data => {
            // Handle the API response here
            handleSelect(data)
          })
          .catch(error => {
            // Handle any errors here
            console.error(error);
          });
  };



  if (selectedTheme) {
    if (Object.keys(pokedexPokemonId).length > 1) { 
      return (<PokedexEntry Toolbar={Toolbar} colorScheme={colorScheme} headerScheme={headerScheme} pokemonId={pokedexPokemonId} handleBackButton={handleTheme} handleMainButton={handleMain} handleInfoButton={handleInfo} />);
    }
    else if (currentPage == "dragdrop") {
      let src = URL.createObjectURL(dragDropFile);
      return (<ImageCroppingPage Toolbar={Toolbar} colorScheme={colorScheme} headerScheme={headerScheme} src={src} handleCroppedImage={handleCroppedImage} handleBackButton={handleTheme} handleMainButton={handleMain} handleInfoButton={handleInfo}/>)
    }
    else if (currentPage == "info") { 
      return (<InfoPage Toolbar={Toolbar} colorScheme={colorScheme} headerScheme={headerScheme} handleBackButton={handleTheme} handleMainButton={handleMain} handleInfoButton={handleInfo} />);
    }
    else {
      return (<HomePage Toolbar={Toolbar} colorScheme={colorScheme} headerScheme={headerScheme} handleBackButton={handleTheme}
                                                  pickImageAsync={pickImageAsync}
                                                  pokemonList={pokemonList}
                                                  renderPokemon={renderPokemon}
                                                  handleSelectButton={handleSelect}
                                                  handleNameClick={handlePokemonButton}
                                                  handleMainButton={handleMain} 
                                                  handleInfoButton={handleInfo}
                                                  />);
    }
  }
  else{
    return (<ChoosePokemon colorScheme={colorScheme} handleButtonClick={handleTheme} />);
  }
}

const styles = StyleSheet.create({
  infoPage: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 100,
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: 'left',
    alignItems: 'left',
    margin: '20%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  searchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  title: {
    fontFamily: 'PokeFont',
    fontSize: 50,
    fontWeight: 'normal',
    marginBottom: 16,
    marginTop: 25,
    color: '#FFCB05',
    paddingLeft:30,
    paddingRight:30,
    textShadowColor:'black',
    textShadowOffset:{width: 7, height: 7},
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 100,
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  welcomeButton: {
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '120%',
  },
  welcomeText:{
    color:'white',
    paddingBottom: 5,
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    color: 'white',
  },
  buttonContainer: {
    marginTop: 32,
  },
  button: {
    marginBottom: 16,
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  selectButton: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  selectButtonText: {
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButtonText: {
    fontFamily: 'PokeG',
    textAlign: 'center',
    alignContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  searchInput: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    color: 'white',
    padding: 10
  },
  pokemonList: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    marginTop: 20,
  },
  pokemon: {
    margin: 5,
    alignItems: 'center',
  },
  pokemonImage: {
    width: 100,
    height: 100,
  },
  pokemonName: {
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: 'white',
  },
  pokemonDesc: {
    textAlign: 'left',
    color: 'white',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    paddingTop: 10,
    fontSize: 20,
  },
  photoButton: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    top: 20,
  },
  backImageHome: {
    height: Dimensions.get('window').height,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  tabButton: {
    bottom: 0,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
    width: '100%',
    height: '100%',
    flex : 1,
  },
  /*
  tabHomeButton: {
    //width: Dimensions.get('window').width /2, 
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
  },*/

  tabImage: {
    width: 25,
    height: 25,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    bottom: 0,
  },
});