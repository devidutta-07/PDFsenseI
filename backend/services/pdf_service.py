from unstructured.partition.pdf import partition_pdf


def extract_text(files):

    text = ""

    for file in files:

        elements = partition_pdf(
            filename=file,
            extract_images_in_pdf=True,
            strategy="hi_res",
            infer_table_structure=True
        )

        for el in elements:

            if hasattr(el, "text") and el.text:
                text += el.text + "\n"

    return text
