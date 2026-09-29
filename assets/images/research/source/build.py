"""Build the research figures into ../

    python make_data.py   # only needed after changing the curve or sample data
    python build.py       # all figures
    python build.py causal schubert

causal, schubert, determinantal, astronomy:
    source/<name>.tex -> PDF (Tectonic) -> ../<name>.svg (PyMuPDF). Needs
    `tectonic` on PATH (https://tectonic-typesetting.github.io, a self-contained
    TeX engine that fetches packages on demand). Text is converted to outlines
    so the SVGs don't depend on fonts installed on the viewer's machine.

genomics:
    tme-heatmap.pdf (the full-cohort OAC TME-score heatmap, exported from R)
    cropped to the clustered heatmap -- dendrograms, annotation bars and cells;
    the title, legend and cell-type labels are too small to read at card size --
    and rasterised to ../genomics.png. A PNG because the vector version is
    ~1 MB of individual cells.

All need `pip install pymupdf`.
"""

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import fitz  # PyMuPDF

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
FIGURES = ["causal", "schubert", "determinantal", "genomics", "astronomy"]

# Heatmap body in the PDF's coordinates (pt): everything left of the legend and
# between the title and the column labels
TME_CROP = fitz.Rect(2, 14, 639, 561)
TME_SCALE = 1.5  # ~955 px wide: about 3x the card's display width


def build_tex(name):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(
            [shutil.which("tectonic") or "tectonic", "-X", "compile", "--outdir", tmp, f"{name}.tex"],
            cwd=HERE, check=True,
        )
        with fitz.open(Path(tmp) / f"{name}.pdf") as doc:
            svg = doc[0].get_svg_image(text_as_path=True)
    (OUT / f"{name}.svg").write_text(svg, encoding="utf-8")
    print(f"wrote {name}.svg")


def build_genomics():
    with fitz.open(HERE / "tme-heatmap.pdf") as doc:
        pix = doc[0].get_pixmap(clip=TME_CROP, matrix=fitz.Matrix(TME_SCALE, TME_SCALE), alpha=True)
        pix.save(OUT / "genomics.png")
    print("wrote genomics.png")


if __name__ == "__main__":
    for name in sys.argv[1:] or FIGURES:
        build_genomics() if name == "genomics" else build_tex(name)
