const byArg = (client, args) => {
  return client.character(args)
}

const byId = (client, id) => {
  return client.character({ filters: `id = ${id}`})
}

export default {
  byArg,
  byId,
}
