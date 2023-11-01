import React, { useState } from 'react';
import { View, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomDateTimePicker = () => {
  const [newItem, setNewItem] = useState({ when: new Date() });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState('date');
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newItem.when;
    if (event.type === 'set') {
      if (mode === 'date') {
        setNewItem({ ...newItem, when: currentDate });
        setMode('time');
      } else {
        setShowDatePicker(false); // hide the picker once both date and time are picked
      }
    } else {
      setShowDatePicker(false); // hide the picker if cancelled
    }
  };

  const showMode = (currentMode) => {
    setShowDatePicker(true);
    setMode(currentMode);
  };

  const showDateTimePicker = () => {  // Renamed the function here
    showMode('date');
  };
  
  return (
    <View>
      <Button onPress={showDateTimePicker} title="Show Date Picker" />  // Updated the function call here
      
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={newItem.when}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === 'android' ? 'default' : 'spinner'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default CustomDateTimePicker;
