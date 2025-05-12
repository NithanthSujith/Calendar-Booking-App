import React, { useContext, useEffect, useState } from 'react'
import { eachDayOfInterval, endOfMonth, format, getDay, isToday, startOfMonth, addMonths, subMonths, isSameDay } from 'date-fns'
import styled from 'styled-components'
import clsx from 'clsx'
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { AppContext } from '../Context/AppContext';




const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',]

const EventCalendar = ({ events }) => {
    const { isSliderOpen, setIsSliderOpen, setSelectedDate, currentDate, setCurrentDate } = useContext(AppContext);
    const firstDayOfMonth = startOfMonth(currentDate)
    const lastDayOfMonth = endOfMonth(currentDate)
    const daysInMonth = eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth
    })

    const startingDayIndex = getDay(firstDayOfMonth)


    const handleNextMonth = () => {
        setCurrentDate((prevDate) => addMonths(prevDate, 1));
    };

    const handlePreviousMonth = () => {
        setCurrentDate((prevDate) => subMonths(prevDate, 1));
    };

    const handleDayClick = (day) => {
        const today = new Date(); // Get the current date
        today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

        if (day < today) {
            return; // Stop execution if the selected day is before today
        }
        setSelectedDate(day)
        setIsSliderOpen(true)
    }


    return (
        <Container style={{ width: isSliderOpen ? "60%" : "100%" }}>
            <div className="heading" >
                <div className="previousMonth" onClick={handlePreviousMonth}>
                    <IoIosArrowDropleftCircle size={30} />
                </div>
                <h2 className='min-width-200 text-center'>{format(currentDate, "MMMM yyyy")}</h2>
                <div className="nextMonth " onClick={handleNextMonth}>
                    <IoIosArrowDroprightCircle size={30} />
                </div>

            </div>
            <div className='grid grid-col-7 '>
                {
                    WEEKDAYS.map((day) => {
                        return (
                            <div key={day} className="font-bold text-center">{day}</div>
                        )
                    })

                }
                {
                    Array.from({ length: startingDayIndex }).map((_, index) => {
                        return <div key={`empty-${index}`} ></div>
                    })
                }
                {
                    daysInMonth.map((day, index) => {

                        return <div className={
                            clsx('text-center font-bold padding-10 radius-5 border-basic min-height dayBox', {
                                "bg-blue-200": isToday(day),
                                "text-blue-900": isToday(day)
                            })
                        } key={index} onClick={() => handleDayClick(day)}>
                            {format(day, "d")}
                            {/* <div className="taskBox">
                                {
                                    events.filter((event) => isSameDay(event.date, day))
                                        .map((event) => {
                                            return <div key={event.title} className='padding-5 border-basic radius-5 font-size-14 font-normal bg-dark color-lt min-width-100'>{event.title}</div>
                                        })
                                }
                            </div> */}

                        </div>
                    })
                }
            </div>

        </Container>
    )
}

export default EventCalendar

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid #a9abad;
    /* margin-top: 30px; */
    padding: 10px;
    border-radius: 5px;
    transition: 400ms ease-in;
    /* margin-left: 30px; */
    margin: 0px;
    height: 85vh;
    .heading{
        margin-bottom: 10px;
        padding: 10px;
        display: flex;
        gap: 10px;
        align-items: center;
        width: 100%;
        justify-content: center;
    }
    .grid {
        display: grid;
        gap: 7px;
        padding: 10px ;
        width: 100%;
    }
    .grid-col-7{
        grid-template-columns: repeat(7, 1fr);
    }
    .dayBox {
        display: flex;
        flex-direction: column;
        /* gap: 10px; */
        justify-content: center;
    }
    .font-bold {
        font-weight: bold;
    }
    .text-center{
        text-align: center;
    }
    .border-basic{
        border: 1px solid #a9abad;
    }
    .padding-5{
        padding: 5px;
        
    }
    .padding-10{
        padding: 10px;
        
    }
    .padding-15{
        padding: 15px;
        
    }
    .padding-20{
        padding: 20px;
        
    }
    .radius-10 { 
        border-radius: 10px;
    }
    .radius-5 { 
        border-radius: 5px;
    }
    .bg-blue-200{
        background-color: #dbeeff;
    }
    .text-blue-900{
        color: #06355f;
    }
    .min-height{
        /* max-height: 80px; */
        min-height: 70px;
    }
    .font-size-14{
        font-size: 14px;

    }
    .font-normal{
        font-weight: 500;
    }
    .bg-dark{
        background-color: #06355f;

    }
    .color-lt{
        color: #dbeeff;
    }
    .taskBox{
        margin-top: 10px;
        display: flex;
        /* flex-direction: column; */
        gap: 5px;
        flex-wrap: wrap;
    }
    .min-width-100 { 
        min-width: 80px;
    }
    .min-width-200 { 
        min-width: 200px;
    }
`
