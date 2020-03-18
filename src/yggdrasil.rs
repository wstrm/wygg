use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};
use std::borrow::ToOwned;
use std::collections::HashMap;
use std::io;
use std::io::prelude::*;
use std::os::unix::net::UnixStream;
use std::result::Result;
use std::{error::Error as StdError, fmt};

const DEFAULT_SOCKET: &str = "/var/run/yggdrasil.sock";

#[derive(Debug)]
pub enum Error {
    Io(io::Error),
    Json(serde_json::Error),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Error::Io(ref cause) => write!(f, "I/O error: {}", cause),
            Error::Json(ref cause) => write!(f, "JSON error: {}", cause),
        }
    }
}

impl StdError for Error {
    fn description(&self) -> &str {
        match *self {
            Error::Io(ref cause) => cause.description(),
            Error::Json(ref cause) => cause.description(),
        }
    }

    fn cause(&self) -> Option<&dyn StdError> {
        match *self {
            Error::Io(ref cause) => Some(cause),
            Error::Json(ref cause) => Some(cause),
        }
    }
}

impl From<io::Error> for Error {
    fn from(cause: io::Error) -> Error {
        return Error::Io(cause);
    }
}

impl From<serde_json::Error> for Error {
    fn from(cause: serde_json::Error) -> Error {
        return Error::Json(cause);
    }
}

#[derive(Serialize, Deserialize)]
struct Request {
    request: String,
}

#[derive(Serialize, Deserialize)]
pub struct PeersContainer {
    pub peers: HashMap<String, PeerNode>,
}

#[derive(Serialize, Deserialize)]
pub struct PeerNode {
    pub box_pub_key: String,
    pub bytes_recvd: u64,
    pub bytes_sent: u64,
    pub endpoint: String,
    pub port: u16,
    pub proto: String,
    pub uptime: f64,
}

#[derive(Serialize, Deserialize)]
pub struct LocalContainer {
    #[serde(rename = "self")]
    pub local: HashMap<String, LocalNode>,
}

#[derive(Serialize, Deserialize)]
pub struct LocalNode {
    pub box_pub_key: String,
    pub build_name: String,
    pub build_version: String,
    pub coords: String,
    pub subnet: String,
}

#[derive(Serialize, Deserialize)]
pub struct DHTContainer {
    pub dht: HashMap<String, DHTNode>,
}

#[derive(Serialize, Deserialize)]
pub struct DHTNode {
    pub box_pub_key: String,
    pub coords: String,
    pub last_seen: f64,
}

#[derive(Serialize, Deserialize)]
struct Response<T> {
    response: T,
    status: String,
}

fn send<T>(req: Request) -> Result<T, Error>
where
    T: DeserializeOwned,
{
    let mut stream = UnixStream::connect(DEFAULT_SOCKET)?;

    serde_json::to_writer(&stream, &req).map_err(Error::from)?;

    let mut data = String::new();
    stream.read_to_string(&mut data)?;

    let result: Response<T> = serde_json::from_str(&data.to_owned())?;

    return Ok(result.response);
}

pub fn get_peers() -> Result<PeersContainer, Error> {
    let get_peers = Request {
        request: "getPeers".to_owned(),
    };

    return send(get_peers);
}

pub fn get_local() -> Result<LocalContainer, Error> {
    let get_local = Request {
        request: "getSelf".to_owned(),
    };

    return send(get_local);
}

pub fn get_dht() -> Result<DHTContainer, Error> {
    let get_dht = Request {
        request: "getDHT".to_owned(),
    };

    return send(get_dht);
}
