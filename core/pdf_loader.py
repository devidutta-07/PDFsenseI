from unstructured.partition.pdf import partition_pdf


def extract_text(files):
    text = ""

    for file in files:
        elements = partition_pdf(
            file=file,
            extract_images_in_pdf=True,
            infer_table_structure=True,
            strategy="hi_res"
        )

        for el in elements:
            if hasattr(el, "text") and el.text:
                text += el.text + "\n"

    return text