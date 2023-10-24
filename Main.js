import { StatusBar } from "expo-status-bar";
import React from "react";
import {View,ScrollView,} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable, Button ,Portal,Dialog,TextInput,Text,Searchbar} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Alert, prompt } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';



export default function Main() {
  let navigation = useNavigation();
  const [todos, setTodos] = useState([]);
  const [visible, setVisible] = useState(false); // Dialog visibility
  const [newItem, setNewItem] = useState({ name: "", when: "" }); // New item data
  const [editItem, setEditItem] = useState({}); // Edit item data
  const [editIndex, setEditIndex] = useState(null); // Index of item being edited
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([5,10]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(5);
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, todos.length);
  const itemsToDisplay = todos.slice(from, to);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [date, setDate] = useState(new Date());
  const [showDateTimePicker, setShowDatePicker] = useState(false);
  const onChangeSearch = query => setSearchQuery(query);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [when, setWhen] = useState(new Date()); // Initialize with the current date and time


  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setShowDatePicker(false);
      setWhen(selectedDate);
    }
  };
  const getToken = async () => {
    try {
      const tokenn = await AsyncStorage.getItem("token");
      console.log("Token retrieved:", tokenn);

      return tokenn;
    } catch (error) {
      console.log("Failed to get token:", error);
    }
  };
  useEffect(() => {
    getToken().then((token) => {
      console.log("This token:" + token);
      if (token) {
        console.log("Getting token from AsyncStorage");
        axios
          .get("https://4a49-161-200-191-29.ngrok-free.app/Activites", {
            headers: { Authorization: "Bearer " + token },
            "ngrok-skip-browser-warning": "69420",
            timeout: 10000,
          })
          .then((response) => {
            console.log(token);
            console.log(response.data);
            setTodos(response.data);
          })
          .catch((error) => {
            if (error.code === "ERR_NETWORK") {
              Alert.alert("server is down");
            } else {
              // Something happened in setting up the request that triggered an error
              console.log(error.code);
              console.log(error);
            }
          });
      } else {
        // Handle the case where the token is not found in AsyncStorage
        // You may want to navigate the user back to the login screen or take appropriate action.
      }
    });
  }, []);

  function ToDo({ name, when, id }) {
    return (
      <DataTable.Row key={id}>
        <DataTable.Cell style={{flex: 0.5}}>
          <View style={{ flexDirection: "row", alignItems: "center" , flex:0.5}}>
            <Button icon="pen" mode="text" onPress={handleAddItem} style={{left: -15}}></Button>
            <Button
              icon={() => (
                <MaterialCommunityIcons
                  name="trash-can"
                  size={24}
                  color="black"
                />
              )} 
              mode="text"
              style={{ left: -55 , width: 30}}
              onPress={() =>
                Alert.alert(
                  "Confirm Deletion",
                  "Are you sure you want to delete this item?",
                  [
                    {
                      text: "Cancel",
                    },
                    {
                      text: "Delete",
                      onPress: () => handleDeleteItem(id),
                    },
                  ]
                )
              }
            />
            
          </View>
        </DataTable.Cell>
        <DataTable.Cell>{name}</DataTable.Cell>
        <DataTable.Cell numeric>{when}</DataTable.Cell>
        
      </DataTable.Row>
    );
  }
  const showDialog = () => setVisible(true);

  // Function to close the dialog
  const hideDialog = () => setVisible(false);

  function handleAddItem() {
    showDialog();
  }
  function handleAddItemConfirmed() {
    // can add and remove now
    const newTodo = {
      activityName: newItem.name,
      when: newItem.when,
    };
    getToken().then((token) => {
      {
        axios
          .post(
            "https://4a49-161-200-191-29.ngrok-free.app/Activites",
            newTodo,
            {
              headers: { Authorization: "Bearer " + token },
              "ngrok-skip-browser-warning": "69420",
              "Content-Type": "application/json",
              timeout: 10000,
            }
          )
          .then((response) => {
            setNewItem({ name: "", when: "" }); // Clear the input fields
            setVisible(false)
            console.log("ADD NEW TODO");

            axios
              .get("https://4a49-161-200-191-29.ngrok-free.app/Activites", {
                headers: { Authorization: "Bearer " + token },
                "ngrok-skip-browser-warning": "69420",
                "Content-Type": "application/json",
                timeout: 10000,
              })
              .then((response) => {
                setTodos(response.data);
              })
              .catch((error) => {});
          })
          .catch((error) => {
            console.log("ALERT");
            console.log(error);
          });
      }
    });
  }
  function handleDeleteItem(id) {
    console.log("ID : " + id);

    getToken().then((token) => {
      axios
        .delete(`https://4a49-161-200-191-29.ngrok-free.app/Activites/${id}`, {
          headers: { Authorization: "Bearer " + token },
          "ngrok-skip-browser-warning": "69420",
          timeout: 10000,
        })
        .then((response) => {
          const updatedTodos = todos.filter((todo) => todo.id !== id);
          setTodos(updatedTodos);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  
  return (
    <ScrollView>
      <Searchbar placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} style={{ margin: 10 ,width:'75%'}}/>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{flex: 0.5}}>Actions</DataTable.Title>
          <DataTable.Title>กิจกรรม</DataTable.Title>
          <DataTable.Title>วันเวลา</DataTable.Title>
        </DataTable.Header>
        {itemsToDisplay  &&
          itemsToDisplay .map((todo, index) =>
            todo ? (
              <ToDo key={todo.id} name={todo.name} when={todo.when} id={todo.id} />

            ) : null
          )}
        <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(todos.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${todos.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
      </DataTable>

        <Button icon="plus" onPress={showDialog}>
          Add
        </Button>
      
        <Portal>
  <Dialog visible={visible} onDismiss={hideDialog}>
    <Dialog.Title>
      {editIndex !== null ? "Edit Item" : "Add Item"}
    </Dialog.Title>
    <Dialog.Content>
      <TextInput
        label="Name"
        value={editItem.name || newItem.name}
        onChangeText={(text) => {
          if (editIndex !== null) {
            setEditItem({ ...editItem, name: text });
          } else {
            setNewItem({ ...newItem, name: text });
          }
        }}
      />
      <TextInput
  label="When"
  value={when.toLocaleString()} // Display the date and time from the 'when' state
  editable={false} // Make it non-editable
  right={<TextInput.Icon name="calendar" onPress={() => setShowDatePicker(true)} />}
/>

    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={hideDialog}>Cancel</Button>
      <Button onPress={handleAddItemConfirmed}>Add</Button>
      
    </Dialog.Actions>
  </Dialog>
  {showDateTimePicker && (
    <DateTimePicker
      value={selectedDate}
      mode="datetime"
      is24Hour={true}
      display="default"
      onChange={handleDateChange}
    />
  )}
</Portal>

    </ScrollView>
  );
}

// TouchableOpacity onPress={() => navigation.navigate('sign-in')}>
// <Text>Sign Out</Text>
// </TouchableOpacity>
// <StatusBar style='auto' />
