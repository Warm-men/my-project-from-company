export default `
    mutation queueProductSizer($input: QueueProductSizerInput!) {
        QueueProductSizer(input: $input) {
            clientMutationId
            errors
        }
    }
`
