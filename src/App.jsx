import React, { useReducer, useContext, useEffect } from "react";
import "./App.css";

const appReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return [
        ...state,
        {
          id: Date.now(),
          text: "",
          completed: false
        }
      ];
    case "delete":
      return state.filter(item => item.id !== action.id);
    case "complete":
      return state.map(item => {
        if (item.id === action.id) {
          return {
            ...item,
            completed: !item.completed
          };
        } else {
          return item;
        }
      });
    case "reset":
      return action.todoList;
    default:
      return state;
  }
};

const Context = React.createContext();

const App = () => {
  const [state, dispatch] = useReducer(
    appReducer,
    [] // *second argument is initial returning value of this reducer
  );

  useEffect(() => {
    console.log("trigger 1");

    const rawData = JSON.parse(localStorage.getItem("todos"));
    dispatch({ type: "reset", todoList: rawData });
  }, []);

  useEffect(() => {
    console.log("trigger 2");

    localStorage.setItem("todos", JSON.stringify(state));
  }, [state]);

  return (
    <Context.Provider value={dispatch}>
      <div className="App">
        <header>React Todo App</header>
        <main>
          <button
            onClick={() => {
              dispatch({ type: "add" });
            }}
          >
            add
          </button>

          <TodoList items={state} />
        </main>
      </div>
    </Context.Provider>
  );
};

const TodoList = ({ items }) => {
  return (
    <div className="todo-list">
      {items.map(item => {
        return <TodoItem key={item.id} {...item} />;
      })}
    </div>
  );
};

const TodoItem = ({ id, text, completed }) => {
  const dispatch = useContext(Context);
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => {
          dispatch({ type: "complete", id });
        }}
      />
      <input type="text" defaultValue={text} />
      <button
        className="small"
        onClick={() => {
          dispatch({ type: "delete", id });
        }}
      >
        delete
      </button>
    </div>
  );
};

export default App;
