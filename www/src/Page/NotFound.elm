module Page.NotFound exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import Page exposing (Details)
import Session exposing (Session)
import Url


view : Details msg
view =
    { title = "Not Found"
    , content =
        p []
            [ text "Not Found" ]
    }
