import React, { useEffect, useReducer, useRef, useState } from "react";

import reducer, { initialState } from "./store/reducer";
import {
  setTodos,
  createTodo,
  toggleAllTodos,
  deleteAllTodos,
  updateTodoStatus,
  deleteTodo,
  updateContentToDo,
  doubleClickLineInput,
} from "./store/actions";
import Service from "./service";
import { TodoStatus } from "./models/todo";

type EnhanceTodoStatus = TodoStatus | "COMPLETED";

const ToDoPage = () => {
  const [{ todos, isShowingInput }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const [showing, setShowing] = useState<EnhanceTodoStatus>("COMPLETED");
  const [isValueInputToggle, setIsValueInputToggle] = useState<boolean>(true);
  const [valueInput, setValueInput] = useState("");
  //const [items, setItems] = useState<any>([]);
  const inputRef = useRef<any>(null);

  // useEffect(() => {
  //   (async () => {
  //     const resp = await Service.getTodos();

  //     dispatch(setTodos(resp || []));
  //   })();
  // }, []);

  // data localstoage support for person can be stored when they refresh
  // useEffect(() => {
  //   const data = localStorage.getItem("todos");
  //   if (data) {
  //     setItems(JSON.parse(data));
  //   }
  //   if (todos.length !== 0) {
  //     localStorage.setItem("todos", JSON.stringify(todos));
  //   }
  // }, [todos]);

  const onCreateTodo = async (
    e: React.KeyboardEvent<HTMLInputElement> | { target: HTMLInputElement }
  ) => {
    const KeyboardEvent = e as React.KeyboardEvent<HTMLInputElement>;
    const { target } = e as React.FocusEvent<HTMLInputElement>;
    if (KeyboardEvent.key === "Enter") {
      // check data input cannot null
      if (inputRef.current.value !== "") {
        const resp = await Service.createTodo(inputRef.current.value);
        dispatch(createTodo(resp));
        // clear content after entering
        target.value = "";
      } else {
        alert("Please enter your todos");
      }
    }
  };

  const onUpdateTodoStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: string
  ) => {
    dispatch(updateTodoStatus(todoId, e.target.checked));
  };

  const onToggleAllTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(e.target.checked));
  };

  const updateTodoStatusNew = (bool: boolean) => {
    dispatch(toggleAllTodos(bool));
  };

  const onDeleteAllTodo = () => {
    dispatch(deleteAllTodos());
  };

  //Set deleteTodo function
  const onDeleteTodo = (todoId: string) => {
    dispatch(deleteTodo(todoId));
  };

  // delete items from array and remove item from localStorage when user click X
  // const handleDelete = (todoId: string, index: any) => {
  //   localStorage.removeItem(index);
  //   const filterItems = items.filter((todo: any) => todo.id !== todoId);
  //   setItems(filterItems);
  //   //localStorage.setItem("todos", JSON.stringify(filterItems));
  // };

  // update content by onKeyDown
  const onUpdateContentToDo = (
    e: React.KeyboardEvent<HTMLInputElement> | { target: HTMLInputElement },
    todoId: string,
    valueInput: any
  ) => {
    const KeyboardEvent = e as React.KeyboardEvent<HTMLInputElement>;
    const { target } = e as React.FocusEvent<HTMLInputElement>;
    if (KeyboardEvent.key === "Enter" || KeyboardEvent.key === "Escape") {
      setIsValueInputToggle(true);
      setValueInput("");
      KeyboardEvent.preventDefault();
      KeyboardEvent.stopPropagation();
      if (target.value !== "") {
        dispatch(updateContentToDo(todoId, valueInput));
      } else {
        alert("Please do not leave this field blank");
      }
    }
  };

  // update content by onBlur
  const onUpdateContentToDoBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    todoId: string,
    valueInput: any
  ) => {
    setIsValueInputToggle(true);
    setValueInput("");
    e.preventDefault();
    e.stopPropagation();
    if (e.target.value !== "") {
      dispatch(updateContentToDo(todoId, valueInput));
    } else {
      alert("Please do not leave this field blank");
    }
  };

  // const onDoubleClickLineToDo = (todoId: string) => {
  //   dispatch(doubleClickLineInput(todoId));
  // };

  return (
    <div className="ToDo__container">
      <h1 style={{ color: "white" }}>TO DO LIST</h1>
      <div className="Todo__creation">
        <input
          ref={inputRef}
          className="Todo__input"
          placeholder="What need to be done?"
          onKeyDown={onCreateTodo}
        />
      </div>
      <div className="ToDo__list">
        {todos.map((todo: any, index: any) => {
          console.log("todo", todo);
          return (
            <div key={index} className={index % 2 === 0 ? "Odd_bg" : "Even_bg"}>
              <div className="ToDo__item">
                <input
                  type="checkbox"
                  checked={showing === todo.status}
                  onChange={(e) => onUpdateTodoStatus(e, todo.id)}
                />
                {isValueInputToggle ? (
                  <span onDoubleClick={() => setIsValueInputToggle(false)}>
                    {todo.content}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={valueInput}
                    onChange={(e) => {
                      setValueInput(e.target.value);
                    }}
                    onKeyDown={(e) =>
                      onUpdateContentToDo(e, todo.id, valueInput)
                    }
                    onBlur={(e) =>
                      onUpdateContentToDoBlur(e, todo.id, valueInput)
                    }
                  />
                )}
                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="Todo__delete"
                >
                  X
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="Todo__toolbar">
        {todos.length > 0 ? (
          <input type="checkbox" onChange={onToggleAllTodo} />
        ) : (
          <div />
        )}
        <div className="Todo__tabs">
          {/* <button className="Action__btn">All</button> */}
          <button
            className="Action__btn"
            onClick={() => updateTodoStatusNew(false)}
          >
            Active
          </button>
          <button
            className="Complete__btn"
            onClick={() => updateTodoStatusNew(true)}
          >
            Completed
          </button>
        </div>
        <button className="Clear__btn" onClick={onDeleteAllTodo}>
          Clear all todos
        </button>
      </div>
    </div>
  );
};

export default ToDoPage;
