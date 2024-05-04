import { Badge, Button, Flex, Grid, Strong, TextField } from "@radix-ui/themes"
import {
  CharacterState,
  CharacterDispatch,
  Characteristic,
  CharacteristicPhysical,
} from "./types"

export function Characteristics({
  state,
  dispatch,
}: {
  state: CharacterState
  dispatch: CharacterDispatch
}) {
  return (
    <Grid columns="3" rows="2" gap="3">
      <PhysicalCharacteristic
        char="str"
        value={state.chars.str}
        max={state.chars.strMax}
        dispatch={dispatch}
      />
      <PhysicalCharacteristic
        char="dex"
        value={state.chars.dex}
        max={state.chars.dexMax}
        dispatch={dispatch}
      />
      <PhysicalCharacteristic
        char="end"
        value={state.chars.end}
        max={state.chars.endMax}
        dispatch={dispatch}
      />
      <MentalCharacteristic
        char="int"
        value={state.chars.int}
        dispatch={dispatch}
      />
      <MentalCharacteristic
        char="edu"
        value={state.chars.edu}
        dispatch={dispatch}
      />
      <MentalCharacteristic
        char="soc"
        value={state.chars.soc}
        dispatch={dispatch}
      />
    </Grid>
  )
}

function PhysicalCharacteristic({
  char,
  value,
  max,
  dispatch,
}: {
  char: CharacteristicPhysical
  value: number | null
  max: number | null
  dispatch: CharacterDispatch
}) {
  const charMax: Characteristic = `${char}Max`

  const handleCharChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "setChar", char, value: event.target.value })
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "setChar", char: charMax, value: event.target.value })
  const handleIncrement = () => dispatch({ type: "bumpChar", char, value: 1 })
  const handleDecrement = () => dispatch({ type: "bumpChar", char, value: -1 })
  const handleMaxBlur = () => dispatch({ type: "setNullCharFromMax", char })

  return (
    <Flex direction="column" gap="1">
      <CharacteristicHeader char={char} value={value} />
      <Flex gap="1">
        <TextField.Root
          pattern="[0-9]*"
          variant="soft"
          color="gray"
          placeholder={char.toUpperCase()}
          value={value?.toString() || ""}
          onChange={handleCharChange}
        />
        <Button variant="surface" onClick={handleIncrement}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 9H11L7.5 4.5L4 9Z" fill="currentColor"></path>
          </svg>
        </Button>
      </Flex>
      <Flex gap="1">
        <TextField.Root
          pattern="[0-9]*"
          placeholder={`${char.toUpperCase()} Max`}
          value={max?.toString() || ""}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
        />
        <Button variant="surface" onClick={handleDecrement}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor"></path>
          </svg>
        </Button>
      </Flex>
    </Flex>
  )
}

function MentalCharacteristic({
  char,
  value,
  dispatch,
}: {
  char: Characteristic
  value: number | null
  dispatch: CharacterDispatch
}) {
  const handleCharChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "setChar", char, value: event.target.value })
  return (
    <Flex direction="column" gap="1">
      <CharacteristicHeader char={char} value={value} />
      <TextField.Root
        pattern="[0-9]*"
        placeholder={char.toUpperCase()}
        value={value?.toString() || ""}
        onChange={handleCharChange}
      />
    </Flex>
  )
}

function CharacteristicHeader({
  char,
  value,
}: {
  char: Characteristic
  value: number | null
}) {
  return (
    <Flex justify="between" align="center">
      <Strong style={{ textTransform: "uppercase" }}>{char}</Strong>
      <Modifier value={value} />
    </Flex>
  )
}

function Modifier({ value }: { value: number | null }) {
  if (value == null) return
  let color: "yellow" | "green" | "blue"
  if (value < 6) {
    color = "yellow"
  } else if (value > 8) {
    color = "green"
  } else {
    color = "blue"
  }
  return <Badge color={color}>{numberToDM(value)}</Badge>
}

function numberToDM(number: number) {
  if (number < 0) return ""
  if (number > 15) return "+3"
  switch (number) {
    case 0:
      return "-3"
    case 1:
    case 2:
      return "-2"
    case 3:
    case 4:
    case 5:
      return "-1"
    case 6:
    case 7:
    case 8:
      return "+0"
    case 9:
    case 10:
    case 11:
      return "+1"
    case 12:
    case 13:
    case 14:
      return "+2"
    case 15:
      return "+3"
    default:
      return ""
  }
}
