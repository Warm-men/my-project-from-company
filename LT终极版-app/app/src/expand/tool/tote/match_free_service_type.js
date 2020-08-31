const matchFreeServiceType = (want_state, tote) => {
  const { tote_free_service } = tote
  if (!tote_free_service || !tote_free_service.hint.tote_page_return_remind)
    return false
  const { type } = tote_free_service.hint.tote_page_return_remind
  if (type === want_state) return true
  else return false
}

export default matchFreeServiceType
