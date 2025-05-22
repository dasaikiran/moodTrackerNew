import { renderHook, act } from '@testing-library/react-hooks';
import useReportGenerator from './useReportGenerator';

// Mock data
const mockBaseEmojis = [
  { id: 'e1', emojiName: 'Happy', emojiUrl: 'happy.png' },
  { id: 'e2', emojiName: 'Sad', emojiUrl: 'sad.png' },
  { id: 'e3', emojiName: 'Neutral', emojiUrl: 'neutral.png' },
];

const mockCalendarDataMonth1 = {
  month: 1,
  monthName: 'January',
  dates: [
    { id: 'd1', date: '01', emojiName: 'Happy', emojiUrl: 'happy.png' },
    { id: 'd2', date: '02', emojiName: 'Happy', emojiUrl: 'happy.png' },
    { id: 'd3', date: '03', emojiName: 'Sad', emojiUrl: 'sad.png' },
    { id: 'd4', date: '04', emojiName: '', emojiUrl: '' },
  ],
};

const mockCalendarDataMonth2 = {
  month: 2,
  monthName: 'February',
  dates: [
    { id: 'd5', date: '01', emojiName: 'Sad', emojiUrl: 'sad.png' },
    { id: 'd6', date: '02', emojiName: 'Sad', emojiUrl: 'sad.png' },
    { id: 'd7', date: '03', emojiName: 'Sad', emojiUrl: 'sad.png' },
    { id: 'd8', date: '04', emojiName: 'Neutral', emojiUrl: 'neutral.png' },
  ],
};

const mockCalendarDataMonth3Empty = {
    month: 3,
    monthName: 'March',
    dates: [
        { id: 'd9', date: '01', emojiName: '', emojiUrl: '' },
        { id: 'd10', date: '02', emojiName: '', emojiUrl: '' },
    ]
}


const initialMockCalendarData = [mockCalendarDataMonth1, mockCalendarDataMonth2, mockCalendarDataMonth3Empty];

describe('useReportGenerator Hook', () => {
  test('should initialize with correct initial state (January)', () => {
    const { result } = renderHook(() => useReportGenerator(initialMockCalendarData, mockBaseEmojis));

    expect(result.current.reportMonth).toBe(1);
    expect(result.current.monthlyReportData).toEqual([
      { id: 'e1', emojiName: 'Happy', emojiUrl: 'happy.png', count: 2 },
      { id: 'e2', emojiName: 'Sad', emojiUrl: 'sad.png', count: 1 },
      { id: 'e3', emojiName: 'Neutral', emojiUrl: 'neutral.png', count: 0 },
    ]);
  });

  test('handleReportMonthChange should update reportMonth and recalculate monthlyReportData', () => {
    const { result } = renderHook(() => useReportGenerator(initialMockCalendarData, mockBaseEmojis));

    act(() => {
      result.current.handleReportMonthChange({ target: { value: '2' } });
    });

    expect(result.current.reportMonth).toBe(2);
    expect(result.current.monthlyReportData).toEqual([
      { id: 'e1', emojiName: 'Happy', emojiUrl: 'happy.png', count: 0 },
      { id: 'e2', emojiName: 'Sad', emojiUrl: 'sad.png', count: 3 },
      { id: 'e3', emojiName: 'Neutral', emojiUrl: 'neutral.png', count: 1 },
    ]);
  });

  test('monthlyReportData should correctly count emojis for a month with no specific emojis recorded', () => {
     const { result } = renderHook(() => useReportGenerator(initialMockCalendarData, mockBaseEmojis));
    act(() => {
      result.current.handleReportMonthChange({ target: { value: '3' } }); // March, empty emojis
    });
     expect(result.current.reportMonth).toBe(3);
    expect(result.current.monthlyReportData).toEqual([
      { id: 'e1', emojiName: 'Happy', emojiUrl: 'happy.png', count: 0 },
      { id: 'e2', emojiName: 'Sad', emojiUrl: 'sad.png', count: 0 },
      { id: 'e3', emojiName: 'Neutral', emojiUrl: 'neutral.png', count: 0 },
    ]);
  });
  
  test('monthlyReportData should return 0 counts if month data is missing', () => {
    const { result } = renderHook(() => useReportGenerator(initialMockCalendarData, mockBaseEmojis));
    act(() => {
      result.current.handleReportMonthChange({ target: { value: '4' } }); // Month 4 does not exist
    });
    expect(result.current.reportMonth).toBe(4);
    expect(result.current.monthlyReportData).toEqual([
      { id: 'e1', emojiName: 'Happy', emojiUrl: 'happy.png', count: 0 },
      { id: 'e2', emojiName: 'Sad', emojiUrl: 'sad.png', count: 0 },
      { id: 'e3', emojiName: 'Neutral', emojiUrl: 'neutral.png', count: 0 },
    ]);
  });

  test('monthlyReportData should recalculate if calendarData prop changes', () => {
    const { result, rerender } = renderHook(
      ({ calendarData, baseEmojis }) => useReportGenerator(calendarData, baseEmojis),
      { initialProps: { calendarData: initialMockCalendarData, baseEmojis: mockBaseEmojis } }
    );

    expect(result.current.monthlyReportData[0].count).toBe(2); // Initial Happy count for Jan

    const updatedCalendarData = [
      {
        ...mockCalendarDataMonth1,
        dates: [ // Fewer happy emojis
          { id: 'd1', date: '01', emojiName: 'Happy', emojiUrl: 'happy.png' },
          { id: 'd4', date: '04', emojiName: '', emojiUrl: '' },
        ]
      },
       mockCalendarDataMonth2,
       mockCalendarDataMonth3Empty
    ];
    
    rerender({ calendarData: updatedCalendarData, baseEmojis: mockBaseEmojis });
    
    expect(result.current.monthlyReportData[0].count).toBe(1); // Updated Happy count for Jan
  });

  test('monthlyReportData should recalculate if baseEmojis prop changes', () => {
    const { result, rerender } = renderHook(
      ({ calendarData, baseEmojis }) => useReportGenerator(calendarData, baseEmojis),
      { initialProps: { calendarData: initialMockCalendarData, baseEmojis: mockBaseEmojis } }
    );
    
    // Initial state for Jan with 3 base emojis
    expect(result.current.monthlyReportData.length).toBe(3);

    const newBaseEmojis = [
      { id: 'e1', emojiName: 'Happy', emojiUrl: 'happy.png' },
      // 'Sad' and 'Neutral' are removed
    ];
    
    rerender({ calendarData: initialMockCalendarData, baseEmojis: newBaseEmojis });
    
    expect(result.current.monthlyReportData.length).toBe(1);
    expect(result.current.monthlyReportData[0].emojiName).toBe('Happy');
    expect(result.current.monthlyReportData[0].count).toBe(2); // Happy count for Jan
  });

   test('should return empty array or baseEmojis with 0 counts if inputs are not ready', () => {
    const { result: result1 } = renderHook(() => useReportGenerator(null, null));
    expect(result1.current.monthlyReportData).toEqual([]);

    const { result: result2 } = renderHook(() => useReportGenerator([], []));
    expect(result2.current.monthlyReportData).toEqual([]);
    
    const { result: result3 } = renderHook(() => useReportGenerator(initialMockCalendarData, []));
    expect(result3.current.monthlyReportData).toEqual([]);

    const { result: result4 } = renderHook(() => useReportGenerator([], mockBaseEmojis));
     expect(result4.current.monthlyReportData).toEqual([
      { id: 'e1', emojiName: 'Happy', emojiUrl: 'happy.png', count: 0 },
      { id: 'e2', emojiName: 'Sad', emojiUrl: 'sad.png', count: 0 },
      { id: 'e3', emojiName: 'Neutral', emojiUrl: 'neutral.png', count: 0 },
    ]);
  });
});
