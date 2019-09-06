module Page.Peers exposing (Model, Msg, init, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import Page exposing (Details)
import Session exposing (Session)


type Status a
    = Loading
    | Success a
    | Failure


type alias Model =
    { session : Session
    , peers : Status Peers
    }


type alias Peer =
    { address : String
    , coord : ( Int, Int )
    }


type Peers
    = List Peer


type Msg
    = GotPeers (Result Http.Error String)


init : Session -> ( Model, Cmd Msg )
init session =
    ( { session = session
      , peers = Loading
      }
    , Http.get
        { url = "/peers"
        , expect = Http.expectString GotPeers
        }
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotPeers result ->
            case result of
                Ok peers ->
                    -- TODO
                    ( { model | peers = Failure }, Cmd.none )

                Err _ ->
                    ( { model | peers = Failure }, Cmd.none )


view : Model -> Details msg
view model =
    { title = "Peers"
    , content =
        div [ class "peers" ]
            [ p []
                [ text
                    (case model.peers of
                        Loading ->
                            "Loading peers..."

                        Success _ ->
                            "Success!"

                        Failure ->
                            "Failure :("
                    )
                ]
            ]
    }
