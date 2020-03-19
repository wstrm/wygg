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

## Packaging

#### Raspberry Pi 2

These instructions probably only work on Gentoo.

Prepare an ARMv7 (Musl) toolchain for cross compiling:

```bash
(root) crossdev --stable -t armv7-unknown-linux-musleabihf
```

Setup Cargo for the toolchain:

```bash
mkdir .cargo
cat >> .cargo/config << EOF
[target.armv7-unknown-linux-musleabihf]
linker = "armv7-unknown-linux-musleabihf-gcc"
EOF
```

Create a static release binary of the web server:

```bash
PKG_CONFIG_ALLOW_CROSS=1 \
CC=armv7-unknown-linux-musleabihf-gcc \
cargo build --release --target armv7-unknown-linux-musleabihf
```

Enter the `www/` directory and build the web app:

```bash
cd www/
yarn build
cd -
```

Package it all into the same directory:

```
mkdir -p wygg-release/www && cd wygg-release
cp -r ../www/dist www/.
cp ../target/armv7-unknown-linux-musleabihf/release/wygg .
```

Generate a self-signed certificate:

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

Done!
