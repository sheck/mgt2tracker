export type CharacterState = {
  name: string
  chars: {
    str: number | null
    dex: number | null
    end: number | null
    int: number | null
    edu: number | null
    soc: number | null
    strMax: number | null
    dexMax: number | null
    endMax: number | null
  }
}

export type Characteristic = keyof CharacterState["chars"]
export type CharacteristicPhysical = "str" | "dex" | "end"

export type CharacteristicMax = "strMax" | "dexMax" | "endMax"

export type CharacterAction =
  | { type: "replaceState"; state: CharacterState }
  | { type: "setName"; value: string }
  | { type: "setChar"; char: Characteristic; value: string }
  | { type: "bumpChar"; char: Characteristic; value: number }
  | { type: "setNullCharFromMax"; char: Characteristic }

export type CharacterDispatch = React.Dispatch<CharacterAction>
