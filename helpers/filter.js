const filter = (array, priority) => {
  const sortedArray = (array, priority) => {
    return array.map((column) => {
      return {
        title: column.title,
        owner: column.owner,
        _id: column.id,
        cards: column.cards.filter((card) => card.priority === priority),
      };
    });
  };

  let sortedCards = null;

  switch (priority) {
    case "without":
      sortedCards = sortedArray(array, priority);
      break;

    case "low":
      sortedCards = sortedArray(array, priority);
      break;

    case "medium":
      sortedCards = sortedArray(array, priority);
      break;

    case "high":
      sortedCards = sortedArray(array, priority);
      break;

    default:
      sortedCards = array;
      break;
  }

  return sortedCards;
};

export default filter;
