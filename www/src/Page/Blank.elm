module Page.Blank exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import Page exposing (Details)
import Session exposing (Session)
import Url


view : Details msg
view =
    { title = "Blank"
    , content =
        p []
            [ text "Nothing here." ]
    }
