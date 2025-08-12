import {useState, useEffect, useRef} from 'react';

import {View} from 'react-native';

import { styles } from './styles'; 

import MapView, {Marker} from 'react-native-maps';

import {
    requestForegroundPermissionsAsync,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy,
} from 'expo-location';
// Componente principal do app
export default function TempoReal() {
    //Referencia para armazenar a localização atual
    const [location, setLocation] = useState(null);

    const mapRef = useRef(null);
    // Funcão para solicitar permissões de localização
    async function requestLocationPermissions(){
        const { granted } = await requestForegroundPermissionsAsync(); //Solicita permissão

        if (granted) {
            const currentPosition = await getCurrentPositionAsync(); //Obtém a localização atual
            setLocation(currentPosition); // Atualiza a localização inicial
            console.log('localização atual:', currentPosition); // log para depuração
        }
    }

    // UseEffect que roda uma vez ao iniciar o componente
    useEffect(() => {
        requestLocationPermissions();
    }, []);

    // UseEffect para acompanhar a localização em tempo real
    useEffect(() => {
        const subscribe = async () => {
            await watchPositionAsync(
                {
                    accuracy: LocationAccuracy.Highest, // Precisão mais alta
                    timeInterval: 1000, // Atualiza a cada 5 segundos
                    distanceInterval: 1, // Atualiza a cada 1 metro
                },
                (response) => {
                    console.log('Nova localização:', response);
                    setLocation(response); // Atualiza a localização
                    mapRef.current?.animateCamera(
                        {
                            pitch: 70,
                            center: response.coords,
                        });
                }
            );
        };
        subscribe(); // Inicia a observação da localização
    }, []);

    // Renderiza o componente
    return (
        <View style={styles.container}>
            {location && (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    mapType='standard'
                    showsUserLocation={true}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Você está aqui"
                    />
                </MapView>
            )}
            </View>
    );
}