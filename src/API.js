export const API_BASE_URL = 'https://pelican-e5764ce520e2.herokuapp.com/api';

// Fetch new articles

function sortArticlesByDate(articles) {
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}


export const fetchNewArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recent`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return data;
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
    return data;
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

