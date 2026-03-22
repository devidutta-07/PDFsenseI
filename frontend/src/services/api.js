const API = "http://localhost:5000"

export const createChat = async () => {
  const res = await fetch(`${API}/chat/create`, { method: "POST" })
  return res.json()
}

export const deleteChat = async (id) => {
  await fetch(`${API}/chat/delete/${id}`, { method: "DELETE" })
}

export const uploadDocs = async (chatId, files) => {

  const form = new FormData()

  form.append("chat_id", chatId)

  files.forEach(f => form.append("files", f))

  return fetch(`${API}/process`, {
    method: "POST",
    body: form
  })
}

export const askQuestion = async (chatId, question) => {

  const res = await fetch(`${API}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      question
    })
  })

  return res.json()
}

export const checkDocumentStatus = async (id) => {
  // Mock function, no endpoint for this in current backend
  return { has_documents: false };
}

const apiExport = {
  createChat,
  deleteChat,
  uploadDocs,
  askQuestion,
  checkDocumentStatus,
}

export default apiExport
