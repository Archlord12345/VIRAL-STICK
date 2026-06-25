import sys
import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as doc:
            xml_content = doc.read('word/document.xml')
            root = ET.fromstring(xml_content)
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = []
            for p in root.findall('.//w:p', ns):
                text_runs = []
                for r in p.findall('.//w:r', ns):
                    for t in r.findall('.//w:t', ns):
                        if t.text:
                            text_runs.append(t.text)
                p_text = ''.join(text_runs)
                if p_text:
                    paragraphs.append(p_text)
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error: {e}"

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 read_docx.py <file_path>")
        sys.exit(1)
    print(extract_text_from_docx(sys.argv[1]))
