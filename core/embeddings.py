from langchain_google_genai import GoogleGenerativeAIEmbeddings


def get_embeddings():

    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001"
    )

    return embeddings