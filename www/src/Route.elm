module Route exposing (Route(..), fromUrl)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as Attr
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, map, oneOf, s, string, top)


type Route
    = Node
    | Peers


parser : Parser (Route -> a) a
parser =
    oneOf
        [ map Node top
        , map Peers (s "peers")
        ]


fromUrl : Url -> Maybe Route
fromUrl =
    Parser.parse parser
