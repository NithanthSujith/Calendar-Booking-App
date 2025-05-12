
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventCalendar from './Pages/EventCalendar';
import styled from 'styled-components';
import { addDays, subDays } from 'date-fns';
import CalendarApp from './Pages/CalendarApp';

function App() {

  return (
      <Container>
        <Router>
          <Routes>
            <Route path='/' element={<CalendarApp />} />
          </Routes>

        </Router>
      </Container>
  )
}

export default App
const Container = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');
  font-family: "Lexend", Arial, Helvetica, sans-serif;
`
