import { useState, useCallback, useMemo } from 'react';

const useReportGenerator = (calendarData, baseEmojis) => {
  const [reportMonth, setReportMonth] = useState(1); // Default to January

  const handleReportMonthChange = useCallback(event => {
    setReportMonth(parseInt(event.target.value, 10));
  }, []);

  const monthlyReportData = useMemo(() => {
    // Ensure calendarData and baseEmojis are available and not undefined/empty
    if (
      !calendarData ||
      calendarData.length === 0 ||
      !baseEmojis ||
      baseEmojis.length === 0
    ) {
      // Return an empty array or baseEmojis with 0 counts if inputs are not ready
      return baseEmojis ? baseEmojis.map(emoji => ({ ...emoji, count: 0 })) : [];
    }

    const monthData = calendarData.find(m => m.month === reportMonth);

    if (!monthData || !monthData.dates) {
      // If no data for the selected month, return base emojis with 0 counts
      return baseEmojis.map(emoji => ({ ...emoji, count: 0 }));
    }

    const monthDates = monthData.dates;

    return baseEmojis.map(emoji => {
      const count = monthDates.reduce((acc, date) => {
        if (date.emojiName === emoji.emojiName) {
          return acc + 1;
        }
        return acc;
      }, 0);
      return {
        ...emoji,
        count,
      };
    });
  }, [reportMonth, calendarData, baseEmojis]);

  return {
    reportMonth,
    handleReportMonthChange,
    monthlyReportData,
  };
};

export default useReportGenerator;
