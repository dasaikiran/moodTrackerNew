import React, { useContext } from 'react'; // Import useContext
import MoodTrackerContext from '../../context/MoodTrackerContext';
import Header from '../Header';
import Calender from '../Calender';
import './index.css';

const Home = () => { // Converted to functional component
  const contextValue = useContext(MoodTrackerContext); // Use useContext
  const {
    emojisListNew, // This is emojisListWithCounts, aliased in App.js context
    nameDayCount,
    activeEmoji, // This is activeEmojiId, aliased in App.js context
    // calenderList, // Not directly used by Home, passed to Calender by App.js context structure
    daysList, // This is staticDaysList, provided by App.js context
    activeEmojiName,
    selectedDayNumber, // This was activeDay, now selectedDayNumber from useDaySelector via App.js context
    onEmojiClick, // This is handleEmojiClick from useEmojiManagement via App.js context
    onEmojiNameChange, // This is handleEmojiNameChange from useEmojiManagement via App.js context
    onDayChange, // This is handleDayChange from useDaySelector via App.js context
  } = contextValue;

  return (
    <>
      <Header />
      <div
        data-testid="homeBodyContainer"
        className="home-body-container"
      >
        <h1 data-testid="homeMainHeading" className="home-main-heading">
          Moods in a Month
        </h1>
        <div
          data-testid="homeAllContainer"
          className="home-all-container"
        >
          <div
            data-testid="calenderContainer1"
            className="calender-container1"
          >
            {/* Calender component receives its props directly from MoodTrackerContext within its own file */}
            <Calender />
          </div>
          <div data-testid="helloMoto" className="helloMoto">
            <div
              data-testid="emojisListContainer"
              className="emojis-list-container"
            >
              {/* emojisListNew here is emojisListWithCounts from useEmojiManagement */}
              <ul data-testid="emojiUl" className="emoji-ul">
                {emojisListNew.map(item => {
                  const { id, emojiName, emojiUrl } = item;
                  const onEmojiSelect = () => {
                    onEmojiClick(id);
                  };
                  // activeEmoji here is activeEmojiId from useEmojiManagement
                  const activeEmojiClass =
                    activeEmoji === id ? 'activeEmoji' : ''; // Ensure empty string if not active
                  const activeEmojiPara =
                    activeEmoji === id ? 'activeEmojiPara' : ''; // Ensure empty string
                  const activeEmojiButton =
                    activeEmoji === id ? 'activeEmojiButton' : ''; // Ensure empty string
                  return (
                    <li
                      data-testid="emojiLi"
                      key={id}
                      className="emoji-li"
                    >
                      <button
                        data-testid="emojiButton"
                        type="button"
                        onClick={onEmojiSelect}
                        className={`emoji-button ${activeEmojiButton}`}
                      >
                        <p
                          data-testid="emojiPara"
                          className={`emoji-para ${activeEmojiPara}`}
                        >
                          {emojiName}
                        </p>
                        <img
                          data-testid="emojiImg"
                          className={`emoji-img ${activeEmojiClass}`}
                          src={emojiUrl}
                          alt={emojiName}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              data-testid="selectContainer"
              className="select-container"
            >
              {/* emojisList (base list) is used for populating this dropdown */}
              <select
                onChange={onEmojiNameChange}
                value={activeEmojiName} // Controlled by activeEmojiName from useEmojiManagement
                className="emoji-select"
                data-testid="emojiSelect"
              >
                {/* Ensure contextValue.emojisList (base list) is used for options */}
                {(contextValue.emojisList || []).map(item => (
                  <option key={item.id} value={item.emojiName}>
                    {item.emojiName}
                  </option>
                ))}
              </select>
              <select
                onChange={onDayChange}
                value={selectedDayNumber} // Controlled by selectedDayNumber from useDaySelector
                className="day-select"
                data-testid="daySelect"
              >
                {/* daysList is staticDaysList from useDaySelector */}
                {daysList.map(item => (
                  <option key={item.id} value={item.dayNumber}>
                    {item.day}
                  </option>
                ))}
              </select>
              <h1 data-testid="nameDayCount" className="name-day-count">
                {nameDayCount}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
