import React,{useState,useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import { db } from '../firebase';
import { format } from 'date-fns'

const TableExample = ({rollno}) => {
  const [info , setInfo] = useState([]);
  const dbRef=db.collection('records');

  
  useEffect(()=>{
    dbRef.orderBy('datetime', 'desc').where('rollno', '==', rollno).limit(5)
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
  },[]);

  return (
    <DataTable style={styles.container}>
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
      {/* <DataTable.Row>
        <DataTable.Cell>{section}</DataTable.Cell>
        <DataTable.Cell>19/11/2022</DataTable.Cell>
        <DataTable.Cell>9:45</DataTable.Cell>
      </DataTable.Row>
  
      <DataTable.Row>
        <DataTable.Cell>2</DataTable.Cell>
        <DataTable.Cell>19/11/2022</DataTable.Cell>
        <DataTable.Cell>9:45</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>3</DataTable.Cell>
        <DataTable.Cell>19/11/2022</DataTable.Cell>
        <DataTable.Cell>9:45</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>4</DataTable.Cell>
        <DataTable.Cell>19/11/2022</DataTable.Cell>
        <DataTable.Cell>9:45</DataTable.Cell>
      </DataTable.Row> */}
    </DataTable>
  );
};
  
export default TableExample;
  
const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight:15
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
});