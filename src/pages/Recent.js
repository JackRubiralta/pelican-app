import React from 'react';
import ArticleListPage from './ArticleListPage'; // Adjust the import path as necessary
import { fetchCurrentIssue } from '../API'; // Adjust the import path as necessary
import Header from "../components/Header"; // Adjust the import path as necessary

const Recent = () => {
  const headerComponent = <Header title="Recent" />; // Example, adjust props as necessary
  return (
    <ArticleListPage
      fetchArticlesFunction={fetchCurrentIssue}
      pageTitle="Recent"
      headerComponent={headerComponent} // Pass the instantiated Header component
    />
  );
};

export default Recent;
