export const API_BASE_URL = 'https://pelican-e5764ce520e2.herokuapp.com/api';

// Fetch new articles

function shuffleWithRecencyPreference(articles) {
  // Clone the articles array to avoid mutating the original data
  let articlesCopy = [...articles];

  // Sort articles by date to ensure recency
  articlesCopy.sort((a, b) => new Date(b.date) - new Date(a.date));

  let shuffledArticles = [];
  while (articlesCopy.length) {
    // Calculate weights, giving higher weight to more recent articles
    let totalWeight = 0;
    const weights = articlesCopy.map((_, index) => {
      const weight = Math.pow((articlesCopy.length - index) / articlesCopy.length, 2);
      totalWeight += weight;
      return weight;
    });

    // Select an article based on weights
    let randomIndex = weightedRandomIndex(weights, totalWeight);
    shuffledArticles.push(articlesCopy[randomIndex]);
    articlesCopy.splice(randomIndex, 1);
  }

  return shuffledArticles;
}

function sortArticlesByDate(articles) {
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}


function weightedRandomIndex(weights, totalWeight) {
  let threshold = Math.random() * totalWeight;
  for (let i = 0, sum = 0; i < weights.length; i++) {
    sum += weights[i];
    if (sum >= threshold) {
      return i;
    }
  }
  return -1; // Should not be reached if weights and totalWeight are calculated correctly
}


export const fetchNewArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recent`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return shuffleWithRecencyPreference(data);
  } catch (error) {
    console.error("Failed to fetch new articles:", error);
    throw error; // Rethrow so callers can handle errors.
  }
};


export const fetchCrosswordData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/crossword`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch crossword data:", error);
    throw error; // Rethrow so callers can handle errors.
  }
};

// Fetch athletics articles
export const fetchAthleticsArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sports`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return shuffleWithRecencyPreference(data);
  } catch (error) {
    console.error("Failed to fetch athletics articles:", error);
    throw error; // Rethrow so callers can handle errors.
  }
};



export const fetchArticleById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok for article ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch article with ID ${id}:`, error);
      throw error; // Rethrow so callers can handle errors.
  }
};


export const fetchSearchResults = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    console.log(data);

    return sortArticlesByDate(data);
  } catch (error) {
    console.log(error);
    console.error(`Failed to fetch search results for query "${query}":`, error);
    throw error; // Rethrow so callers can handle errors.
  }
  
};
