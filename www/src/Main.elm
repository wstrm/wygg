module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Dict
import Html
import Page
import Page.Map as Map
import Page.Node as Node
import Page.NotFound as NotFound
import Page.Peers as Peers
import Url
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s, top)



-- MAIN


main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = UrlRequest
        , onUrlChange = UrlChanged
        }



-- MODEL


type alias Model =
    { key : Nav.Key
    , page : Page
    }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    ( Model key url, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


type Page
    = NotFound
    | Node Node.Model
    | Peers Peers.Model
    | Map Map.Model


view : Model -> Browser.Document
view model =
    case model.page of
        NotFound ->
            Page.view NotFound.view

        Node ->
            Page.view Node.view

        Peers ->
            Page.view Peers.view

        Map ->
            Page.view Map.view



-- UPDATE


type Msg
    = UrlRequest Browser.UrlRequest
    | UrlChanged Url.Url


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        UrlRequest urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Nav.pushUrl model.key (Url.toString url)
                    )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        UrlChanged url ->
            router url model



-- ROUTER


type Route
    = Node
    | Peers
    | Map


router : Url.Url -> Model -> ( Mode, Cmd Msg )
router =
    let
        route : Parser a b -> Route -> Parser (b -> c) c
        route parser route =
            Parser.map route parser

        parser =
            oneOf
                [ route top Node
                , route (s "peers") Peers
                , route (s "map") Map
                ]
    in
    case Parser.parse parser url of
        Just endpoint ->
            endpoint

        Nothing ->
            NotFound
