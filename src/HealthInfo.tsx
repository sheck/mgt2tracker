import { Badge, Flex, Progress } from "@radix-ui/themes"
import { CharacterState } from "./types"

export function HealthInfo({ chars }: { chars: CharacterState["chars"] }) {
  const { str, dex, end, strMax, dexMax, endMax } = chars

  // Typescript doesn't like the other type narrowing I did :shrug:
  if (str == null) return null
  if (dex == null) return null
  if (end == null) return null
  if (strMax == null) return null
  if (dexMax == null) return null
  if (endMax == null) return null

  const physicalValues = str + dex + end
  const physicalMaxValues = strMax + dexMax + endMax
  let progressValue = (physicalValues / physicalMaxValues) * 100
  // Radix is weird when the value is above 100 for some reason
  if (progressValue > 100) progressValue = 100

  let numberOfDamagedChars = 0
  if (str < strMax) numberOfDamagedChars += 1
  if (dex < dexMax) numberOfDamagedChars += 1
  if (end < endMax) numberOfDamagedChars += 1

  let eligibleForMedicalCare = false
  let requiresSurgery = false
  let unconscious = false
  let dead = false

  if (numberOfDamagedChars === 1 || numberOfDamagedChars === 2)
    eligibleForMedicalCare = true
  if (numberOfDamagedChars === 3) requiresSurgery = true
  if (chars["str"] === 0 || chars["dex"] === 0) unconscious = true
  if (chars["str"] === 0 && chars["dex"] === 0 && chars["end"] === 0)
    dead = true

  return (
    <Flex gap="3" direction="column">
      <Progress size="3" value={progressValue} />
      <Flex gap="2" minHeight="20px">
        {dead && <Badge color="red">Dead</Badge>}
        {unconscious && <Badge color="orange">Unconscious</Badge>}
        {requiresSurgery && <Badge color="yellow">Requires surgery</Badge>}
        {eligibleForMedicalCare && (
          <Badge color="brown">Eligible for medical care</Badge>
        )}
      </Flex>
    </Flex>
  )
}
