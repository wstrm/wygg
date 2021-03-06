mod yggdrasil;

use actix_files as fs;
use actix_web::{http, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use listenfd::ListenFd;
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};
use serde::Deserialize;

#[derive(Deserialize)]
struct PeerForm {
    //uri: String,
}

fn dht_get(_req: HttpRequest) -> impl Responder {
    let response = yggdrasil::get_dht();
    match response {
        Ok(r) => HttpResponse::Ok().json(r.dht),
        Err(e) => HttpResponse::from_error(actix_web::error::ErrorInternalServerError(e)),
    }
}

fn peers_get(_req: HttpRequest) -> HttpResponse {
    let response = yggdrasil::get_peers();
    match response {
        Ok(r) => HttpResponse::Ok().json(r.peers),
        Err(e) => HttpResponse::from_error(actix_web::error::ErrorInternalServerError(e)),
    }
}

fn local_get(_req: HttpRequest) -> HttpResponse {
    let response = yggdrasil::get_local();
    match response {
        Ok(r) => HttpResponse::Ok().json(r.local),
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
    let listen_address = "[::]:8088";

    let mut ssl_acceptor = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
    ssl_acceptor
        .set_private_key_file("key.pem", SslFiletype::PEM)
        .unwrap();
    ssl_acceptor.set_certificate_chain_file("cert.pem").unwrap();

    let mut listen_fd = ListenFd::from_env();
    let mut server = HttpServer::new(|| {
        App::new()
            .route("/dht", web::get().to(dht_get))
            .route("/peers", web::get().to(peers_get))
            .route("/local", web::get().to(local_get))
            .route("/switch_peers", web::get().to(switch_peers_get))
            .route("/tun_tap", web::get().to(tun_tap_get))
            .route("/sessions", web::get().to(sessions_get))
            .route("/peer", web::post().to(peer_add))
            .route("/peer", web::delete().to(peer_remove))
            .service(fs::Files::new("/", "./www/dist").index_file("index.html"))
    });

    println!("Listening on: https://{}", listen_address);

    server = if let Some(l) = listen_fd.take_tcp_listener(0).unwrap() {
        server.listen_ssl(l, ssl_acceptor).unwrap()
    } else {
        server.bind_ssl(listen_address, ssl_acceptor).unwrap()
    };

    server.run().unwrap();
}
