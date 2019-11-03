export interface Component {
  init: () => void;
  view: () => string;
}
