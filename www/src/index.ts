import { div, Html, li, scene, text, ul } from "./vdom";

interface ITodo {
  name: string;
  completed: boolean;
}

const todoView: Html = (todos: ITodo[]): INode =>
  ul(
    { id: "todo-list" },
    todos.map(
      (next: ITodo): INode => li({ class: "todo-item", click: (e: Event) => e.target.hidden = true }, [
        `${next.name} ${next.completed ? " (done)" : " (incomplete)"}`])
    )
  );

let rootView = todoView([
    { name: "Do stuff", completed: false }
    { name: "Do some other stuff", completed: true }
    { name: "Do stuff", completed: false }
    { name: "Do stuff", completed: false }
    { name: "Do stuff", completed: false }
    { name: "Do stuff", completed: false }
    { name: "Do some other stuff", completed: true }
    { name: "Do some other stuff", completed: true }
    { name: "Do some other stuff", completed: true }
    { name: "Do some other stuff", completed: true }
]);

const scheduler = scene(rootView, document.body);

rootView = todoView([
    { name: "Do stuff", completed: false }
    { name: "Do some other stuff", completed: true }
]);

scheduler(rootView));
