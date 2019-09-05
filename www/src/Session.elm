module Session exposing (Session(..), fromKey, navKey)

import Browser.Navigation as Nav


type Session
    = Guest Nav.Key


navKey : Session -> Nav.Key
navKey session =
    case session of
        Guest key ->
            key


fromKey : Nav.Key -> Session
fromKey key =
    Guest key
