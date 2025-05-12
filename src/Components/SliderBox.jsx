import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { IoClose } from "react-icons/io5";
import { addDays, format, isSameDay, setHours, setMinutes, addMinutes, isEqual, isBefore, isAfter, parse } from 'date-fns';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { LuClock } from "react-icons/lu";
import clsx from 'clsx';
import { AppContext } from '../Context/AppContext';

const SliderBox = () => {
    const { isSliderOpen, setIsSliderOpen, selectedDate, setSelectedDate, inputData, setInputData, events, setEvents } = useContext(AppContext);
    const datesArray = Array.from({ length: 7 }, (_, index) => addDays(selectedDate, index))

    const StartingTimeArray = [];
    let startTime = setHours(setMinutes(new Date(), 0), 8); // 8:00 AM
    const endTime = setHours(setMinutes(new Date(), 0), 17); // 5:00 PM
    const [occupiedTimeSlots, setOccupiedTimeSlots] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    while (startTime <= endTime) {
        StartingTimeArray.push(format(startTime, 'h:mm a'));
        startTime = addMinutes(startTime, 30);
    }



    const filterTimeSlots = (allTimes, startTime, endTime) => {
        const parsedStart = parse(startTime, "hh:mm a", new Date());
        const parsedEnd = parse(endTime, "hh:mm a", new Date());

        return allTimes.filter((time) => {
            const parsedTime = parse(time, "hh:mm a", new Date());
            return (isAfter(parsedTime, parsedStart) || isEqual(parsedTime, parsedStart)) &&
                (isBefore(parsedTime, parsedEnd) || isEqual(parsedTime, parsedEnd));
        });
    };



    useEffect(() => {
        setOccupiedTimeSlots([])
        const matchedEvents = events.filter((event) =>
            isSameDay(event.selectedDate, selectedDate)
        );
        console.log(matchedEvents)
        matchedEvents.map((event, index) => {
            let pushingSlots = filterTimeSlots(StartingTimeArray, event.startingTime, event.endingTime)
            // occupiedTimeSlots.push(...pushingSlots)
            setOccupiedTimeSlots((prev) => ([
                ...prev,
                ...pushingSlots
            ]))
        })

        setInputData((prev) => ({
            ...prev,
            endingTime: "",
            startingTime: ""
        }))
    }, [selectedDate])




    const handleTimeSelection = (time) => {
        setInputData((prev) => {
            const { startingTime, endingTime } = prev;
    
            // If clicking the selected start time, deselect both start & end times
            if (startingTime === time) {
                return { ...prev, startingTime: null, endingTime: null };
            }
    
            // If no start time is set, set this as the starting time
            if (!startingTime) {
                return { ...prev, startingTime: time };
            }
    
            // If clicking the selected end time, deselect it
            if (endingTime === time) {
                return { ...prev, endingTime: null };
            }
    
            // Convert to Date objects for comparison
            const start = new Date(`2000-01-01 ${startingTime}`);
            const end = new Date(`2000-01-01 ${time}`);
    
            // Check if end time is before start time
            if (end <= start) {
                setErrorMessage("End Time cannot be before Start Time!");
                return prev; // Prevent selection
            }
    
            // Get all 30-min slots between start & end
            const selectedSlots = filterTimeSlots(StartingTimeArray, startingTime, time);
    
            // Check if any selected slot is already occupied
            const hasConflict = selectedSlots.some(slot => occupiedTimeSlots.includes(slot));
    
            if (hasConflict) {
                setErrorMessage("Selected time range conflicts with an existing event!");
                return prev; // Prevent selection
            }
    
            return { ...prev, endingTime: time }; // Set valid end time
        });
    };
    


    const handleDateSelect = (date) => {
        setSelectedDate(date)
    }

    const handleSubmitTask = () => {
        console.log(inputData)
        const eventsData = {
            ...inputData,
            selectedDate
        }
        setEvents((prev) => ([
            ...prev,
            eventsData
        ]))
        setInputData({
            name: "",
            email: "",
            phoneNumber: "",
            services: "",
            startingTime: "",
            endingTime: ""
        })
        setIsSliderOpen(false)
        setErrorMessage("")
    }
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputData((prevData) => ({
            ...prevData,
            [name]: value, // Update the specific field dynamically
        }));
    };


    return (

        <Container style={{ width: isSliderOpen ? "38%" : 0, border: isSliderOpen ? '1px solid #a9abad' : "none" }}>
            {
                isSliderOpen && <div>
                    <div className="sliderCloser">
                        <div className="closeBtn" onClick={() => {
                            setIsSliderOpen(false)
                            setInputData({
                                name: "",
                                email: "",
                                phoneNumber: "",
                                services: "",
                                startingTime: "",
                                endingTime: ""
                            })
                            setErrorMessage("")
                        }}><IoClose size={25} /></div>

                    </div>
                    <div className="dateContainer">
                        <div className="dateHeader">
                            <div className="dateText">{format(selectedDate, 'EEEE, MMMM d')}</div>
                            {/* <div className="dateNavigator">
                                <div className="dateNavigatorBtn"><MdKeyboardArrowLeft size={30} /></div>
                                <div className="dateNavigatorBtn"><MdKeyboardArrowRight size={30} /></div>
                            </div> */}
                        </div>
                        {
                            inputData.endingTime && inputData.startingTime ? <div className="selectedTimeDisplay"><LuClock />
                                {`${inputData.startingTime} - ${inputData.endingTime}`}</div> : null
                        }
                        {
                            inputData.endingTime && inputData.startingTime ? null : <div className="dateBox">
                                {
                                    datesArray.map((date, index) => {
                                        return <div key={`weekDate-${index}`} className={
                                            clsx("dateBtn", {
                                                "bg-dark-blue": isSameDay(selectedDate, date),
                                                "text-lt": isSameDay(selectedDate, date),

                                            })
                                        } onClick={() => handleDateSelect(date)}>
                                            <div className="dayValue">{format(date, 'EEE')}</div>
                                            <div className="dateValue">{format(date, 'd')}</div>
                                        </div>
                                    })

                                }

                            </div>
                        }


                    </div>

                    {
                        inputData.endingTime && inputData.startingTime ? null : <div>
                            <div className="timeContainer">
                                <div className="timeHeading">
                                    Duration : <span style={{ color: "red" }}>{errorMessage}</span>
                                </div>

                                <div className="time-element-box">
                                    {StartingTimeArray.map((time, index) => {
                                        const isOccupied = occupiedTimeSlots.includes(time);
                                        const isSelectedStart = inputData.startingTime === time;
                                        const isSelectedEnd = inputData.endingTime === time;

                                        return (
                                            <div
                                                key={`startTime-${index}`}
                                                className={clsx("timeElement", {
                                                    "bg-hover-time": isSelectedStart, // Highlight start time
                                                    "bg-end-time": isSelectedEnd, // Highlight end time
                                                    "bg-occupied-time": isOccupied, // Mark occupied slots
                                                })}
                                                onClick={isOccupied ? null : () => handleTimeSelection(time)}
                                            >
                                                {time}
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                            {/* <div className="timeContainer">
                                <div className="timeHeading">
                                    End Time : <span style={{ color: "red" }}>{errorMessage}</span>
                                </div>

                                <div className="time-element-box">
                                    {
                                        StartingTimeArray.map((time, index) => {
                                            return <div key={`endTime-${index}`} className={
                                                clsx("timeElement", {
                                                    "bg-hover-time": inputData.endingTime === time
                                                })
                                            } onClick={() => handleEndTime(time)}>{time}</div>
                                        })
                                    }

                                </div>
                            </div> */}
                        </div>
                    }

                    {
                        inputData.endingTime && inputData.startingTime ? <div className="mainInputContainer">
                            <div className="headingContainer">Enter Details</div>
                            <div className="inputFieldsContainer">
                                <div className="inputContainer">
                                    <input
                                        className="inputElement"
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Name"
                                        value={inputData.name}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="inputContainer">
                                    <input
                                        className="inputElement"
                                        type="tel"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        placeholder="Phone Number*"
                                        value={inputData.phoneNumber}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="inputContainer">
                                    <input
                                        className="inputElement"
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Email"
                                        value={inputData.email}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="inputContainer">
                                    <input
                                        className="inputElement"
                                        type="text"
                                        name="services"
                                        id="services"
                                        placeholder="Service"
                                        value={inputData.services}
                                        onChange={handleOnChange}
                                    />
                                </div>

                                <div className="buttonContainer">
                                    <div className="submitBtn" onClick={handleSubmitTask}>
                                        Confirm
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }

                </div>


            }

        </Container>
    )
}

export default SliderBox
const Container = styled.div`
    height: 85vh;
    transition: 400ms ease-in;
    border-radius: 5px;
    padding: 15px;
    .sliderCloser{
        width: 100%;
        display: flex;
        justify-content: end;
        /* margin-bottom: 10px; */
    }
    .closeBtn{
        /* border: 1px solid black; */
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: 300ms ease;
        &:hover{
            background-color: #dbeeff;
        }
    }
    .dateContainer{
        width: 100%;
        max-height: 100px;
        margin-bottom: 30px;
        /* border: 1px solid black; */
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .dateHeader{
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* border: 1px solid black; */
    }
    .dateText{
        font-size: 15px;
        font-weight: bold;

    }
    .dateNavigator{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 7px;
    }
    .dateNavigatorBtn{
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        /* border: 1px solid black; */
        &:hover{
            background-color: #dbeeff;
        }
    }
    .dateBox{
        width: 100%;
        height: 70px;
        /* border: 1px solid black; */
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    .dateBtn{
        width: 65px;
        height: 100%;
        /* border: 1px solid black; */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        border-radius: 5px;
        background-color: rgba(17, 17, 17, 0.05);
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        transition: 300ms ease;
        &:hover{
            background-color: rgba(17, 17, 17, 0.1);
        }
    }
    .dayValue{
        font-size: 16px;
        font-weight: 600;
    }
    .dateValue{
        font-size: 15px;
        font-weight: 700;
    }
    .bg-dark-blue{
        background-color: rgb(25, 123, 255);
        &:hover{
            background-color: rgb(25, 123, 255);
        }
    }
    .text-lt{
        color: white;
    }
    .timeHeading{
        color: rgba(17, 17, 17, 0.5);
        font-size: 13px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        /* font-weight: bold; */
    }

    .timeContainer{
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap:10px;
    }
    .time-element-box{
        /* border: 1px solid black; */
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .timeElement{
        /* border: 1px solid black; */
        padding: 10px 20px;
        border-radius: 3px ;
        background-color: rgba(17, 17, 17, 0.05);
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-weight: 500;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        cursor: pointer;
        transition: 300ms ease;
        &:hover{
            background-color: rgba(17, 17, 17, 0.1);
        }
    }
    .selectedTimeDisplay{
        font-size: 14px;
        color: #111111;
        font-weight: 400;
        display: flex;
        align-items: center;
        gap: 7px;
    }
    .bg-hover-time{
        background-color: rgba(17, 17, 17, 0.2);
    }
    .headingContainer{
        font-size: 15px;
        color: #111111;
        font-weight: 700;
        margin-bottom: 20px;
    }
    .inputFieldsContainer{
        /* border: 1px solid black; */
        display: flex;
        flex-direction: column;
        gap: 20px;
        /* justify-content: center; */
        align-items: flex-start;
        margin-left: 10px;

    }
    .inputContainer {
        width: 100%;
        display: flex;
        justify-content: start;
    }
    .inputElement{
        width: 95%;
        /* height: 40px; */
        padding: 0px 10px;
        border-radius: 8px;
        border: 1px solid #a9abad;
        outline: none;
        height: max-content;
        padding: 15px;
        font-size: 15px;
        color: #111111;

    }
    .buttonContainer{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .submitBtn{
        width: 130px;
        height: 40px;
        background-color: rgb(25, 123, 255);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: 15px;
        font-weight: bold;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        cursor: pointer;
        transition: 300ms ease-in;
        &:hover{
            background-color: rgb(68, 149, 255);
        }

    }
    .bg-occupied-time{
        background-color: #d5fed5;
        border: 1px solid #038b03;
        color: #038b03;
        box-shadow: none;
        &:hover{
            background-color: #d5fed5;
        }
    }
`