module Page exposing (Details, view)

import Browser exposing (Document)
import Html exposing (..)
import Html.Attributes exposing (..)


type alias Details msg =
    { title : String
    , content : Html msg
    }


view : Details msg -> Document msg
view { title, content } =
    { title = title
    , body = viewHeader :: content :: [ viewFooter ]
    }


viewHeader : Html msg
viewHeader =
    h1 [] [ text "Meshnode" ]


viewFooter : Html msg
viewFooter =
    h1 [] [ text "Footer" ]
