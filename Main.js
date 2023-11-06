import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, Button, TextInput, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
export default function Main({ navigation }) {
  const [activity, setActivity] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [token, setToken] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  // const [updateVisible, setUpdateVisible] = useState(false);
  // const [addVisible, setAddVisible] = useState(false);
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
    console.log("onChangeDate",currentDate)
    setSelectedDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime ;
    console.log("onChangeTime",currentTime)

    setShowTimePicker(false);
    
    setSelectedTime(currentTime);
  };
  const formatToThaiDateTime = (dateTime) => {
    console.log("dateTime",dateTime)
    const date = moment(dateTime)
    console.log("+++++++++++++++++=======================")
    const monthAbbreviations = {
      'January': 'ม.ค.',
      'Febuary': 'ก.พ.',
      'March': 'มี.ค.',
      'April': 'เม.ย.',
      'May': 'พ.ค.',
      'June': 'มิ.ย.',
      'July': 'ก.ค.',
      'August': 'ส.ค.',
      'September': 'ก.ย.',
      'October': 'ต.ค.',
      'November': 'พ.ย.',
      'December': 'ธ.ค.'
    };
    const monthAbbreviation = monthAbbreviations[date.format('MMMM')]; // Get the abbreviation for the month
    console.log("monthAbbreviation",date.format('MMMM'))
    const year = date.year() + 543;  // Convert CE to BE
    return `${date.format('DD')-1} ${monthAbbreviation} ${year} ${date.format('HH:mm')}`;
  };
  const handleActivitySubmit =  () => {
    const endpoint = formState.editMode ? `https://026d-49-228-104-117.ngrok-free.app/Activites/${formState.currentActivity['id']}` : 'https://026d-49-228-104-117.ngrok-free.app/Activites';
    console.log(endpoint)
    const method = formState.editMode ? 'PUT' : 'POST';
    

    const currentDateTime = new Date(
      selectedDate.getUTCFullYear(), 
      selectedDate.getUTCMonth(), 
      selectedDate.getUTCDate(),
      (selectedTime.getUTCHours() - selectedDate.getTimezoneOffset() / 60)+7,
      selectedTime.getUTCMinutes() - (selectedDate.getTimezoneOffset() % 60),
      selectedTime.getUTCSeconds(),
      selectedTime.getUTCMilliseconds()
    );

    console.log("currentDateTime")
    console.log(currentDateTime)
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
                .get("https://026d-49-228-104-117.ngrok-free.app/Activites", {
                    headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "69420"},
                    timeout: 10000,
                })
                .then((response) => {
                    setActivity(response.data);
                })
            } else{
              axios
                .get("https://026d-49-228-104-117.ngrok-free.app/Activites", {
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
      .delete(`https://026d-49-228-104-117.ngrok-free.app/Activites/${activityId}`, {
        headers: { Authorization: `Bearer ${token}` , "ngrok-skip-browser-warning": "69420" , timeout: 10000,},
      })
      .then((response) => {
        axios
                .get("https://026d-49-228-104-117.ngrok-free.app/Activites", {
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
          .get("https://026d-49-228-104-117.ngrok-free.app/Activites", {
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
  moment.locale('th');

  const styles = {
    container: {
      flex: 1,
      backgroundColor: "#fff", // use a light background
      padding: 20,
    },
    header: {
      flexDirection: "row",
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderColor: "#e1e1e1",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333", // dark text for readability
      flex: 1,
    },
    
    button: {
      backgroundColor: "#2196F3", // primary color
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginVertical: 5,
    },
    buttonText: {
      color: "#fff", // white text for the buttons
      textAlign: "center",
      fontWeight: "bold",
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingVertical: 8,
    },
    
    modalContent: {
      width: "80%",
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
    },
  };

  return (
    <View style={styles.container}>
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

      <Button style={styles.button}
        title="Add"
        onPress={() => setFormState({ modalVisible: true, editMode: false, currentActivity: null })}
      />
      <Modal
        style={{padding: 20,borderRadius: 10}}
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
          <View style={styles.modalContent}>
            <Text style={styles.title}>{formState.editMode ? " Edit activity" : " Add activity"}</Text>
            <TextInput
            style={styles.input}
              value={formState.currentActivity?.activityName || ''}
              onChangeText={(text) =>
                setFormState((prevState) => ({
                  ...prevState,
                  currentActivity: { ...prevState.currentActivity, activityName: text },
                }))
              }
              placeholder="Activity Name"
              
            />
            <TouchableOpacity style={[styles.button]} onPress={showDatepicker}>
              <Text style={styles.buttonText}>Pick Date</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button]} onPress={showTimepicker}>
              <Text style={styles.buttonText}>Pick Time</Text>
            </TouchableOpacity>
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
                value={selectedTime}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}
            <TouchableOpacity style={styles.button} onPress={handleActivitySubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]} // Apply both button and cancelButton styles
              onPress={() =>
                setFormState((prevState) => ({
                  ...prevState,
                  modalVisible: false,
                  editMode: false,
                  currentActivity: null,
                }))
              }
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
