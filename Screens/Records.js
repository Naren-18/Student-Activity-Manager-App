import { View,StyleSheet,Text,StatusBar,SafeAreaView,ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import {  useRoute } from '@react-navigation/native';
import { DataTable, TextInput } from 'react-native-paper';
import { db } from '../firebase';
import { format } from 'date-fns';



export default function RecordsScreen() {
    const route=useRoute();
    const [info , setInfo] = useState([]);
    const [section,setSection] = useState('');
    const [year,setYear] = useState('');
    const dbRef=db.collection('records');
    const { rollno } = route.params;

  useEffect(() => {
    dbRef.orderBy('datetime', 'desc').where('rollno', '==', rollno)
    .get()
    .then(querySnapshot => {
      var list=[];
      var no=1;
        querySnapshot.forEach(documentSnapshot => {
          var data = {'sno':no,'Date':format(documentSnapshot.data().datetime.toDate(),'dd/MM/yyyy'),'Time':format(documentSnapshot.data().datetime.toDate(),'hh:mm a')};
          list.push(data);
          no+=1;
        });
        setInfo(list);
        // console.log(list);
    });
    
    dbRef.where('rollno', '==', rollno).limit(1)
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          setSection(documentSnapshot.data().section);
          setYear(documentSnapshot.data().year);
        });
    });

  }, []);
    
    
 

    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
            <View style={{marginTop:30,alignItems:"center"}}>
            <Text style={styles.rollno}>{rollno}</Text>
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
            <DataTable style={styles.tablecontainer}>
                <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title>S.No</DataTable.Title>
                    <DataTable.Title>Date</DataTable.Title>
                    <DataTable.Title>Time</DataTable.Title>
                </DataTable.Header>
                {
                    info.map((data) => (
                        <DataTable.Row key={data.sno}>
                            <DataTable.Cell>{data.sno}</DataTable.Cell>
                            <DataTable.Cell>{data.Date}</DataTable.Cell>
                            <DataTable.Cell>{data.Time}</DataTable.Cell>
                        </DataTable.Row>
                     ))
                } 
      
            </DataTable>
          </View>
            </ScrollView>
        </SafeAreaView>

      
    );
  }
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor:'white',
      },
      scrollView: {
        backgroundColor:'white',
        marginHorizontal: 20,
      },
      rollno: {
        marginTop:24,
        fontSize:16,
        fontWeight:"600"
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
      tablecontainer: {
        paddingLeft: 15,
        paddingRight:15
      },
      tableHeader: {
        backgroundColor: '#DCDCDC',
      },
  });
