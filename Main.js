import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, Button, TextInput, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from 'moment-timezone'; // Import moment-timezone

export default function Main({ navigation }) {
  const [activity, setActivity] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [token, setToken] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [formState, setFormState] = useState({
    modalVisible: false,
    editMode: false,
    currentActivity: null
  });

  const showDatepicker = () => {
    setShowDatePicker(true);
    setShowTimePicker(false);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
    setShowDatePicker(false);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate ;
    setShowDatePicker(false);
    
    setSelectedDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime ;
    setShowTimePicker(false);
    
  setSelectedTime(currentTime);
  };
  const formatToThaiDateTime = (dateTime, timezone = 'Asia/Bangkok') => {
    const date = moment(dateTime);
    console.log("date",date)
    const year = date.year() + 543; // Convert CE to BE
  
    // Map English month names to Thai month names
    const monthMapping = {
      'Jan': 'ม.ค',
      'Feb': 'ก.พ',
      'Mar': 'มี.ค',
      'Apr': 'เม.ย',
      'May': 'พ.ค',
      'Jun': 'มิ.ย',
      'Jul': 'ก.ค',
      'Aug': 'ส.ค',
      'Sep': 'ก.ย',
      'Oct': 'ต.ค',
      'Nov': 'พ.ย',
      'Dec': 'ธ.ค',
    };
  
    const monthAbbreviation = date.format('MMM');
    const thaiMonth = monthMapping[monthAbbreviation];
  
    return `${date.format('D')} ${thaiMonth} ${year} เวลา ${date.tz(timezone).format('HH:mm')} น`;
  };
  const handleActivitySubmit = async () => {
    const endpoint = formState.editMode ? `https://7b19-49-228-96-103.ngrok-free.app/Activites/${formState.currentActivity['id']}` : 'https://7b19-49-228-96-103.ngrok-free.app/Activites';
    console.log(endpoint)
    const method = formState.editMode ? 'PUT' : 'POST';
    console.log(method)
    console.log("selectionDate Date " , selectedDate.getDate()) 
    const currentDateTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedTime.getHours(), selectedTime.getMinutes(), selectedTime.getSeconds(), selectedTime.getMilliseconds());
    console.log(selectedDate)
    console.log(selectedTime)
    console.log("currentDateTime")
    console.log(currentDateTime);
    formState.currentActivity.name = formState.currentActivity.activityName;
    const data = formState.editMode ? { activityName: formState.currentActivity['activityName'] , when: currentDateTime  } :{ activityName: formState.currentActivity['activityName'] , when: currentDateTime };
    console.log(data)
    axios({method, url: endpoint, data, headers: { Authorization: `Bearer ${token}` }})
        .then((response) => {
            console.log("formstate\n", formState);
            if (formState.editMode) {
              // console.log("activity\n", activity)
              // console.log("formState.currentActivity\n", formState.currentActivity)
              // const updatedActivity = activity.map((item) => item.id === formState.currentActivity['id'] ? formState.currentActivity : item);
              // setActivity([updatedActivity]);
              axios
                .get("https://7b19-49-228-96-103.ngrok-free.app/Activites", {
                    headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "69420"},
                    timeout: 10000,
                })
                .then((response) => {
                    setActivity(response.data);
                })
            } else{
              axios
                .get("https://7b19-49-228-96-103.ngrok-free.app/Activites", {
                    headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "69420"},
                    timeout: 10000,
                })
                .then((response) => {
                    setActivity(response.data);
                })
              }
        })
        .catch(error => {
            console.error("There was an error processing the activity: ", error);
        })
        .finally(() => {
            setFormState(prevState => ({ ...prevState, modalVisible: false, editMode: false, currentActivity: null }));
        });
    };

  const deleteActivity = async (activityId) => {
    console.log(activityId)
    axios
      .delete(`https://7b19-49-228-96-103.ngrok-free.app/Activites/${activityId}`, {
        headers: { Authorization: `Bearer ${token}` , "ngrok-skip-browser-warning": "69420" , timeout: 10000,},
      })
      .then((response) => {
        axios
                .get("https://7b19-49-228-96-103.ngrok-free.app/Activites", {
                    headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "69420"},
                    timeout: 10000,
                })
                .then((response) => {
                    setActivity(response.data);
                })
      })
      .catch((error) => {
        console.error("There was an error deleting the activity: ", error);
      });
  }
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setToken(token);
      return token;
    } catch (error) {
      console.log("Failed to get token:", error);
    }
  };

  useEffect(() => {
    getToken().then((token) => {
      if (token) {
        axios
          .get("https://7b19-49-228-96-103.ngrok-free.app/Activites", {
            headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "69420"},
            timeout: 10000,
          })
          .then((response) => {
            setActivity(response.data)
          })
          .catch((error) => {
            if (error.code === "ERR_NETWORK") {
              Alert.alert("Server is down");
            } else {
              console.log(error);
            }
          });
      }
    });
  }, [token]);

  return (
    <View style={{ flex: 1 }}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ flex: 2 }}>กิจกรรม</DataTable.Title>
          <DataTable.Title style={{ flex: 3 }}>วันเวลา</DataTable.Title>
          <DataTable.Title style={{ flex: 1 }}>Actions</DataTable.Title>
        </DataTable.Header>
        {activity.map((item,counter) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell style={{ flex: 2 }} >{item.name}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 3 }}>{formatToThaiDateTime(item.when)}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }}>
              <TouchableOpacity 
                onPress={() =>
                  setFormState({ modalVisible: true, editMode: true, currentActivity: item })
                }
              >
                <MaterialCommunityIcons name="pencil" size={24} color="#2196F3" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteActivity(item.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="#f44336" />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>

      <Button
        title="Add"
        onPress={() => setFormState({ modalVisible: true, editMode: false, currentActivity: null })}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={formState.modalVisible}
        onRequestClose={() => {
          setFormState((prevState) => ({
            ...prevState,
            modalVisible: false,
            editMode: false,
            currentActivity: null,
          }));
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", padding: 20, backgroundColor: "white", borderRadius: 10 }}>
            <Text>{formState.editMode ? " Edit activity" : " Add activity"}</Text>
            <TextInput
              value={formState.currentActivity?.activityName || ''}
              onChangeText={(text) =>
                setFormState((prevState) => ({
                  ...prevState,
                  currentActivity: { ...prevState.currentActivity, activityName: text },
                }))
              }
              placeholder="Activity Name"
              style={{ borderBottomWidth: 1, borderBottomColor: "#ccc" }}
            />
            <Button title="Pick Date" onPress={showDatepicker} />
            <Button title="Pick Time" onPress={showTimepicker} />
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}
            <Button title="Submit" onPress={handleActivitySubmit}/>
            <Button
              title="Cancel"
              onPress={() =>
                setFormState((prevState) => ({
                  ...prevState,
                  modalVisible: false,
                  editMode: false,
                  currentActivity: null,
                }))
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
