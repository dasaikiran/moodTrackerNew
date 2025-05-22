import { renderHook, act } from '@testing-library/react-hooks';
import useDaySelector, { daysList as staticDaysList } from './useDaySelector';

// Mock data for currentMonthCalendarDates
const mockMonthDates = [
  { id: 'd1', date: '01', emojiName: 'Happy', emojiUrl: 'happy.png' }, // Day: 1 % 7 = 1 (Sun)
  { id: 'd2', date: '02', emojiName: 'Sad', emojiUrl: 'sad.png' },     // Day: 2 % 7 = 2 (Mon)
  { id: 'd3', date: '03', emojiName: 'Happy', emojiUrl: 'happy.png' }, // Day: 3 % 7 = 3 (Tue)
  { id: 'd7', date: '07', emojiName: 'Happy', emojiUrl: 'happy.png' }, // Day: 7 % 7 = 0 (Sat)
  { id: 'd8', date: '08', emojiName: 'Happy', emojiUrl: 'happy.png' }, // Day: 8 % 7 = 1 (Sun)
  { id: 'd14', date: '14', emojiName: 'Neutral', emojiUrl: 'neutral.png' },// Day: 14 % 7 = 0 (Sat)
  { id: 'd15', date: '15', emojiName: 'Happy', emojiUrl: 'happy.png' }, // Day: 15 % 7 = 1 (Sun)
];

const mockActiveEmojiName = 'Happy';

describe('useDaySelector Hook', () => {
  test('should initialize with correct initial state', () => {
    const { result } = renderHook(() => useDaySelector(mockMonthDates, mockActiveEmojiName));

    expect(result.current.selectedDayNumber).toBe(staticDaysList[0].dayNumber); // Sunday (1)
    expect(result.current.daysList).toEqual(staticDaysList);
    // For Sunday (1) and 'Happy': dates '01', '08', '15' -> count 3
    expect(result.current.nameDayCount).toBe('03');
  });

  test('handleDayChange should update selectedDayNumber and recalculate nameDayCount', () => {
    const { result } = renderHook(() => useDaySelector(mockMonthDates, mockActiveEmojiName));

    act(() => {
      // Change to Saturday (dayNumber 0)
      result.current.handleDayChange({ target: { value: '0' } });
    });
    expect(result.current.selectedDayNumber).toBe(0);
    // For Saturday (0) and 'Happy': date '07' -> count 1
    expect(result.current.nameDayCount).toBe('01');

    act(() => {
      // Change to Monday (dayNumber 2)
      result.current.handleDayChange({ target: { value: '2' } });
    });
    expect(result.current.selectedDayNumber).toBe(2);
    // For Monday (2) and 'Happy': no dates -> count 0
    expect(result.current.nameDayCount).toBe('00');
  });

  test('nameDayCount should recalculate if currentMonthCalendarDates prop changes', () => {
    const initialDates = [
      { id: 'd1', date: '01', emojiName: 'Happy', emojiUrl: 'happy.png' }, // Sun
    ];
    const { result, rerender } = renderHook(
      ({ dates, emojiName }) => useDaySelector(dates, emojiName),
      { initialProps: { dates: initialDates, emojiName: 'Happy' } }
    );
    // Initial: Sunday (1), 'Happy', count 1
    expect(result.current.selectedDayNumber).toBe(1);
    expect(result.current.nameDayCount).toBe('01');

    const newDates = [
      ...initialDates,
      { id: 'd8', date: '08', emojiName: 'Happy', emojiUrl: 'happy.png' }, // Sun
      { id: 'd15', date: '15', emojiName: 'Happy', emojiUrl: 'happy.png' }, // Sun
    ];
    rerender({ dates: newDates, emojiName: 'Happy' });
    // Sunday (1), 'Happy', count 3
    expect(result.current.nameDayCount).toBe('03');
  });

  test('nameDayCount should recalculate if activeEmojiName prop changes', () => {
    const { result, rerender } = renderHook(
      ({ dates, emojiName }) => useDaySelector(dates, emojiName),
      { initialProps: { dates: mockMonthDates, emojiName: 'Happy' } }
    );
    // Initial: Sunday (1), 'Happy', count 3
    expect(result.current.selectedDayNumber).toBe(1);
    expect(result.current.nameDayCount).toBe('03');

    rerender({ dates: mockMonthDates, emojiName: 'Sad' });
    // Sunday (1), 'Sad', count 0 (date '01' is Happy, '02' is Sad but Mon)
    expect(result.current.nameDayCount).toBe('00');
    
    act(() => {
        // Change to Monday (dayNumber 2)
      result.current.handleDayChange({ target: { value: '2' } });
    });
    // Monday (2), 'Sad', count 1 (date '02')
    expect(result.current.nameDayCount).toBe('01');
  });
  
  test('nameDayCount should be "00" if currentMonthCalendarDates is empty or null', () => {
    const { result: result1 } = renderHook(() => useDaySelector([], 'Happy'));
    expect(result1.current.nameDayCount).toBe('00');

    const { result: result2 } = renderHook(() => useDaySelector(null, 'Happy'));
    expect(result2.current.nameDayCount).toBe('00');
  });

  test('nameDayCount should be "00" if activeEmojiNameProp is null or empty', () => {
    const { result: result1 } = renderHook(() => useDaySelector(mockMonthDates, null));
    expect(result1.current.nameDayCount).toBe('00');
    
    const { result: result2 } = renderHook(() => useDaySelector(mockMonthDates, ''));
    expect(result2.current.nameDayCount).toBe('00');
  });


  test('nameDayCount should correctly apply parseInt(item.date) % 7 logic', () => {
    const datesForModuloTest = [
      { id: 'd1', date: '01', emojiName: 'TestEmoji', emojiUrl: '' }, // 1 % 7 = 1 (Sun)
      { id: 'd6', date: '06', emojiName: 'TestEmoji', emojiUrl: '' }, // 6 % 7 = 6 (Fri)
      { id: 'd7', date: '07', emojiName: 'TestEmoji', emojiUrl: '' }, // 7 % 7 = 0 (Sat)
      { id: 'd8', date: '08', emojiName: 'TestEmoji', emojiUrl: '' }, // 8 % 7 = 1 (Sun)
      { id: 'd13', date: '13', emojiName: 'TestEmoji', emojiUrl: '' },// 13 % 7 = 6 (Fri)
      { id: 'd14', date: '14', emojiName: 'TestEmoji', emojiUrl: '' },// 14 % 7 = 0 (Sat)
    ];
    const { result } = renderHook(() => useDaySelector(datesForModuloTest, 'TestEmoji'));

    // Test Sunday (dayNumber 1)
    act(() => result.current.handleDayChange({ target: { value: '1' } }));
    expect(result.current.nameDayCount).toBe('02'); // Dates 01, 08

    // Test Friday (dayNumber 6)
    act(() => result.current.handleDayChange({ target: { value: '6' } }));
    expect(result.current.nameDayCount).toBe('02'); // Dates 06, 13

    // Test Saturday (dayNumber 0)
    act(() => result.current.handleDayChange({ target: { value: '0' } }));
    expect(result.current.nameDayCount).toBe('02'); // Dates 07, 14
  });
});
