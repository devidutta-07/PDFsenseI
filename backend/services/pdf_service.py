from unstructured.partition.pdf import partition_pdf


def extract_text(files):

    text = ""

    for file in files:

        elements = partition_pdf(
            filename=file,
            strategy="fast"
        )

        for el in elements:

            if hasattr(el, "text") and el.text:
                text += el.text + "\n"

    return text
