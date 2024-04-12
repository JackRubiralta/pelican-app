export const API_BASE_URL = "https://pelican-e5764ce520e2.herokuapp.com/api";

// Fetch new articles

function sortArticlesByDate(articles) {
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const fetchNewArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recent`);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
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
      throw new Error("Network response was not ok.");
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
      throw new Error("Network response was not ok.");
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
    const response = await fetch(
      `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();
    console.log(data);

    return sortArticlesByDate(data);
  } catch (error) {
    console.log(error);
    console.error(
      `Failed to fetch search results for query "${query}":`,
      error
    );
    throw error; // Rethrow so callers can handle errors.
  }
};

export const testing_issue = async () => {
  
  return {
      news: [
        {
          id: "BW6n2AC4TT",
          title: {
            text: "Unpacking Super Bowl Sunday 2024",
            size: "big",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Georgia Bussey",
          date: "2024-02-28",
          length: 3,
          image: {
            source: "/images/s.jpg",
            caption: "Super Bowl livestream at Raffini // Photographed by Jason Lee",
            show: true,
            position: "bottom",
          },
        },
        {
          id: "Qp9w3vXJtL",
          title: {
            text: "SPS Celebrates Black History Month",
            size: "medium",
          },
          summary: {
            content:
              "",
            show: false,
          },
          author: "Edie Jones",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
        {
          id: "Mt7JgZ8XlY",
          title: {
            text: "SPS Students Celebrate the Lunar New Year",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Edie Jones",
          date: "2024-02-28",
          length: 3,
          image: {
            source: "/images/h.jpg",
            caption:
              "Photographed by Vin Chutijirawong '25",
            show: true,
            position: "bottom",
          },
        },
      ],
      spotlight: [
        {
          id: "Wy4xT3F2tK",
          title: {
            text: "Two SPS Debaters Qualify for Worlds",
            size: "big",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Theo Christoffersen",
          date: "2024-02-28",
          length: 3,
          image: {
            source: "/images/1.jpg",
            caption:
              "Photographed by Temi Johnson",
            show: true,
            position: "bottom",
          },
        },
      ],
      letters: [
        {
          id: "xL8JrY2vCp",
          title: {
            text: "Letter from the Editors",
            size: "medium",
          },
          summary: {
            content:
              "",
            show: false,
          },
          author: "Danielle Choi",
          date: "2024-02-28",
          length: 1,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
      ],
      voices: [
        {
          id: "Ln7DzF8cW3",
          title: {
            text: "What is it Like Being a Teaching Fellow?",
            size: "big",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Parker Hanson",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "/images/ssa.jpg",
            caption: " Photo by Blue Han",
            show: true,
            position: "bottom",
          },
        },
        {
          id: "Km5gH2JzVQ",
          title: {
            text: "A Day in the Life: Two Days at Deerfield Academy",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Allegra Alfaro",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
       
       
        {
          id: "Y5hTz8pQW1",
          title: {
            text: "Regrets Column: Mr. Gordon and Cole Edwards",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Charles Liu",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
      ],
      styles: [
        {
          id: "X3nVz2lKd9",
          title: {
            text: "Style Column: Mr. Snead",
            size: "big",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Lidia Zur Muhlen",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "/images/snead.jpg",
            caption: "Photographed by Temi Johnson",
            show: true,
            position: "top",
          },
        },
      ],
      people: [
        {
          id: "Q6yJv9TkH4",
          title: {
            text: "Dynamic Duos: Parker Hanson and Lulu Mangriotis",
            size: "big",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Nel Peter",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "/images/duo.jpg",
            caption: "",
            show: true,
            position: "",
          },
        },
        {
          id: "R4mZq8wJX5",
          title: {
            text: "Sam 'Safety Sam' Keach",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Sebastian Brigham",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
        {
          id: "S2nXw0yPZ6",
          title: {
            text: "Teacher of the Issue: Mrs. Edwards",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Kyle Gump",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
      ],
      opinion: [
        {
          id: "T9vHj3dWZ7",
          title: {
            text: "The Post vs. Tucker's: Concord's Breakfast Debate",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Wrenn Ragsdale",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
        {
          id: "U8kIz4fXV8",
          title: {
            text: "What is the Best Type of Chapel Program?",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Wilson Xie",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
      ],
      guides: [
        {
          id: "V7jKy5gYW9",
          title: {
            text: "The Guide to a Productive and Relaxing Sunday at SPS",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Charles Liu",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
        {
          id: "W6iLz6hXU0",
          title: {
            text: "A Guide to Creating Outfits for SPS Dances",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Lucas Conrod",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
        {
          id: "X5hKy7iYV1",
          title: {
            text: "Some Favorite SPS Trails",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Helen Berger",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
      ],
      clubs: [
        {
          id: "Y4gJx8jZW2",
          title: {
            text: "Funkdefied: SPS's All-Girls Hip-Hop Dance Group",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Olivia Blanchard",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
        {
          id: "Z3fIw9kAX3",
          title: {
            text: "Introducing Yoga Club",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Mathis Riff",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
        {
          id: "A2eHx0lBY4",
          title: {
            text: "Introducing the Knitting Club",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Stella McNab",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
        {
          id: "B1dGy1mCZ5",
          title: {
            text: "Behind the Scenes of SNL",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Kevin Wu",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
        {
          id: "C0cFx2nDZ6",
          title: {
            text: "The New Faces of SNL",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "namePlaceholder",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
      ],
      misc: [],
      archives: [
        {
          id: "D9bEw3oEZ7",
          title: {
            text: "SPS Archives Column: Armour House",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "namePlaceholder",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
      ],
      theater: [
        {
          id: "E8aDv4pFY8",
          title: {
            text: "Theater Column: Guest Speaker Will Nunziata",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "namePlaceholder",
          date: "2024-02-28",
          length: 2,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
      ],
      arts: [
        {
          id: "F7zCu5qGZ9",
          title: {
            text: "SPS Comic",
            size: "medium",
          },
          summary: {
            content: "",
            show: false,
          },
          author: "Andrew Choi",
          date: "2024-02-28",
          length: 1,
          image: {
            source: "",
            caption: "",
            show: false,
            position: "",
          },
        },
      ],
    }
}
