import { Button, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { useNavigation,StackActions  } from '@react-navigation/native';
import { red300, red50, redA100, white } from 'react-native-paper/lib/commonjs/styles/themes/v2/colors';
import NetInfo from '@react-native-community/netinfo';



export default function HomeScreen(){
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned,setscanned] = useState(false);
    const [text , setText] = useState('Not yet Scanned');
    const navigation=useNavigation();
    const [rollno,setRollno]=useState('');

    const askForCameraPermission = () => {
      (async () =>{
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted')
      })()
    }
  //Request Camera Permission
    useEffect(() =>{
      const unsubcribe = NetInfo.addEventListener(state =>{
        if(state.isConnected === true)
          askForCameraPermission();
        else
          alert('Internet Required');
      })
      
      return () =>{
        unsubcribe();
      };
    }, []);
  
  //what happens when we scan the barcode
  const handleBarCodeScanned = ({ type, data }) =>{
    setscanned(true);
    // console.log('Type:'+ type +' \n Data: '+ data.length);
    if(data.length === 10 && data.substring(7,8) === '5'){
        navigation.dispatch(
          StackActions.replace('DetailsScreen',{
            'itemId':data,
          })
        );
    }else{
      setText('*Wrong barcode*');
      setTimeout(() => {
        setText('');
      }, 3000);
      
    }
  } 
    
  const InputReader = () =>{
    // console.log(rollno.length);
    if(rollno.length === 10 && rollno.substring(7,8) === '5'){
      navigation.dispatch(
        StackActions.replace('DetailsScreen',{
          'itemId':rollno.toUpperCase(),
        })
      );
    }else{
      setText('*Invalid RollNo*');
      setTimeout(() => {
        setText('');
      }, 3000);
      
    }
  }
    
  
  
  //check Permissions and Return the Screen
    if(hasPermission === null){
      return (
        <View style={styles.container}>
          <Text>Requesting for Camera Permission</Text>
        </View>
      );
      
    }
    if(hasPermission === false){
      return (
        <View style={styles.container}>
          <Text style={{margin:10}}>Requesting for Camera Permission</Text>
          <Button title={'Allow Camera'} onPress={() => askForCameraPermission()}/>
        </View>
      );
    }
  
  
    return (
      <View style={styles.container}>
        <Text style={styles.maintext}>{text}</Text>
        <View style={styles.barcodebox}>
        
          <BarCodeScanner 
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code128]}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} 
              style={{ height:400, width:400}}
            >
            </BarCodeScanner>
        </View>
        {scanned && <Button title={'Scan Again?'}  onPress={() => setscanned(false) } color='tomato' />}
        <Text style={{fontSize:16,margin:20}}>Or</Text>
        <TextInput placeholder="RollNo" autoCapitalize='characters'  right={<TextInput.Icon icon="send-outline" onPress={() => InputReader()} />} onChangeText={(value) =>setRollno(value)} style={{alignSelf:"stretch",height:40,marginBottom:30,margin:20,borderEndColor:"#f8f8f8",borderBottomWidth:1}}/>
        
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    maintext: {
      fontSize: 16,
      margin: 20,
      color:red300,

    },
    barcodebox: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
      width: 300,
      overflow: 'hidden',
      borderRadius: 30,
      backgroundColor: 'tomato',
      marginBottom:10
    }
  });