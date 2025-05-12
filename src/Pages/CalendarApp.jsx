import React, { useContext, useState } from 'react'
import EventCalendar from './EventCalendar'
import { addDays, subDays } from 'date-fns';
import SliderBox from '../Components/SliderBox';
import styled from 'styled-components';
import { AppContext } from '../Context/AppContext';

const CalendarApp = () => {
    // const {setSelectedDate, isSliderOpen, setIsSliderOpen } = useContext(AppContext);
    const [selectedStartTime, setSelectedStartTime] = useState("")
    const [selectedEndTime, setSelectedEndTime] = useState("")
    return (
        <Container>

            <EventCalendar  events={[
                {
                    date: subDays(new Date(), 6),
                    title: "Task-1"
                },
                {
                    date: subDays(new Date(), 6),
                    title: "Task-2"
                },
                {
                    date: subDays(new Date(), 6),
                    title: "Task-3"
                },
                {
                    date: subDays(new Date(), 2),
                    title: "Task-4"
                },
                {
                    date: addDays(new Date(), 3),
                    title: "Task-5"
                },
                {
                    date: addDays(new Date(), 3),
                    title: "Task-6"
                },
            ]} />

            <SliderBox selectedStartTime={selectedStartTime} selectedEndTime={selectedEndTime} setSelectedEndTime={setSelectedEndTime} setSelectedStartTime={setSelectedStartTime} />
        </Container>
    )
}

export default CalendarApp
const Container = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    padding: 30px;
`