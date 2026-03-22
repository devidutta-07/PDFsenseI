from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from langchain_mistralai import ChatMistralAI

from core.vector_store import load_vector_store


def get_chain():

    prompt = PromptTemplate(
        template="""
Answer the question using ONLY the context below.

If the answer is not in the documents say:
"Answer is not available in the provided documents."

Context:
{context}

Question:
{question}

Answer:
""",
        input_variables=["context", "question"]
    )

    vectorstore = load_vector_store()

    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    llm = ChatMistralAI(
        model_name="mistral-small-latest",
        temperature=0.3
    )

    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain