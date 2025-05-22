import React, { useContext } from 'react'; // Import useContext
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import './index.css';
import MoodTrackerContext from '../../context/MoodTrackerContext';

const Calender = () => { // Converted to functional component
  const contextValue = useContext(MoodTrackerContext); // Use useContext
  const {
    calenderList,
    onChangeCalenderList, // This is onCalendarDateUpdate from App.js
    onRightArrowClick,
    onLeftArrowClick,
    daysList, // This is staticDaysList from useDaySelector via App.js
    month, // This is currentMonth from useCalendarState via App.js
  } = contextValue;

  // Ensure calenderList and month are valid before trying to access monthName
  const monthName = calenderList[month - 1]?.monthName || 'Loading...';
  const currentMonthDates = calenderList[month - 1]?.dates || [];

  return (
    <>
      <div data-testid="arrowContainer" className="arrow-container">
        <button
          type="button"
          onClick={onLeftArrowClick}
          className="arrow-button"
          aria-label="Previous"
          data-testid="previous-button"
        >
          <MdOutlineKeyboardArrowLeft className="arrow-icon" />
        </button>

        <h1 data-testid="monthPara" className="month-para">
          {monthName}
        </h1>

        <button
          type="button"
          onClick={onRightArrowClick}
          className="arrow-button"
          aria-label="Next" // Corrected from "Previous"
          data-testid="next-button"
        >
          <MdOutlineKeyboardArrowRight className="arrow-icon" />
        </button>
      </div>
      <div data-testid="calenderDates" className="calender-dates">
        <ul data-testid="daysUl" className="days-ul">
          {daysList.map(item => (
            <li data-testid="daysLi" key={item.id} className="days-li">
              <p
                data-testid="dayCalenderPara"
                className="day-calender-Para"
              >
                {item.day}
              </p>
            </li>
          ))}
        </ul>
        <ul data-testid="datesUl" className="dates-ul">
          {currentMonthDates.map(item => {
            const { id, date, emojiUrl, emojiName: itemEmojiName } = item; // Renamed emojiName to avoid conflict
            const onClick = () => {
              onChangeCalenderList(id, month); // month here is currentMonth from context
            };
            return (
              <li data-testid="datesLi" key={id} className="dates-li">
                <button
                  type="button"
                  onClick={onClick}
                  className="dates-li-button"
                  data-testid="datesLiButton"
                >
                  <p data-testid="datesPara" className="dates-para">
                    {date}
                  </p>
                  {itemEmojiName !== '' ? (
                    <img
                      className="dates-emoji"
                      src={emojiUrl}
                      alt={date} // alt should ideally be more descriptive, like itemEmojiName
                      data-testid="datesEmoji"
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Calender;
