"""
build_ieee_docx.py
──────────────────
Builds a proper, openable IEEE-formatted DOCX from FINAL_MANUSCRIPT_TEXT.md
and then converts it to PDF via LibreOffice (headless).

Requirements:
    pip install python-docx
"""

import re
import subprocess
import sys
from pathlib import Path

# ── python-docx ───────────────────────────────────────────────────────────────
try:
    from docx import Document
    from docx.shared import Pt, Cm, Inches, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.enum.section import WD_SECTION
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
except ImportError:
    print("Installing python-docx ...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
    from docx import Document
    from docx.shared import Pt, Cm, Inches, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.enum.section import WD_SECTION
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement

# ── Paths ─────────────────────────────────────────────────────────────────────
HERE = Path(__file__).parent
SRC_MD   = HERE / "FINAL_MANUSCRIPT_TEXT.md"
OUT_DOCX = HERE / "Student_Performance_Prediction_OULAD_IEEE.docx"

# ── Helpers ───────────────────────────────────────────────────────────────────

def set_cell_bg(cell, hex_color):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)

def set_cell_borders(cell):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right"):
        border = OxmlElement("w:" + edge)
        border.set(qn("w:val"), "single")
        border.set(qn("w:sz"), "4")
        border.set(qn("w:space"), "0")
        border.set(qn("w:color"), "000000")
        tcBorders.append(border)
    tcPr.append(tcBorders)

def clean_latex(text):
    replacements = [
        ("\\textbf{", ""), ("\\textit{", ""), ("\\emph{", ""),
        ("\\%", "%"), ("\\rightarrow", " -> "), ("\\leftarrow", " <- "),
        ("\\le", "<="), ("\\ge", ">="), ("\\times", "x"),
        ("\\pm", "+/-"), ("\\approx", "~"), ("\\mathbf{", ""),
        ("\\text{", ""), ("\\quad", "  "), ("\\,", " "),
        ("$S_0$", "S0"), ("$S_1$", "S1"), ("$S_2$", "S2"),
        ("$\\theta^*$", "theta*"), ("$\\theta$", "theta"),
        ("$F_1$", "F1"), ("}", ""), ("$", ""),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text

def add_run(para, text, bold=False, italic=False, size=9):
    run = para.add_run(text)
    run.bold = bold
    run.italic = italic
    run.font.name = "Times New Roman"
    run.font.size = Pt(size)
    return run

def add_inline(para, text, base_size=9):
    text = clean_latex(text)
    pattern = re.compile(r"(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)")
    parts = pattern.split(text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            add_run(para, part[2:-2], bold=True, size=base_size)
        elif part.startswith("*") and part.endswith("*"):
            add_run(para, part[1:-1], italic=True, size=base_size)
        elif part.startswith("`") and part.endswith("`"):
            r = para.add_run(part[1:-1])
            r.font.name = "Courier New"
            r.font.size = Pt(base_size - 1)
        else:
            add_run(para, part, size=base_size)

# ── Parse markdown into blocks ────────────────────────────────────────────────

def parse_md(path):
    lines = path.read_text(encoding="utf-8").splitlines()
    blocks = []
    i = 0
    table_rows = []

    def flush_table():
        if table_rows:
            blocks.append({"type": "table", "rows": list(table_rows)})
            table_rows.clear()

    while i < len(lines):
        line = lines[i]

        if re.match(r"^---+\s*$", line):
            flush_table()
            blocks.append({"type": "hr"})
            i += 1
            continue

        m = re.match(r"^(#{1,4})\s+(.*)", line)
        if m:
            flush_table()
            level = len(m.group(1))
            blocks.append({"type": "heading", "level": level, "text": m.group(2).strip()})
            i += 1
            continue

        if line.startswith("|"):
            cells = [c.strip() for c in line.split("|")[1:-1]]
            if all(re.match(r"^[:\-]+$", c) for c in cells if c):
                i += 1
                continue
            table_rows.append(cells)
            i += 1
            continue
        else:
            flush_table()

        if line.startswith("```"):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1
            blocks.append({"type": "code", "text": "\n".join(code_lines)})
            continue

        m_bull = re.match(r"^(\s*)[-*]\s+(.*)", line)
        if m_bull:
            blocks.append({"type": "bullet", "indent": len(m_bull.group(1)), "text": m_bull.group(2)})
            i += 1
            continue

        m_num = re.match(r"^(\s*)\d+\.\s+(.*)", line)
        if m_num:
            blocks.append({"type": "numbered", "indent": len(m_num.group(1)), "text": m_num.group(2)})
            i += 1
            continue

        if line.strip().startswith("$$"):
            math_lines = [line]
            if not (line.strip().endswith("$$") and line.strip() != "$$"):
                i += 1
                while i < len(lines) and not lines[i].strip().endswith("$$"):
                    math_lines.append(lines[i])
                    i += 1
                if i < len(lines):
                    math_lines.append(lines[i])
            blocks.append({"type": "math", "text": "\n".join(math_lines)})
            i += 1
            continue

        if not line.strip():
            blocks.append({"type": "blank"})
            i += 1
            continue

        para_lines = [line]
        i += 1
        while i < len(lines) and lines[i].strip() \
              and not lines[i].startswith("#") \
              and not lines[i].startswith("|") \
              and not lines[i].startswith("```") \
              and not re.match(r"^---+\s*$", lines[i]) \
              and not re.match(r"^(\s*)[-*]\s+", lines[i]) \
              and not re.match(r"^(\s*)\d+\.\s+", lines[i]) \
              and not lines[i].strip().startswith("$$"):
            para_lines.append(lines[i])
            i += 1
        blocks.append({"type": "para", "text": " ".join(para_lines)})

    flush_table()
    return blocks

# ── Build document ────────────────────────────────────────────────────────────

def build_docx(blocks):
    doc = Document()

    # Page setup
    section = doc.sections[0]
    section.page_width    = Inches(8.5)
    section.page_height   = Inches(11)
    section.left_margin   = Inches(0.75)
    section.right_margin  = Inches(0.75)
    section.top_margin    = Inches(0.75)
    section.bottom_margin = Inches(1.0)

    style = doc.styles["Normal"]
    style.font.name = "Times New Roman"
    style.font.size = Pt(9)
    style.paragraph_format.space_after = Pt(3)

    # Separate title/abstract/body from blocks
    title_text = ""
    authors_block = []
    abstract_text = ""
    keywords_text = ""
    body_blocks = []

    state = "pre"
    for blk in blocks:
        if state == "pre":
            if blk["type"] == "heading" and blk["level"] == 1:
                title_text = blk["text"]
                state = "authors"
        elif state == "authors":
            if blk["type"] == "heading" and "Abstract" in blk.get("text", ""):
                state = "abstract"
            elif blk["type"] not in ("blank", "hr"):
                authors_block.append(blk)
        elif state == "abstract":
            if blk["type"] == "para":
                abstract_text = blk["text"]
                state = "keywords"
        elif state == "keywords":
            if blk["type"] == "para" and "Index Terms" in blk["text"]:
                keywords_text = blk["text"]
                state = "body"
        else:
            body_blocks.append(blk)

    # Title
    tp = doc.add_paragraph()
    tp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    tp.paragraph_format.space_before = Pt(0)
    tp.paragraph_format.space_after  = Pt(6)
    r = tp.add_run(clean_latex(title_text))
    r.font.name = "Times New Roman"; r.font.size = Pt(14); r.bold = True

    # Authors
    for blk in authors_block:
        if blk["type"] == "para":
            ap = doc.add_paragraph()
            ap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            ap.paragraph_format.space_after = Pt(2)
            add_inline(ap, blk["text"], base_size=10)

    doc.add_paragraph()

    # Abstract
    abs_p = doc.add_paragraph()
    abs_p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    abs_p.paragraph_format.space_after = Pt(4)
    rl = abs_p.add_run("Abstract\u2014")
    rl.bold = True; rl.italic = True
    rl.font.name = "Times New Roman"; rl.font.size = Pt(9)
    add_inline(abs_p, abstract_text, base_size=9)

    # Keywords
    if keywords_text:
        kp = doc.add_paragraph()
        kp.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        kp.paragraph_format.space_after = Pt(6)
        kl = kp.add_run("Index Terms")
        kl.bold = True; kl.font.name = "Times New Roman"; kl.font.size = Pt(9)
        kw_body = re.sub(r"\*\*Index Terms\*\*[--]?", "", keywords_text).strip()
        add_inline(kp, "\u2014" + kw_body, base_size=9)

    doc.add_paragraph()

    # Body blocks
    blank_count = 0
    for blk in body_blocks:
        t = blk["type"]

        if t == "blank":
            blank_count += 1
            if blank_count == 1:
                doc.add_paragraph().paragraph_format.space_after = Pt(2)
            continue
        else:
            blank_count = 0

        if t == "hr":
            continue

        elif t == "heading":
            level = blk["level"]
            text  = blk["text"]
            p = doc.add_paragraph()
            if level == 2:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(8)
                p.paragraph_format.space_after  = Pt(4)
                r = p.add_run(clean_latex(text).upper())
                r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(9)
            elif level == 3:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_before = Pt(5)
                p.paragraph_format.space_after  = Pt(2)
                r = p.add_run(clean_latex(text))
                r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(9)
            else:
                p.paragraph_format.space_before = Pt(4)
                p.paragraph_format.space_after  = Pt(1)
                r = p.add_run(clean_latex(text) + ": ")
                r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(9)

        elif t == "para":
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after  = Pt(3)
            p.paragraph_format.first_line_indent = Pt(12)
            add_inline(p, blk["text"], base_size=9)

        elif t in ("bullet", "numbered"):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            lvl = max(0, blk.get("indent", 0) // 4)
            p.paragraph_format.left_indent       = Inches(0.2 * (lvl + 1))
            p.paragraph_format.first_line_indent = Inches(-0.2)
            p.paragraph_format.space_after = Pt(1)
            add_run(p, "* " if t == "bullet" else "  ", size=9)
            add_inline(p, blk["text"], base_size=9)

        elif t == "math":
            raw = blk["text"].replace("$$", "").strip()
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after  = Pt(4)
            add_run(p, clean_latex(raw), italic=True, size=9)

        elif t == "code":
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.left_indent = Inches(0.2)
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after  = Pt(3)
            r = p.add_run(blk["text"])
            r.font.name = "Courier New"; r.font.size = Pt(7.5)

        elif t == "table":
            rows = blk["rows"]
            if not rows:
                continue
            ncols = max(len(r) for r in rows)
            rows = [r + [""] * (ncols - len(r)) for r in rows]
            tbl = doc.add_table(rows=len(rows), cols=ncols)
            tbl.style = "Table Grid"
            for ri, row_data in enumerate(rows):
                for ci, cell_text in enumerate(row_data):
                    cell = tbl.rows[ri].cells[ci]
                    set_cell_borders(cell)
                    cp = cell.paragraphs[0]
                    cp.paragraph_format.space_before = Pt(1)
                    cp.paragraph_format.space_after  = Pt(1)
                    if ri == 0:
                        set_cell_bg(cell, "D9D9D9")
                        cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        r = cp.add_run(clean_latex(cell_text))
                        r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(8)
                    else:
                        cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        add_inline(cp, cell_text, base_size=8)
            doc.add_paragraph().paragraph_format.space_after = Pt(3)

    return doc


def main():
    print("Parsing " + str(SRC_MD) + " ...")
    blocks = parse_md(SRC_MD)
    print("  -> " + str(len(blocks)) + " blocks parsed")

    print("Building DOCX ...")
    doc = build_docx(blocks)
    doc.save(str(OUT_DOCX))
    print("  Saved: " + str(OUT_DOCX))

    import shutil
    lo_paths = [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        "soffice",
    ]
    lo_exe = None
    for p in lo_paths:
        if Path(p).exists() or shutil.which(p):
            lo_exe = p
            break

    if lo_exe:
        print("Converting to PDF via LibreOffice ...")
        try:
            result = subprocess.run(
                [lo_exe, "--headless", "--convert-to", "pdf",
                 "--outdir", str(OUT_DOCX.parent), str(OUT_DOCX)],
                capture_output=True, text=True, timeout=120
            )
            pdf_out = OUT_DOCX.with_suffix(".pdf")
            if pdf_out.exists():
                print("  PDF saved: " + str(pdf_out))
            else:
                print("  LibreOffice stderr: " + result.stderr)
        except Exception as e:
            print("  LibreOffice error: " + str(e))
    else:
        print("  LibreOffice not found on PATH. Open the DOCX and export to PDF manually.")

    print("Done.")


if __name__ == "__main__":
    main()
