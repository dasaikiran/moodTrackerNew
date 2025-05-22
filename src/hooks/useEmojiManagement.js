import { useState, useCallback, useEffect, useMemo } from 'react';

// Base list of emojis
export const emojisList = [
  {
    id: '380e6284-a454-11ec-b909-0242ac120002',
    emojiName: 'Very Happy',
    emojiUrl:
      'https://assets.ccbp.in/frontend/react-js/monthly-emojis/monthly-emojis-very-happy.png',
  },
  {
    id: '380e64f0-a454-11ec-b909-0242ac120002',
    emojiName: 'Happy',
    emojiUrl:
      'https://assets.ccbp.in/frontend/react-js/monthly-emojis/monthly-emojis-happy.png',
  },
  {
    id: '380e6626-a454-11ec-b909-0242ac120002',
    emojiName: 'Neutral',
    emojiUrl:
      'https://assets.ccbp.in/frontend/react-js/monthly-emojis/monthly-emojis-neutral.png',
  },
  {
    id: '380e6748-a454-11ec-b909-0242ac120002',
    emojiName: 'Sad',
    emojiUrl:
      'https://assets.ccbp.in/frontend/react-js/monthly-emojis/monthly-emojis-sad.png',
  },
  {
    id: '380e69c8-a454-11ec-b909-0242ac120002',
    emojiName: 'Very Sad',
    emojiUrl:
      'https://assets.ccbp.in/frontend/react-js/monthly-emojis/monthly-emojis-very-sad.png',
  },
];

const useEmojiManagement = () => {
  const [emojisListWithCounts, setEmojisListWithCounts] = useState([]);
  const [activeEmojiId, setActiveEmojiId] = useState(emojisList[0].id);

  useEffect(() => {
    // Initialize emojisListWithCounts by adding count: 0 to each base emoji
    setEmojisListWithCounts(
      emojisList.map(emoji => ({ ...emoji, count: 0 })),
    );
  }, []); // Runs once on mount

  const activeEmojiDetails = useMemo(() => {
    return emojisList.find(emoji => emoji.id === activeEmojiId);
  }, [activeEmojiId]);

  const activeEmojiName = activeEmojiDetails?.emojiName || '';
  const activeEmojiUrl = activeEmojiDetails?.emojiUrl || '';

  const handleEmojiClick = useCallback(emojiId => {
    setActiveEmojiId(emojiId);
  }, []);

  const handleEmojiNameChange = useCallback(newEmojiName => {
    const foundEmoji = emojisList.find(
      emoji => emoji.emojiName === newEmojiName,
    );
    if (foundEmoji) {
      setActiveEmojiId(foundEmoji.id);
    }
  }, []);

  const updateEmojiCounts = useCallback(({ oldEmojiName, newEmojiName }) => {
    setEmojisListWithCounts(prevList =>
      prevList.map(emoji => {
        let newCount = emoji.count;
        if (emoji.emojiName === oldEmojiName && oldEmojiName !== null) {
          newCount = Math.max(0, newCount - 1); // Ensure count doesn't go below 0
        }
        if (emoji.emojiName === newEmojiName && newEmojiName !== null) {
          newCount += 1;
        }
        return { ...emoji, count: newCount };
      }),
    );
  }, []);

  return {
    emojisListWithCounts,
    activeEmojiId,
    activeEmojiName,
    activeEmojiUrl,
    handleEmojiClick,
    handleEmojiNameChange,
    updateEmojiCounts,
    emojisList, // Exporting the base list for UI elements
  };
};

export default useEmojiManagement;
