use actix_files as fs;
use actix_web::{http, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use listenfd::ListenFd;
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};
use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};
use std::borrow::ToOwned;
use std::collections::HashMap;
use std::io;
use std::io::prelude::*;
use std::os::unix::net::UnixStream;
use std::result::Result;
use std::{error::Error, fmt};

const YGG_SOCK: &str = "/var/run/yggdrasil.sock";

#[derive(Debug)]
enum YggError {
    Io(io::Error),
    Json(serde_json::Error),
}

impl fmt::Display for YggError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            YggError::Io(ref cause) => write!(f, "I/O error: {}", cause),
            YggError::Json(ref cause) => write!(f, "JSON error: {}", cause),
        }
    }
}

impl Error for YggError {
    fn description(&self) -> &str {
        match *self {
            YggError::Io(ref cause) => cause.description(),
            YggError::Json(ref cause) => cause.description(),
        }
    }

    fn cause(&self) -> Option<&dyn Error> {
        match *self {
            YggError::Io(ref cause) => Some(cause),
            YggError::Json(ref cause) => Some(cause),
        }
    }
}

impl From<io::Error> for YggError {
    fn from(cause: io::Error) -> YggError {
        return YggError::Io(cause);
    }
}

impl From<serde_json::Error> for YggError {
    fn from(cause: serde_json::Error) -> YggError {
        return YggError::Json(cause);
    }
}

#[derive(Deserialize)]
struct PeerForm {
    //uri: String,
}

#[derive(Serialize, Deserialize)]
struct YggRequest {
    request: String,
}

#[derive(Serialize, Deserialize)]
struct YggPeers {
    peers: HashMap<String, YggPeer>,
}

#[derive(Serialize, Deserialize)]
struct YggPeer {
    box_pub_key: String,
    bytes_recvd: u64,
    bytes_sent: u64,
    endpoint: String,
    port: u16,
    proto: String,
    uptime: u64,
}

#[derive(Serialize, Deserialize)]
struct YggResponse<T> {
    response: T,
    status: String,
}

fn yggdrasil_send<T>(req: YggRequest) -> Result<T, YggError>
where
    T: DeserializeOwned,
{
    let mut stream = UnixStream::connect(YGG_SOCK)?;

    serde_json::to_writer(&stream, &req).map_err(YggError::from)?;

    let mut data = String::new();
    stream.read_to_string(&mut data)?;

    let result: YggResponse<T> = serde_json::from_str(&data.to_owned())?;

    return Ok(result.response);
}

fn yggdrasil_get_peers() -> Result<YggPeers, YggError> {
    let get_peers = YggRequest {
        request: "getPeers".to_owned(),
    };

    return yggdrasil_send(get_peers);
}

fn dht_get(_req: HttpRequest) -> impl Responder {
    HttpResponse::new(http::StatusCode::NOT_IMPLEMENTED)
}

fn peers_get(_req: HttpRequest) -> HttpResponse {
    let response = yggdrasil_get_peers();
    match response {
        Ok(r) => HttpResponse::Ok().json(r.peers),
        Err(e) => HttpResponse::from_error(actix_web::error::ErrorInternalServerError(e)),
    }
}

fn sessions_get(_req: HttpRequest) -> HttpResponse {
    HttpResponse::new(http::StatusCode::NOT_IMPLEMENTED)
}

fn switch_peers_get(_req: HttpRequest) -> HttpResponse {
    HttpResponse::new(http::StatusCode::NOT_IMPLEMENTED)
}

fn tun_tap_get(_req: HttpRequest) -> HttpResponse {
    HttpResponse::new(http::StatusCode::NOT_IMPLEMENTED)
}

fn peer_add(_form: web::Form<PeerForm>) -> HttpResponse {
    HttpResponse::new(http::StatusCode::NOT_IMPLEMENTED)
}

fn peer_remove(_req: HttpRequest) -> HttpResponse {
    HttpResponse::new(http::StatusCode::NOT_IMPLEMENTED)
}

fn main() {
    let mut ssl_acceptor = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
    ssl_acceptor
        .set_private_key_file("key.pem", SslFiletype::PEM)
        .unwrap();
    ssl_acceptor.set_certificate_chain_file("cert.pem").unwrap();

    let mut listenfd = ListenFd::from_env();
    let mut server = HttpServer::new(|| {
        App::new()
            .route("/dht", web::get().to(dht_get))
            .route("/peers", web::get().to(peers_get))
            .route("/switch_peers", web::get().to(switch_peers_get))
            .route("/tun_tap", web::get().to(tun_tap_get))
            .route("/sessions", web::get().to(sessions_get))
            .route("/peer", web::post().to(peer_add))
            .route("/peer", web::delete().to(peer_remove))
            .service(fs::Files::new("/", "./www/dist").index_file("index.html"))
    });

    server = if let Some(l) = listenfd.take_tcp_listener(0).unwrap() {
        server.listen_ssl(l, ssl_acceptor).unwrap()
    } else {
        server.bind_ssl("[::]:8088", ssl_acceptor).unwrap()
    };

    server.run().unwrap();
}
