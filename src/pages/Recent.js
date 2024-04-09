import React from 'react';
import ArticleListPage from './ArticleListPage'; // Adjust the import path as necessary
import { fetchNewArticles } from '../API'; // Adjust the import path as necessary

const Recent = () => {
  return <ArticleListPage fetchArticlesFunction={fetchNewArticles} pageTitle="Recent" />;
};

export default Recent;
