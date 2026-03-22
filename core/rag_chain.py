from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from langchain_mistralai import ChatMistralAI

from core.vector_store import load_vector_store


def get_chain(chat_id):

    vectorstore = load_vector_store(chat_id)

    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    llm = ChatMistralAI(
        model_name="mistral-small-latest",
        temperature=0.3
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are an AI assistant. Answer only from the provided context."
         "If answer not found say 'Answer not available in documents'."),
        ("human", "Context:\n{context}\n\nQuestion:\n{question}")
    ])

    chain = (
        {"context": retriever, "question": lambda x: x}
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain