import React from 'react';
import ArticleListPage from './ArticleListPage'; // Adjust the import path as necessary
import { fetchAthleticsArticles } from '../API'; // Adjust the import path as necessary
import Header from "../components/Header"; // Adjust the import path as necessary

const Athletics = () => {
  // Instantiate the Header component, passing any props it needs.
  // For example, if your Header component accepts a title prop, you can set it to "Athletics".
  const headerComponent = <Header title="Athletics" />;

  return (
    <ArticleListPage
      fetchArticlesFunction={fetchAthleticsArticles}
      pageTitle="Athletics"
      headerComponent={headerComponent} // Pass the instantiated Header component
    />
  );
};

export default Athletics;
