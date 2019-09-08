import { div, Html, li, scene, text, ul } from "./vdom";

/*
interface ITodo {
  name: string;
  completed: boolean;
}

const view: Html = (todos: ITodo[]): INode =>
  ul(
    { id: "todo-list" },
    todos.map(
      (next: ITodo): INode => li({ className: "todo-item" }, [
        `${next.name} ${next.completed ? " (done)" : " (incomplete)"}`])
    )
  );

scene(
  view([
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
  ]),
  document.body
);
 */

const view = div({}, ["Hello world!"]);
const scheduler = scene(view, document.body);

scheduler(div({ id: "foo" }, ["Virtual!"]));
