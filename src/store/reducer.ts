import { Todo, TodoStatus } from "../models/todo";
import {
  AppActions,
  CREATE_TODO,
  DELETE_ALL_TODOS,
  DELETE_TODO,
  DOUBLE_CLICK_LINE_INPUT,
  SET_TODO,
  TOGGLE_ALL_TODOS,
  UPDATE_CONTENT_TODO,
  UPDATE_TODO_STATUS,
} from "./actions";

export interface AppState {
  todos: Array<Todo>;
  isShowingInput: boolean;
}

export const initialState: AppState = {
  todos: [],
  isShowingInput: true,
};

function reducer(state: AppState, action: AppActions): AppState {
  switch (action.type) {
    case CREATE_TODO:
      // remove duplicate
      let newState = [...state.todos];
      newState.push(action.payload);
      newState.filter((value, index, self) => self.indexOf(value) === index);
      return {
        ...state,
        todos: newState,
      };

    // case SET_TODO:
    //   let newState1 = [...state.todos];
    //   newState1.push(action.payload);
    //   newState1.filter((value, index, self) => self.indexOf(value) === index);
    //   return {
    //     ...state,
    //     todos: newState1,
    //   };

    case UPDATE_TODO_STATUS:
      const index2 = state.todos.findIndex(
        (todo) => todo.id === action.payload.todoId
      );
      let newStateStatus = [...state.todos];

      newStateStatus[index2].status = action.payload.checked
        ? TodoStatus.COMPLETED
        : TodoStatus.ACTIVE;
      return {
        ...state,
        todos: newStateStatus,
      };

    case TOGGLE_ALL_TODOS:
      const tempTodos = state.todos.map((e) => {
        return {
          ...e,
          status: action.payload ? TodoStatus.COMPLETED : TodoStatus.ACTIVE,
        };
      });

      return {
        ...state,
        todos: tempTodos,
      };

    case DELETE_TODO:
      // rewrite delete item by filter function
      const index1 = state.todos.filter((todo) => todo.id !== action.payload);
      return {
        ...state,
        todos: index1,
      };

    case DELETE_ALL_TODOS:
      return {
        ...state,
        todos: [],
      };

    // update content todo by doubleclick
    case UPDATE_CONTENT_TODO:
      const index3 = state.todos.findIndex(
        (todo) => todo.id === action.payload.todoId
      );
      let newStateContent = [...state.todos];
      newStateContent[index3].content = action.payload.valueInput;
      return {
        ...state,
        todos: newStateContent,
      };

    case DOUBLE_CLICK_LINE_INPUT:
      for (let index = 0; index < state.todos.length; index++) {
        if (state.todos[index].id === action.payload.todoId) {
          return {
            ...state,
            isShowingInput: false,
          };
        }
      }
      return {
        ...state,
      };

    default:
      return state;
  }
}

export default reducer;
