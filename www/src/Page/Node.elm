module Page.Node exposing (Model, Msg, init, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import Session exposing (Session)


type Status a
    = Loading
    | Success a
    | Failure


type alias Model =
    { session : Session
    , node : Status Node
    }


type alias Node =
    { address : String
    , coord : ( Int, Int )
    }


type Nodes
    = List Node


type Msg
    = GotNode (Result Http.Error String)


init : Session -> ( Model, Cmd Msg )
init session =
    ( { session = session
      , node = Loading
      }
    , Http.get
        { url = "/node"
        , expect = Http.expectString GotNode
        }
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotNode result ->
            case result of
                Ok peers ->
                    -- TODO
                    ( { model | node = Failure }, Cmd.none )

                Err _ ->
                    ( { model | node = Failure }, Cmd.none )


view : Model -> { title : String, content : Html msg }
view model =
    { title = "Node"
    , content =
        div [ class "node" ]
            [ p []
                [ text
                    (case model.node of
                        Loading ->
                            "Loading node..."

                        Success _ ->
                            "Success!"

                        Failure ->
                            "Failure :("
                    )
                ]
            ]
    }
