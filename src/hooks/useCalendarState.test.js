import { renderHook, act } from '@testing-library/react-hooks';
import useCalendarState, { initialMonthsList as staticInitialMonthsList, emojisList as staticEmojisList } from './useCalendarState';

// Helper to get a deep copy for comparisons
const deepCopy = (data) => JSON.parse(JSON.stringify(data));

describe('useCalendarState Hook', () => {
  test('should initialize with correct initial state', () => {
    const { result } = renderHook(() => useCalendarState());

    expect(result.current.month).toBe(1);
    // Test that calenderList is a deep copy, not the same reference
    expect(result.current.calenderList).toEqual(deepCopy(staticInitialMonthsList));
    expect(result.current.calenderList).not.toBe(staticInitialMonthsList);
    expect(result.current.initialMonthsList).toEqual(staticInitialMonthsList);
  });

  describe('onLeftArrowClick', () => {
    test('should decrement month', () => {
      const { result } = renderHook(() => useCalendarState());
      act(() => {
        result.current.onRightArrowClick(); // month = 2
      });
      act(() => {
        result.current.onLeftArrowClick();
      });
      expect(result.current.month).toBe(1);
    });

    test('should not decrement month below 1', () => {
      const { result } = renderHook(() => useCalendarState());
      act(() => {
        result.current.onLeftArrowClick();
      });
      expect(result.current.month).toBe(1);
    });
  });

  describe('onRightArrowClick', () => {
    test('should increment month', () => {
      const { result } = renderHook(() => useCalendarState());
      act(() => {
        result.current.onRightArrowClick();
      });
      expect(result.current.month).toBe(2);
    });

    test('should not increment month above 12', () => {
      const { result } = renderHook(() => useCalendarState());
      for (let i = 0; i < 12; i++) {
        act(() => {
          result.current.onRightArrowClick();
        });
      }
      expect(result.current.month).toBe(12);
    });
  });

  describe('handleDateClick', () => {
    const testMonth = 1; // January
    const testDateId = staticInitialMonthsList[0].dates[0].id; // First date of January
    const activeEmojiDetails = { // Example: Very Happy
      emojiName: staticEmojisList[0].emojiName,
      emojiUrl: staticEmojisList[0].emojiUrl,
    };
    const anotherEmojiDetails = { // Example: Happy
        emojiName: staticEmojisList[1].emojiName,
        emojiUrl: staticEmojisList[1].emojiUrl,
    }


    test('should add a new emoji to an empty date', () => {
      const { result } = renderHook(() => useCalendarState());
      let clickResult;
      act(() => {
        clickResult = result.current.handleDateClick(testDateId, testMonth, activeEmojiDetails);
      });

      const monthData = result.current.calenderList.find(m => m.month === testMonth);
      const dateData = monthData.dates.find(d => d.id === testDateId);

      expect(dateData.emojiName).toBe(activeEmojiDetails.emojiName);
      expect(dateData.emojiUrl).toBe(activeEmojiDetails.emojiUrl);
      expect(clickResult).toEqual({ oldEmojiName: '', newEmojiName: activeEmojiDetails.emojiName });
    });

    test('should change an existing emoji on a date', () => {
      const { result } = renderHook(() => useCalendarState());
      // First, add an emoji
      act(() => {
        result.current.handleDateClick(testDateId, testMonth, activeEmojiDetails);
      });

      // Then, change it
      let clickResult;
      act(() => {
        clickResult =result.current.handleDateClick(testDateId, testMonth, anotherEmojiDetails);
      });

      const monthData = result.current.calenderList.find(m => m.month === testMonth);
      const dateData = monthData.dates.find(d => d.id === testDateId);

      expect(dateData.emojiName).toBe(anotherEmojiDetails.emojiName);
      expect(dateData.emojiUrl).toBe(anotherEmojiDetails.emojiUrl);
      expect(clickResult).toEqual({ oldEmojiName: activeEmojiDetails.emojiName, newEmojiName: anotherEmojiDetails.emojiName });
    });

    test('should remove an emoji if the same emoji is clicked again', () => {
      const { result } = renderHook(() => useCalendarState());
      // First, add an emoji
      act(() => {
        result.current.handleDateClick(testDateId, testMonth, activeEmojiDetails);
      });
      
      // Then, click the same emoji again to remove it
      let clickResult;
      act(() => {
        clickResult = result.current.handleDateClick(testDateId, testMonth, activeEmojiDetails);
      });

      const monthData = result.current.calenderList.find(m => m.month === testMonth);
      const dateData = monthData.dates.find(d => d.id === testDateId);

      expect(dateData.emojiName).toBe('');
      expect(dateData.emojiUrl).toBe('');
      expect(clickResult).toEqual({ oldEmojiName: activeEmojiDetails.emojiName, newEmojiName: null });
    });

     test('should correctly update emoji when old one was empty and new one is applied', () => {
      const { result } = renderHook(() => useCalendarState());
      let clickResult;
      act(() => {
        // Date is initially empty
        clickResult = result.current.handleDateClick(testDateId, testMonth, activeEmojiDetails);
      });
      expect(clickResult.oldEmojiName).toBe(''); // initialMonthsList has empty emojiName
      expect(clickResult.newEmojiName).toBe(activeEmojiDetails.emojiName);
    });
  });
});
