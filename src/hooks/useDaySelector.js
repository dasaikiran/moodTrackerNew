import { useState, useCallback, useMemo } from 'react';

// Copied from App.js - This list is static
export const daysList = [
  {
    id: '3639dd44-a5d5-11ec-b909-0242ac120002',
    day: 'Sun',
    dayNumber: 1,
  },
  {
    id: '3639e17c-a5d5-11ec-b909-0242ac120002',
    day: 'Mon',
    dayNumber: 2,
  },
  {
    id: '3639e37a-a5d5-11ec-b909-0242ac120002',
    day: 'Tue',
    dayNumber: 3,
  },
  {
    id: '3639e532-a5d5-11ec-b909-0242ac120002',
    day: 'Wed',
    dayNumber: 4,
  },
  {
    id: '3639e8c0-a5d5-11ec-b909-0242ac120002',
    day: 'Thu',
    dayNumber: 5,
  },
  {
    id: '3639ea32-a5d5-11ec-b909-0242ac120002',
    day: 'Fri',
    dayNumber: 6,
  },
  {
    id: '3639eb90-a5d5-11ec-b909-0242ac120002',
    day: 'Sat',
    dayNumber: 0,
  },
];

// activeEmojiNameProp will come from useEmojiManagement via App.js
const useDaySelector = (currentMonthCalendarDates, activeEmojiNameProp) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState(
    daysList[0].dayNumber,
  );

  const handleDayChange = useCallback(event => {
    setSelectedDayNumber(parseInt(event.target.value, 10));
  }, []);

  const nameDayCount = useMemo(() => {
    if (
      !currentMonthCalendarDates ||
      currentMonthCalendarDates.length === 0 ||
      !activeEmojiNameProp // Check if activeEmojiNameProp is provided
    ) {
      return '00';
    }

    let count = 0;
    const numericSelectedDayNumber = parseInt(selectedDayNumber, 10);

    currentMonthCalendarDates.forEach(dateItem => {
      const dateNumber = parseInt(dateItem.date, 10);
      const dayMatches = (dateNumber % 7) === numericSelectedDayNumber;

      if (dayMatches && dateItem.emojiName === activeEmojiNameProp) {
        count += 1;
      }
    });

    return count < 10 ? `0${count}` : `${count}`;
  }, [selectedDayNumber, activeEmojiNameProp, currentMonthCalendarDates]);

  return {
    daysList, // Static list
    selectedDayNumber,
    nameDayCount,
    handleDayChange,
    // No longer returns selectedEmojiNameForCount or handleEmojiNameChangeForCount
  };
};

export default useDaySelector;
