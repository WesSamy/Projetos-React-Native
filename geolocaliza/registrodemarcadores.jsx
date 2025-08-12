//importa os hooks e componentes necessários do React e React Native
import React, {useState, useEffect, useRef} from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';

//importa os componentes de mapa e marcador do react-native-maps
import MapView, {Marker} from 'react-native-maps';

//importa funções de localização do Expo Location
import {
requestForegroundPermissionsAsync,
getCurrentPositionAsync,
watchPositionAsync,
LocationAccuracy,
reverseGeocodeAsync,
} from 'expo-location';

// importa os estilos personalizados definidos externamente
import { styles } from './styles';

// Lista de cores para os marcadores adicionados
const coresMarcadores = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'pink', 'brown'];

// Componente principal
export default function RegistroDeMarcadores() {
    const [localizacaoAtual, setLocalizacaoAtual] = useState(null); //Estado da localização atual
    const [marcadores, setMarcadores] = useState([]); //Estado dos marcadores
    const referenciaMapa = useRef(null); // Referência para controlar a câmera do mapa

    //Solicita permissão de localizalção e obtém a posição inicial
    async function solicitarPermissaoLocalizacao() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
        const posicao = await getCurrentPositionAsync();
        setLocalizacaoAtual(posicao);
        console.log(' Localização atual: ', posicao);
        }
    }

    // Executa ao montar o componente
    useEffect(() => {
    solicitarPermissaoLocalizacao();
    }, []);

    //Observa a localização em tempo real
    useEffect(() => {
    const iniciarObservacao = async () => {
        await watchPositionAsync(
            {
                accuracy: LocationAccuracy.Highest,
                timeInterval: 1000,
                distanceInterval: 1, 
            },
            (resposta) => {
                setLocalizacaoAtual(resposta);
                referenciaMapa.current?.animateCamera({
                    pitch: 70,
                    center: resposta.coords,
                });
            }
        );
    };
    iniciarObservacao();
    }, []);

    //Adiciona um novo marcador com endereço e cor
    const adicionarMarcador = async () => {
    if(localizacaoAtual) {
        const {latitude, longitude} = localizacaoAtual.coords;
        const endereco = await reverseGeocodeAsync ({latitude, longitude});

        const textoEndereco = endereco[0]
        ? `${endereco[0].street}, ${endereco[0].city}`
        : 'Endereço não encontrado';

        const novoMarcador = {
            id: marcadores.length + 1,
            latitude,
            longitude,
            endereco: textoEndereco,
            cor: coresMarcadores [marcadores.length % coresMarcadores.length],       
        };

        setMarcadores([...marcadores, novoMarcador]);
        console.log(` Posição ${novoMarcador.id}: ${latitude}, ${longitude} - ${textoEndereco}`);
    }
    };

// Renderização do componente
return (
    <View style={styles.container}>
        {/* Rendeiza o mapa e o botão apenas se a localização estiver disponível */}
        {localizacaoAtual && (
            <>
                {/*Mapa com marcador da posição atual e marcadores adicionados*/}
            <MapView 
                ref={referenciaMapa}
                style={styles.map}
                mapType="standard"
                showsBuildings={true}
                initialRegion={{
                    latitude: localizacaoAtual.coords.latitude,
                    longitude: localizacaoAtual.coords.longitude,
                    latitudeDelta: 0.0025,
                    longitudeDelta: 0.0025,
                }}
                camera={{
                    center: {
                        latitude: localizacaoAtual.coords.latitude,
                        longitude: localizacaoAtual.coords.longitude,
                    },
                    pitch: 70,
                    heading: 0,
                    altitude: 1000,
                    zoom: 19,
                }}
            >
                {/* Marcador da posição atual com ícone personalizado */}
                <Marker
                    coordinate={{
                        latitude: localizacaoAtual.coords.latitude,
                        longitude: localizacaoAtual.coords.longitude,
                    }}
                    >
                        <Image 
                        source={require('./assets/pin-homer.png')}
                        style={styles.markerMan}
                        resizeMode="contain"
                        />
                    </Marker>

                    {/* Marcadores adicionados manualmente */}
                    {marcadores.map((marcador) => (
                        <Marker
                        key={marcador.id}
                        coordinate={{
                            latitude: marcador.latitude,
                            longitude: marcador.longitude,
                        }}
                        title={`Posição ${marcador.id}`}
                        description={marcador.endereco}
                        pinColor={marcador.cor}
                        />
                    ))}
                    </MapView>

                    {/* Botão para adicionar marcador */}
                    <TouchableOpacity style={styles.botao} onPress={adicionarMarcador}>
                        <Text style={styles.textoBotao}> Adicionar marcador</Text>
                    </TouchableOpacity>
                    </>
                )}
            </View>
        );
    }