import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet, View, FlatList, Image, Dimensions } from "react-native";
import { AddTodo } from "../components/AddTodo/AddTodo";
import { TodoComponent } from "../components/TodoComponent/TodoComponent";
import {
  MAIN_SCREEN_PADDING_HORIZONTAL,
  REACT_THEME_COLORS,
} from "../settings";
import { TodoContext } from "../context/todo/todoContext";
import { ScreenContext } from "../context/screen/screenContext";
import { AppLoader } from "../components/UI/AppLoader";
import { AppText } from "../components/UI/AppText";
import { AppButton } from "../components/UI/AppButton";

export const MainScreen: React.FC = () => {
  const { addTodo, todos, removeTodo, loading, error, fetchTodos } = useContext(
    TodoContext
  );

  const { changeScreen } = useContext(ScreenContext);

  const width = () => {
    return Dimensions.get("window").width - MAIN_SCREEN_PADDING_HORIZONTAL * 2;
  };

  const [deviceWidth, setDeviceWidth] = useState(width());

  useEffect(() => {
    const update = () => setDeviceWidth(width());
    const subscribe = () => Dimensions.addEventListener("change", update);
    const unsubscribe = () => Dimensions.removeEventListener("change", update);

    subscribe();
    return () => unsubscribe();
  });

  const loadTodos = useCallback(async () => {
    if (fetchTodos) {
      await fetchTodos();
    }
  }, [fetchTodos]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  let content = (
    <View style={[{ width: deviceWidth }]}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoComponent
            todo={item}
            onRemove={removeTodo}
            onOpen={changeScreen}
          />
        )}
      />
    </View>
  );

  if (todos.length === 0) {
    content = (
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={require("../../assets/all-done.png")}
        />
      </View>
    );
  }

  if (loading) {
    return <AppLoader />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <AppText
          type="cabin-sketch-regular"
          style={{ color: REACT_THEME_COLORS.red, textAlign: "center" }}
        >
          {error}
        </AppText>
        <AppButton onPress={loadTodos} style={{ marginVertical: 20 }}>
          Try again
        </AppButton>
      </View>
    );
  }

  return (
    <View>
      <AddTodo onSubmit={addTodo} />
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
