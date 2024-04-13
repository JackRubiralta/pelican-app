import React, { useRef } from "react";
import { View, Text, Animated, StyleSheet, RefreshControl } from "react-native";
import NewsSection from "./NewsSection";
import SectionSeparator from "./SectionSeparator";
import { theme } from "../theme";

const ArticleList = ({
  articles,
  refreshing,
  onRefresh,
  scrollY,
  headerHeight,
}) => {
  const flatListRef = useRef(null);

  if (!articles || articles.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text>Can't connect to server. Please try again later.</Text>
      </View>
    );
  }

  const sections = Object.keys(articles);

  return (
    <Animated.FlatList
      ref={flatListRef}
      scrollToOverflowEnabled={true}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      data={sections}
      keyExtractor={(item, index) => item + index.toString()}
      renderItem={({ item, index }) => (
        <View>
          {index === 0 && <View style={{ height: theme.spacing.medium }} />}

          {item !== "search" && (
            <SectionSeparator
              sectionName={item}
              style={
                index === 0 ? { marginTop: 0 } : { marginTop: theme.spacing.medium }
              }
            />
          )}

          <NewsSection sectionTitle={item} articles={articles[item]} />
          {index === sections.length - 1 && (
            <View style={{ height: theme.spacing.medium }} />
          )}
        </View>
      )}
      contentContainerStyle={{
        paddingTop: headerHeight,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={headerHeight}
          />
        ) : null
      }
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
          useNativeDriver: true,
          listener: event => {
            const offsetY = event.nativeEvent.contentOffset.y;
            if (offsetY < 0) {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
            }
          },
        }
      )}
      scrollEventThrottle={16}
    />
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 0,
  },
});

export default ArticleList;
