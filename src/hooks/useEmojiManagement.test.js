import { renderHook, act } from '@testing-library/react-hooks';
import useEmojiManagement, { emojisList as staticEmojisList } from './useEmojiManagement';

describe('useEmojiManagement Hook', () => {
  test('should initialize with correct initial state', () => {
    const { result } = renderHook(() => useEmojiManagement());

    // Test emojisListWithCounts
    const expectedEmojisListWithCounts = staticEmojisList.map(emoji => ({ ...emoji, count: 0 }));
    expect(result.current.emojisListWithCounts).toEqual(expectedEmojisListWithCounts);

    // Test activeEmojiId, activeEmojiName, activeEmojiUrl
    expect(result.current.activeEmojiId).toBe(staticEmojisList[0].id);
    expect(result.current.activeEmojiName).toBe(staticEmojisList[0].emojiName);
    expect(result.current.activeEmojiUrl).toBe(staticEmojisList[0].emojiUrl);

    // Test emojisList (base)
    expect(result.current.emojisList).toEqual(staticEmojisList);
  });

  test('handleEmojiClick should update active emoji details', () => {
    const { result } = renderHook(() => useEmojiManagement());
    const secondEmoji = staticEmojisList[1];

    act(() => {
      result.current.handleEmojiClick(secondEmoji.id);
    });

    expect(result.current.activeEmojiId).toBe(secondEmoji.id);
    expect(result.current.activeEmojiName).toBe(secondEmoji.emojiName);
    expect(result.current.activeEmojiUrl).toBe(secondEmoji.emojiUrl);
  });

  describe('handleEmojiNameChange', () => {
    test('should update active emoji details for a valid name', () => {
      const { result } = renderHook(() => useEmojiManagement());
      const thirdEmoji = staticEmojisList[2];

      act(() => {
        result.current.handleEmojiNameChange(thirdEmoji.emojiName);
      });

      expect(result.current.activeEmojiId).toBe(thirdEmoji.id);
      expect(result.current.activeEmojiName).toBe(thirdEmoji.emojiName);
      expect(result.current.activeEmojiUrl).toBe(thirdEmoji.emojiUrl);
    });

    test('should not update active emoji for an invalid name', () => {
      const { result } = renderHook(() => useEmojiManagement());
      const initialActiveId = result.current.activeEmojiId;
      const initialActiveName = result.current.activeEmojiName;
      const initialActiveUrl = result.current.activeEmojiUrl;

      act(() => {
        result.current.handleEmojiNameChange('NonExistentEmojiName');
      });

      expect(result.current.activeEmojiId).toBe(initialActiveId);
      expect(result.current.activeEmojiName).toBe(initialActiveName);
      expect(result.current.activeEmojiUrl).toBe(initialActiveUrl);
    });
  });

  describe('updateEmojiCounts', () => {
    test('should increment count for newEmojiName', () => {
      const { result } = renderHook(() => useEmojiManagement());
      const targetEmojiName = staticEmojisList[0].emojiName;

      act(() => {
        result.current.updateEmojiCounts({ oldEmojiName: null, newEmojiName: targetEmojiName });
      });
      
      const targetEmoji = result.current.emojisListWithCounts.find(e => e.emojiName === targetEmojiName);
      expect(targetEmoji.count).toBe(1);
    });

    test('should decrement count for oldEmojiName', () => {
      const { result } = renderHook(() => useEmojiManagement());
      const targetEmojiName = staticEmojisList[1].emojiName;

      // First increment to 1
      act(() => {
        result.current.updateEmojiCounts({ oldEmojiName: null, newEmojiName: targetEmojiName });
      });
      let targetEmoji = result.current.emojisListWithCounts.find(e => e.emojiName === targetEmojiName);
      expect(targetEmoji.count).toBe(1);
      
      // Then decrement
      act(() => {
        result.current.updateEmojiCounts({ oldEmojiName: targetEmojiName, newEmojiName: null });
      });
      targetEmoji = result.current.emojisListWithCounts.find(e => e.emojiName === targetEmojiName);
      expect(targetEmoji.count).toBe(0);
    });

    test('should decrement old and increment new for change', () => {
      const { result } = renderHook(() => useEmojiManagement());
      const oldEmojiName = staticEmojisList[0].emojiName;
      const newEmojiName = staticEmojisList[1].emojiName;

      // Increment oldEmoji to 1
      act(() => {
        result.current.updateEmojiCounts({ oldEmojiName: null, newEmojiName: oldEmojiName });
      });

      act(() => {
        result.current.updateEmojiCounts({ oldEmojiName, newEmojiName });
      });

      const oldEmoji = result.current.emojisListWithCounts.find(e => e.emojiName === oldEmojiName);
      const newEmoji = result.current.emojisListWithCounts.find(e => e.emojiName === newEmojiName);
      expect(oldEmoji.count).toBe(0);
      expect(newEmoji.count).toBe(1);
    });

    test('should not decrement count below zero', () => {
      const { result } = renderHook(() => useEmojiManagement());
      const targetEmojiName = staticEmojisList[2].emojiName;
      
      // Attempt to decrement without prior increment
      act(() => {
        result.current.updateEmojiCounts({ oldEmojiName: targetEmojiName, newEmojiName: null });
      });
      
      const targetEmoji = result.current.emojisListWithCounts.find(e => e.emojiName === targetEmojiName);
      expect(targetEmoji.count).toBe(0);
    });

     test('should handle null for oldEmojiName or newEmojiName gracefully', () => {
      const { result } = renderHook(() => useEmojiManagement());
      const initialCounts = result.current.emojisListWithCounts.map(e => e.count);

      act(() => {
        result.current.updateEmojiCounts({ oldEmojiName: null, newEmojiName: null });
      });
      result.current.emojisListWithCounts.forEach((emoji, index) => {
        expect(emoji.count).toBe(initialCounts[index]);
      });

      const targetEmojiName = staticEmojisList[0].emojiName;
      act(() => {
        result.current.updateEmojiCounts({ oldEmojiName: targetEmojiName, newEmojiName: targetEmojiName });
      });
       const targetEmoji = result.current.emojisListWithCounts.find(e => e.emojiName === targetEmojiName);
      // Count should be 0 (decrement then increment)
      expect(targetEmoji.count).toBe(0); 
    });
  });
});
