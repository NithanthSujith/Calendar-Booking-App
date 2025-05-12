import { createContext, useState } from "react";

// Create Context
const AppContext = createContext();

// Create Provider Component
const AppProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSliderOpen, setIsSliderOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [inputData, setInputData] = useState({
    name :"",
    email : "",
    phoneNumber : "",
    services : "",
    startingTime : "",
    endingTime : ""
  })
  const [events, setEvents] = useState([])
  return (
    <AppContext.Provider value={{events, setEvents, currentDate, setCurrentDate, isSliderOpen, setIsSliderOpen, selectedDate, setSelectedDate,inputData, setInputData }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
