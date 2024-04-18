export const API_BASE_URL = "https://pelican-e5764ce520e2.herokuapp.com/api";

// Fetch new articles

function sortArticlesByDate(articles) {
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const fetchCurrentIssueNumber = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/current_issue_number`);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return data; // This will return an object like { currentIssueNumber: 10 }
  } catch (error) {
    console.error("Failed to fetch current issue number:", error);
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
    const response = await fetch(
      `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();
    console.log(data);

    return { search: sortArticlesByDate(data) };
  } catch (error) {
    console.log(error);
    console.error(
      `Failed to fetch search results for query "${query}":`,
      error
    );
    throw error; // Rethrow so callers can handle errors.
  }
};

export const fetchCurrentIssue = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/current_issue`);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data for current issue:", error);
    throw error; // Rethrow so callers can handle errors.
  }
};

export const fetchCrossword = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/current_crossword`);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data for current crossword:", error);
    throw error; // Rethrow so callers can handle errors.
  }
};

export const fetchConnections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/current_connections`);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch current connections:", error);
    throw error; // Rethrow so callers can handle errors.
  }
};
