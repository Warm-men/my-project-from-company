const addToCloset = `
mutation WebAddToCloset($input: AddToClosetInput!) {
    AddToCloset(input: $input) {
        products{
            id
        }
     }
  }
`

const removeFromCloset = `
mutation WebRemoveFromCloset($input: RemoveFromClosetInput!) {
    RemoveFromCloset(input: $input) {
        products{
            id
        }
    }
}
`
export { addToCloset, removeFromCloset }
