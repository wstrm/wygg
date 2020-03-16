wygg ![Rust](https://github.com/wstrm/wygg/workflows/Rust/badge.svg) ![Yarn](https://github.com/wstrm/wygg/workflows/Yarn/badge.svg)
====
Implementing an [Yggdrasil](https://github.com/yggdrasil-network/yggdrasil-go)
administration web interface and at the same time experimenting with a vanilla
TypeScript SPA (Single Page Application) and a Rust web server.

## Workflow
First, make sure Yggdrasil is up and running.

Then, in one terminal:
```bash
cd www
yarn watch
```

And in another one:
```bash
cargo install cargo-watch  # if you haven't installed it already.
cargo watch -x run
```

And you're good to go!
