import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { Gyroscope } from 'expo-sensors';
import palavras from './palavras.json';

//Função para obter uma cor aleatória diferente da atual
const obterCorAleatoria = (corAtual) => {
  const cores =['#c00f0fff','#07a10fff', '#086dcbff', '#ec770aff', '#e50a82ff', '#0d6829ff', '#0dbad8ff', '#050965ff',
    '#b500f2ff'];
  const outrasCores = cores.filter(cor => cor !== corAtual);
  return outrasCores[Math.floor(Math.random() * outrasCores.length)];
};

export default function App () {
  const [palavra, definirPalavra] = useState('');
  const [corFundo, definirCorFundo] = useState('#FFFF');
  const [corTexto, definirCorTexto] = useState('#0000');
  const [inscricao, definirInscricao] = useState(null);
  const [telaInicial, definirTelaInicial] = useState(true);
  const [permiteSensor, definirPermiteSensor] = useState(false);

  //Variável para controlar o tempo mínimo entre trocas
  let ultimaTroca = Date.now();

  useEffect(() => {
    if (permiteSensor) {
      sortearPalavra(); //Sorteia a primeira palavra automaticamente
      iniciarSensor(); //Inicia o sensor
      return() => pararSensor(); // Limpa o sensor ao desmontar
    }
  }, [permiteSensor]);

  const iniciarSensor = () => {
    Gyroscope.setUpdateInterval(500); //Define intervalo de leitura do giroscópio

    definirInscricao(
      Gyroscope.addListener(({x, y, z}) => {
        const agora = Date.now();

        //Exibe os valores do giroscópio no console
        console.log(`Movimento detectado -x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${z.toFixed(2)}`);

        // Detecta inclinação para frente (abaixar a tela)
        if (z < -2 && agora - ultimaTroca > 1000) {
          ultimaTroca = agora;

          //Sorteia nova palavra e cores
          const novaPalavra = palavras[Math.floor(Math.random() * palavras.length)];
          const novaCorTexto = corTexto === '#000000' ? '#FFFFFF' : '#000000'
          const novaCorFundo = obterCorAleatoria(corFundo);

          //Exibe no console a palabra e cor sorteadas
          console.log(`Palavra troca: ${novaPalavra}, Cor de fundo: ${novaCorFundo}`);

          //Atualiza os estados
          definirPalavra(novaPalavra);
          definirCorTexto(novaCorTexto);
          definirCorFundo(novaCorFundo);
        }
      })
    );
  };

  const pararSensor = () => {
    //Remove o listerner do giroscópio
    inscricao && inscricao.remove();
    definirInscricao(null);
  };

  const sortearPalavra = () => {
    const novaPalavra = palavras[Math.floor(Math.random()* palavras.length)];
    const novaCorTexto = corTexto === '#000000' ? '#FFFFFF' : '#000000';
    const novaCorFundo = obterCorAleatoria(corFundo);
    definirPalavra(novaPalavra);
    definirCorTexto(novaCorTexto);
    definirCorFundo(novaCorFundo);
  };

  const renderTelaInicial = () => (
    <View style={[estilos.tela, {backgroundColor: '#FFFFFF'}]}>
      <Text style={estilos.titulo}>Adivinha quem sou?</Text>
      <Text style={estilos.instrucao}>Agite levemente o celular para frente para trocar de palavras</Text>
      <TouchableOpacity style={estilos.botao} onPress={() => definirTelaInicial(false)}></TouchableOpacity>
    </View>
  );

  const renderPermissao = () => (
       <View style={[estilos.tela, {backgroundColor: '#FFFFFF'}]}>
        <Text style={estilos.titulo}>Permitir uso do giroscópio</Text>
        <TouchableOpacity style={estilos.botao} onPress={() => definirPermiteSensor(true)}>
          <Text style={estilos.textoBotao}>Permitir
          </Text>
        </TouchableOpacity>
       </View>   
  );

  const renderPalavra = () => (
    <View style={[estilos.tela, {backgroundColor: corFundo}]}>
      <Text style={[estilos.palavra, {color: corTexto}]}>{palavra}</Text>
    </View>
  );
  if (telaInicial) return renderTelaInicial();
  if (!permiteSensor) return renderPermissao();
    return renderPalavra();
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  palavra: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instrucao: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  botao: {
    backgroundColor: '#007AFF',
    paddingVertical:12,
    paddingHorizontal:24,
    borderRadius: 8,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});