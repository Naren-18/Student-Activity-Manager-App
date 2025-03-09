import { View,StyleSheet,Button,Modal,Image,Text,TouchableOpacity,Animated,ScrollView,SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation, useRoute,StackActions, CurrentRenderContext } from '@react-navigation/native';
import TableExample from '../src/DataTable';
import {  TextInput } from 'react-native-paper';
import { db } from '../firebase';
import firebase from "firebase/app";
import { format } from 'date-fns';
import { green400 } from 'react-native-paper/lib/commonjs/styles/themes/v2/colors';



const ModalPoup = ({visible, children}) => {
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function DetailsScreen() {
  const route=useRoute(); 
  const navigation=useNavigation();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const { itemId } = route.params;
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [section,setSection] = useState('A');
  const [year,setYear] = useState('');
  const dbRef=db.collection('records');
  const [totalrecords,setTotalrecords]=useState(0);
  const [currentDate,setCurrentdate] = useState('');
  const [currentTime,setCurrenttime] = useState('');
  const [text , setText] = useState('');
  const [bgcolor,setBgcolor] = useState('');
  const [nooflates,setNooflates]=useState(0);

  useEffect(() => {
    var date = firebase.firestore.Timestamp.now().toDate(); //Current Date
    var size;
    setCurrentDateTime(date);
    setCurrentdate(format(firebase.firestore.Timestamp.now().toDate(),'dd/MM/yyyy'));
    setCurrenttime(format(firebase.firestore.Timestamp.now().toDate(),'hh:mm a'));
    //Start time of today 12AM
    const starttime = new Date();
    starttime.setHours(0);
    starttime.setMinutes(0);
    starttime.setMilliseconds(0);
    starttime.setSeconds(0);

    //end time of college 4PM
    const endtime = new Date();
    endtime.setHours(16);
    endtime.setMinutes(0);
    endtime.setMilliseconds(0);
    endtime.setSeconds(0);
    //Year and Section Identification Code 
    var month = new Date().getMonth() + 1;
    var Year = new Date().getFullYear();
    Year=parseInt(Year.toString().slice(-2))
    if(parseInt(month)>6){
      Year=Year+1;
    }
    if((itemId.substring(4,5)!='5' && parseInt(itemId.substring(0,2))+4 === Year) || (itemId.substring(4,5)=='5' && parseInt(itemId.substring(0,2))+3 === Year) ){
      setSelected('IV');
      setYear('IV year');
    }
    else if((itemId.substring(4,5)!='5' && parseInt(itemId.substring(0,2))+3 === Year) || (itemId.substring(4,5)=='5' && parseInt(itemId.substring(0,2))+2 === Year)){
      setSelected('III');
      setYear('III year');
    }else{
      setSelected('II');
      setYear('II year');
    }

    if(parseInt(itemId.substring(0,2))>20){

      if((itemId.substring(4,5)!='5' && itemId.substring(7)>='501' && itemId.substring(7)<='566') || (itemId.substring(4,5)=='5' && itemId.substring(7)>='501' && itemId.substring(7)<='506' ))
            setSection('A');
        else if((itemId.substring(4,5)!='5' && itemId.substring(7)>='567' && itemId.substring(7)<='5D2') || (itemId.substring(4,5)=='5' && itemId.substring(7)>='507' && itemId.substring(7)<='512' ))
            setSection('B');
        else if((itemId.substring(4,5)!='5' && itemId.substring(7)>='5D3' && itemId.substring(7)<='5K8') || (itemId.substring(4,5)=='5' && itemId.substring(7)>='513' && itemId.substring(7)<='520' ))
            setSection('C');
        else
            setSection('D');
    }else{
        if((itemId.substring(4,5)!='5' && itemId.substring(7)>='501' && itemId.substring(7)<='560') || (itemId.substring(4,5)=='5' && itemId.substring(7)>='501' && itemId.substring(7)<='506' ))
            setSection('A');
        else if((itemId.substring(4,5)!='5' && itemId.substring(7)>='561' && itemId.substring(7)<='5C0') || (itemId.substring(4,5)=='5' && itemId.substring(7)>='507' && itemId.substring(7)<='512' ))
            setSection('B');
        else if((itemId.substring(4,5)!='5' && itemId.substring(7)>='5C1' && itemId.substring(7)<='5J0') || (itemId.substring(4,5)=='5' && itemId.substring(7)>='513' && itemId.substring(7)<='518' ))
            setSection('C');
        else
            setSection('D');
      
    }
    //End of Year and Section Identification Code

    //Database Code Starts here
    dbRef.get().then(querySnapshot => {setTotalrecords(size = querySnapshot.size + 1);}); //Number of Total Records

    //No of Late's by a Student
    dbRef.where('rollno', '==', itemId)
    .get()
    .then(querySnapshot => {
      setNooflates(querySnapshot.size)
    });

    //No of late's by a Student in a Month for warning
    dbRef.where('rollno', '==', itemId).where('datetime','>=',new Date(date.getFullYear(), date.getMonth(), 1)).where('datetime','<=',new Date(date.getFullYear(), date.getMonth()+1, 0))
    .get()
    .then(querySnapshot => {
      if(querySnapshot.size>4)
        setBgcolor('red');
      else
        setBgcolor('lightgreen');
    });
    
    
    //Section And Year Details
    dbRef.orderBy('datetime', 'asc').where('rollno', '==', itemId).limit(1)
    .get()
    .then(querySnapshot => {
      if(querySnapshot.size === 0){ //No record Exist
        setVisible(true);
      }
      else{
        var Section;
        var Year;
        querySnapshot.forEach(documentSnapshot => {
          // console.log('User ID: ', documentSnapshot.data());
          Section=documentSnapshot.data().section;
          Year=documentSnapshot.data().year;
          setSection(documentSnapshot.data().section);
          setYear(documentSnapshot.data().year);
        });
        setVisible(false);
        
        //only one time in a day 
        dbRef.orderBy('datetime', 'desc').where('rollno', '==', itemId).where('datetime','>=',starttime).where('datetime','<=',endtime)
        .get()
        .then(querySnapshot => {
        if(querySnapshot.size === 0)
        {
          const record={
            'rollno':itemId,
            'datetime':date,
            'section':Section,
            'year':Year,
          }
          if(date >= starttime && date <= endtime){
              dbRef.doc(`${size}`).set(record); 
              setText('*New Record Saved*');
          }
          setTimeout(() => {
            setText('');
          }, 3000);
        }
        
        });
        
        
      }
      //End of Database Code
    });
    

  }, []);
    const data = [
      {key:'II',value:'II year'},
      {key:'III',value:'III year'},
      {key:'IV',value:'IV year'},
      {key:'I',value:'I year'},
    ];
    
 

    const AddData=()=>{
      var date = firebase.firestore.Timestamp.now().toDate(); //Current Date
      //Start time of today 12AM
      const starttime = new Date();
      starttime.setHours(0);
      starttime.setMinutes(0);
      starttime.setMilliseconds(0);
      starttime.setSeconds(0);

      //end time of college 4PM
      const endtime = new Date();
      endtime.setHours(16);
      endtime.setMinutes(0);
      endtime.setMilliseconds(0);
      endtime.setSeconds(0);
      
      const newrecord={
        'rollno':itemId,
        'datetime':currentDateTime,
        'section':section,
        'year':selected
      }
      if(date >= starttime && date <= endtime){
          dbRef.doc(`${totalrecords}`).set(newrecord); 
          setText('*New Record Saved*');
      }
      setTimeout(() => {
        setText('');
      }, 3000);
      setVisible(false);
      setSection(section);
      setYear(selected);

    }
    return (
      <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={{marginTop:30,alignItems:"center"}}>
            <View style={styles.avatarContainer}>
            <Text style={styles.maintext}>{text}</Text>
              <Image style={styles.avatar} source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR55fioR2POdquWTSdammtR53sY53rANAiRCMe3K8SuRw&s'}}/>
            </View>
            <Text style={{...styles.rollno,backgroundColor:bgcolor,padding:5}}>{itemId}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statAmount}>CSE</Text>
              <Text style={styles.statTitle}>Branch</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statAmount}>{year}</Text>
              <Text style={styles.statTitle}>Year</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statAmount}>{section}</Text>
              <Text style={styles.statTitle}>Section</Text>
            </View>

          </View>
          <View>
              <Text style={{textAlign:'right',right:20}}>No. Of Late's: {nooflates}</Text>
              <TableExample rollno={itemId}/>
              <Text style={{textAlign:'right',right:20,color:'blue',marginBottom:10,marginTop:5}} onPress={() => navigation.navigate('RecordScreen',{rollno:itemId})} >More...</Text>
          </View>
          <ModalPoup visible={visible}>
              
              <View>
                <Text style={{fontSize:16,fontWeight:"600",marginTop:10,textAlign:"center"}}>{itemId}</Text>
                <View style={styles.statsContainer}>
                  <Text style={{}}>Date:{currentDate}</Text>
                  <Text style={{}}>Time:{currentTime}</Text>
                </View>
              </View>
              <View>
                
              <SelectList 
                  setSelected={(val) => setSelected(val)} 
                    data={data} 
                     save="key"
                     placeholder='Select Year'
                     maxHeight={130}
                     defaultOption={{key:selected,value:year}}
                     dropdownItemStyles={{marginHorizontal:10}}
                      boxStyles={{borderRadius:0,marginBottom:0}} 
              />
                
                
                  <TextInput placeholder='Section' defaultValue={section}  style={{alignSelf:"stretch",height:40,marginBottom:30,marginTop:20,borderEndColor:"#f8f8f8",borderBottomWidth:1}} underlineColorAndroid={'transparent'} onChangeText={(value) => setSection(value)}/>
                
               
                  <Button title="Submit" style={styles.selectboxwidth} onPress={AddData} />
                
              </View>
          </ModalPoup>
          <View>
          <Button title="New Record" onPress={() => navigation.dispatch(StackActions.replace('MRCET'))} />
          </View>
        </View>

        </ScrollView>
        </SafeAreaView>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
    },
    avatarContainer:{
      shadowColor:'#151734',
      shadowRadius:15,
      shadowOpacity:0.4
    },
    avatar:{
      width:136,
      height:136,
      borderRadius:68
    },
    rollno: {
      marginTop:24,
      fontSize:16,
      fontWeight:"600",
      
    },
    statsContainer:{
      flexDirection:"row",
      justifyContent:"space-between",
      margin:25
    },
    stat: {
      alignItems:"center",
      flex:1
    },
    statAmount:{
      color:"#4F566D",
      fontSize:18,
      fontWeight:"300" 

    },
    statTitle:{
      color:"#C3C5CD",
      fontSize:12,
      fontWeight:"500",
      marginTop:4
    },
    modalBackGround: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 20,
      elevation: 20,
    },
    header: {
      width: '100%',
      height: 40,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    selectboxwidth:{
      width:'100%'
    },
    maintext: {
      fontSize: 16,
      color:green400,
      textAlign:"center",
      marginBottom:5

    },
  });
