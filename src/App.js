import { useState, useCallback } from 'react';
import { Switch, Route } from 'react-router-dom';
import MoodTrackerContext from './context/MoodTrackerContext';
import Login from './components/Login';
import Home from './components/Home';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Reports from './components/Reports';

import useCalendarState from './hooks/useCalendarState';
import useEmojiManagement from './hooks/useEmojiManagement';
import useReportGenerator from './hooks/useReportGenerator';
import useDaySelector, { daysList as staticDaysList } from './hooks/useDaySelector'; // Import static daysList

import './App.css';

const App = () => {
  const [homeActive, setHomeActive] = useState(true);
  const [reportActive, setReportActive] = useState(false);

  const {
    calenderList,
    month: currentMonth, // Renamed to avoid conflict with reportMonth
    handleDateClick,
    onLeftArrowClick,
    onRightArrowClick,
    initialMonthsList, // This is the static list of month structures
  } = useCalendarState();

  const {
    emojisListWithCounts, // Renamed from emojisListNew
    activeEmojiId,
    activeEmojiName,
    activeEmojiUrl,
    handleEmojiClick,
    handleEmojiNameChange,
    updateEmojiCounts,
    emojisList, // This is the static base list of emojis
  } = useEmojiManagement();

  const {
    reportMonth,
    handleReportMonthChange,
    monthlyReportData,
  } = useReportGenerator(calenderList, emojisList); // Pass base emojisList

  // Determine current month's dates for useDaySelector
  const currentMonthDataForDaySelector =
    calenderList.find(m => m.month === currentMonth)?.dates || [];

  const {
    selectedDayNumber,
    nameDayCount,
    handleDayChange,
    // daysList is also exported from useDaySelector, but we use staticDaysList for clarity
  } = useDaySelector(currentMonthDataForDaySelector, activeEmojiName);


  const onCalendarDateUpdate = useCallback(
    (dateId, monthNumberToUpdate) => {
      // activeEmojiDetails for handleDateClick
      const emojiDetailsForUpdate = { emojiUrl: activeEmojiUrl, emojiName: activeEmojiName };
      
      const { oldEmojiName, newEmojiName } = handleDateClick(
        dateId,
        monthNumberToUpdate, // Pass the month number of the date being clicked
        emojiDetailsForUpdate,
      );
      updateEmojiCounts({ oldEmojiName, newEmojiName });
    },
    [activeEmojiUrl, activeEmojiName, handleDateClick, updateEmojiCounts],
  );

  const onHomeClick = () => {
    setHomeActive(true);
    setReportActive(false);
  };

  const onReportClick = () => {
    setReportActive(true);
    setHomeActive(false);
  };
  
  //onChangeMonth is not directly provided by useCalendarState, 
  // but onLeftArrowClick and onRightArrowClick handle month changes.
  // The original onChangeMonth in App.js also called getNameDayCount and getCalenderReport.
  // These are now handled reactively by useDaySelector (via activeEmojiName and currentMonthCalendarDates)
  // and useReportGenerator (via calenderList).

  return (
    <MoodTrackerContext.Provider
      value={{
        homeActive,
        reportActive,
        onHomeClick,
        onReportClick,

        // From useCalendarState
        calenderList,
        month: currentMonth,
        onLeftArrowClick,
        onRightArrowClick,
        initialMonthsList, // For components needing the month names/structure

        // From useEmojiManagement
        emojisListNew: emojisListWithCounts, // Aliased for existing context consumers
        activeEmoji: activeEmojiId, // Aliased
        activeEmojiName,
        // activeEmojiUrl is not directly in old context, but Home might need it if it constructs activeEmojiDetails
        onEmojiClick: handleEmojiClick,
        onEmojiNameChange: handleEmojiNameChange,
        emojisList, // Base list for UI elements like dropdowns

        // Combined calendar update logic
        onChangeCalenderList: onCalendarDateUpdate,

        // From useDaySelector
        daysList: staticDaysList, // Static list for day dropdown
        selectedDayNumber, // Renamed from activeDay for clarity
        nameDayCount,
        onDayChange: handleDayChange,
        // activeEmojiName (for day selector context) is already `activeEmojiName` from useEmojiManagement
        // onEmojiNameChange (for day selector context) is `handleEmojiNameChange` from useEmojiManagement

        // From useReportGenerator
        reportCalenderMonth: reportMonth, // Aliased
        onReportCalenderChange: handleReportMonthChange,
        calenderReportList: monthlyReportData, // Aliased

        // Deprecated functions that are now handled by hooks or reactive updates:
        // getNameDayCount: No longer a function to call, nameDayCount is a direct value.
        // onChangeMonth: Month changes are handled by arrow clicks, dependent calculations are reactive.
      }}
    >
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/reports" component={Reports} />
        <Route component={NotFound} />
      </Switch>
    </MoodTrackerContext.Provider>
  );
};

export default App;
