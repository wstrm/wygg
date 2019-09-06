module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Dict
import Html
import Page
import Page.Blank as Blank
import Page.Node as Node
import Page.NotFound as NotFound
import Page.Peers as Peers
import Route exposing (Route, fromUrl)
import Session exposing (Session, fromKey)
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


type Model
    = Empty Session
    | NotFound Session
    | Peers Peers.Model
    | Node Node.Model


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    router (Route.fromUrl url) (Empty (Session.fromKey key))



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    case model of
        Peers m ->
            Page.view (Peers.view m)

        Node m ->
            Page.view (Node.view m)

        Empty _ ->
            Page.view Blank.view

        NotFound _ ->
            Page.view NotFound.view


type Msg
    = UrlRequest Browser.UrlRequest
    | UrlChanged Url.Url
    | PeersMsg Peers.Msg
    | NodeMsg Node.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model ) of
        ( UrlRequest urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Nav.pushUrl (Session.navKey (toSession model)) (Url.toString url)
                    )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ( UrlChanged url, _ ) ->
            router (Route.fromUrl url) model

        ( NodeMsg msg, Node m ) ->
            Node.update msg m |> updateWith Node NodeMsg model

        ( PeersMsg msg, Peers m ) ->
            Peers.update msg m |> updateWith Peers PeersMsg model

        _ ->
            ( model, Cmd.none )


toSession page =
    case page of
        Empty session ->
            session

        NotFound session ->
            session

        Node model ->
            model.session

        Peers model ->
            model.session


updateWith : (subModel -> Model) -> (subMsg -> Msg) -> Model -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toModel toMsg model ( subModel, subCmd ) =
    ( toModel subModel
    , Cmd.map toMsg subCmd
    )


router : Maybe Route -> Model -> ( Model, Cmd Msg )
router route model =
    let
        session =
            toSession model
    in
    case route of
        Nothing ->
            ( NotFound session, Cmd.none )

        Just Route.Node ->
            Node.init session |> updateWith Node NodeMsg model

        Just Route.Peers ->
            Peers.init session |> updateWith Peers PeersMsg model
