import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
    },
    map: {
        flex:   1,
        width: '100%',
    },
    botao: {
        backgroundColor: 'orange',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 50,
    },
    textoBotao: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    markerMan: {
        width: 50,
        height: 50,
    }
});
