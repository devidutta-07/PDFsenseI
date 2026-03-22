from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from vectorstore.faiss_store import load_index


def ask_question(chat_id, question):

    vectorstore = load_index(chat_id)

    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    docs = retriever.invoke(question)

    context = "\n\n".join([d.page_content for d in docs])

    sources = [
        d.metadata.get("source", "document")
        for d in docs
    ]

    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "Answer only using the context. If answer not found say not available."),
        ("human",
         "Context:\n{context}\n\nQuestion:\n{question}")
    ])

    llm = ChatGoogleGenerativeAI(
        model="models/gemini-2.5-flash",
        temperature=0.3
    )

    chain = prompt | llm

    answer = chain.invoke({
        "context": context,
        "question": question
    })

    return answer.content, sources

