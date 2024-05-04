import { useEffect, useReducer, useState } from "react"

import { Container, Flex, TextField, Theme } from "@radix-ui/themes"
import { ThemeProvider } from "next-themes"
import { get, set } from "idb-keyval"
import {
  CharacterState,
  CharacterAction,
  CharacteristicMax,
  CharacterDispatch,
} from "./types"
import { Characteristics } from "./Characteristics"
import { HealthInfo } from "./HealthInfo"

export function App() {
  return (
    <ThemeProvider attribute="class">
      <Theme>
        <Container size="1">
          <InnerApp />
        </Container>
      </Theme>
    </ThemeProvider>
  )
}

const INITIAL_CHARACTER_STATE: CharacterState = {
  name: "",
  chars: {
    str: null,
    dex: null,
    end: null,
    int: null,
    edu: null,
    soc: null,
    strMax: null,
    dexMax: null,
    endMax: null,
  },
}

function characterReducer(
  state: CharacterState,
  action: CharacterAction,
): CharacterState {
  console.debug("[characterReducer] action", action, state)
  switch (action.type) {
    case "replaceState": {
      return action.state
    }
    case "setName": {
      return { ...state, name: action.value }
    }
    case "setChar": {
      let newChar: number | null = parseInt(action.value, 10)
      if (isNaN(newChar)) newChar = null
      let newChars = state.chars
      newChars[action.char] = newChar
      return { ...state, chars: newChars }
    }
    case "bumpChar": {
      let newChar = state.chars[action.char] || 0
      newChar += action.value
      if (newChar < 0) newChar = 0
      let newChars = { ...state.chars, [action.char]: newChar }
      return { ...state, chars: newChars }
    }
    case "setNullCharFromMax": {
      let newChar = state.chars[action.char]
      let maxChar = (action.char + "Max") as CharacteristicMax
      if (newChar == null) newChar = state.chars[maxChar]
      return { ...state, chars: { ...state.chars, [action.char]: newChar } }
    }
    default:
      return state
  }
}

function InnerApp() {
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer(
    characterReducer,
    INITIAL_CHARACTER_STATE,
  )

  useEffect(() => {
    get("character").then((character) => {
      if (character) dispatch({ type: "replaceState", state: character })
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    set("character", state)
  }, [state])

  if (loading) return "Loading..."

  return (
    <Flex direction="column" gap="3">
      <NameInput name={state.name} dispatch={dispatch} />
      <HealthInfo chars={state.chars} />
      <Characteristics state={state} dispatch={dispatch} />
    </Flex>
  )
}

function NameInput({
  name,
  dispatch,
}: {
  name: string
  dispatch: CharacterDispatch
}) {
  return (
    <TextField.Root
      size="3"
      value={name}
      placeholder="Character name"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: "setName", value: event.target.value })
      }
    />
  )
}
