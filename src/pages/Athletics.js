import React from "react";
import ArticleListPage from "./ArticleListPage"; // Adjust the import path as necessary
import { fetchAthleticsArticles } from "../API"; // Adjust the import path as necessary
import Header from "../components/Header"; // Adjust the import path as necessary
import { View } from "react-native-web";

const Athletics = () => {
  // Instantiate the Header component, passing any props it needs.
  // For example, if your Header component accepts a title prop, you can set it to "Athletics".
  const headerComponent = <Header title="Athletics" />;

  return (
    <View></View>
    /*
    <ArticleListPage
      fetchArticlesFunction={fetchAthleticsArticles}
      pageTitle="Athletics"
      headerComponent={headerComponent} // Pass the instantiated Header component
    />
    */
  );
};

export default Athletics;
