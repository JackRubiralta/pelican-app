import React from 'react';
import ArticleListPage from './ArticleListPage'; // Adjust the import path as necessary
import { fetchAthleticsArticles } from '../API'; // Adjust the import path as necessary

const Athletics = () => {
  return <ArticleListPage fetchArticlesFunction={fetchAthleticsArticles} pageTitle="Athletics" />;
};

export default Athletics;
