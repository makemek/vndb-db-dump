const byId = (client, id) => {
  return client.character({ filters: `id = ${id}`})
}

export default {
  byId,
}
