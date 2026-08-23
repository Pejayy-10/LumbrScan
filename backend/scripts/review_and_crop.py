"""Review raw timber photos and save manual, non-destructive training crops.

Run from ``backend/`` after building the manifest. Drag a rectangle around the
timber subject, then press K to save an approved crop. Press R only for an
unusable photo; the original image is never changed.

Keys: K keep and save crop | R reject | S leave for review | Left/Right navigate
"""

from __future__ import annotations

import argparse
import csv
import os
import tempfile
from pathlib import Path
import tkinter as tk
from tkinter import messagebox

from PIL import Image, ImageOps, ImageTk


BACKEND_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = BACKEND_ROOT / "data" / "metadata" / "image_metadata.csv"
PREVIEW_WIDTH = 1000
PREVIEW_HEIGHT = 720


class ManifestLockedError(RuntimeError):
    """Raised when another program holds the manifest CSV open on Windows."""


class CropReviewer:
    def __init__(self, manifest_path: Path, include_reviewed: bool) -> None:
        self.manifest_path = manifest_path
        with manifest_path.open("r", encoding="utf-8", newline="") as file:
            reader = csv.DictReader(file)
            self.fieldnames = reader.fieldnames or []
            self.rows = list(reader)

        self.indices = [
            index for index, row in enumerate(self.rows)
            if include_reviewed or row["quality_status"] == "REVIEW"
        ]
        if not self.indices:
            raise ValueError("No review rows found. Use --include-reviewed to revisit existing decisions.")

        self.position = 0
        self.original: Image.Image | None = None
        self.preview: Image.Image | None = None
        self.preview_image: ImageTk.PhotoImage | None = None
        self.scale = 1.0
        self.crop_start: tuple[int, int] | None = None
        self.crop_end: tuple[int, int] | None = None
        self.crop_rectangle: int | None = None

        self.window = tk.Tk()
        self.window.title("LumbrScan Timber Photo Review")
        self.window.configure(padx=12, pady=12)
        self.info = tk.StringVar()
        tk.Label(self.window, textvariable=self.info, font=("Segoe UI", 11, "bold")).pack(anchor="w")
        tk.Label(
            self.window,
            text="Drag a crop around the timber subject. K = keep/save, R = reject, S = leave for review.",
        ).pack(anchor="w", pady=(0, 8))
        self.canvas = tk.Canvas(self.window, width=PREVIEW_WIDTH, height=PREVIEW_HEIGHT, bg="#1f2937")
        self.canvas.pack()
        self.canvas.bind("<ButtonPress-1>", self.start_crop)
        self.canvas.bind("<B1-Motion>", self.update_crop)
        self.canvas.bind("<ButtonRelease-1>", self.finish_crop)
        self.window.bind("<Key-k>", lambda _: self.run_action(self.keep))
        self.window.bind("<Key-r>", lambda _: self.run_action(self.reject))
        self.window.bind("<Key-s>", lambda _: self.run_action(self.skip))
        self.window.bind("<Right>", lambda _: self.advance(1))
        self.window.bind("<Left>", lambda _: self.advance(-1))
        self.window.bind("<Key-q>", lambda _: self.window.destroy())
        self.show_current()

    @property
    def current_index(self) -> int:
        return self.indices[self.position]

    @property
    def current_row(self) -> dict[str, str]:
        return self.rows[self.current_index]

    def show_current(self) -> None:
        row = self.current_row
        image_path = BACKEND_ROOT / row["raw_path"]
        with Image.open(image_path) as image:
            self.original = ImageOps.exif_transpose(image).convert("RGB")
        self.preview = self.original.copy()
        self.preview.thumbnail((PREVIEW_WIDTH, PREVIEW_HEIGHT))
        self.scale = self.original.width / self.preview.width
        self.preview_image = ImageTk.PhotoImage(self.preview)
        self.canvas.delete("all")
        self.canvas.create_image(0, 0, anchor="nw", image=self.preview_image)
        self.crop_start = None
        self.crop_end = None
        self.crop_rectangle = None
        self.info.set(
            f"{self.position + 1}/{len(self.indices)} | {row['image_id']} | "
            f"{row['species']} / {row['specimen_id']} / {row['modality']}"
        )

    def canvas_point(self, event: tk.Event) -> tuple[int, int]:
        assert self.preview is not None
        return (
            max(0, min(event.x, self.preview.width)),
            max(0, min(event.y, self.preview.height)),
        )

    def start_crop(self, event: tk.Event) -> None:
        self.crop_start = self.canvas_point(event)
        self.crop_end = self.crop_start
        if self.crop_rectangle is not None:
            self.canvas.delete(self.crop_rectangle)
        self.crop_rectangle = self.canvas.create_rectangle(
            *self.crop_start, *self.crop_end, outline="#f59e0b", width=3
        )

    def update_crop(self, event: tk.Event) -> None:
        if self.crop_start is None or self.crop_rectangle is None:
            return
        self.crop_end = self.canvas_point(event)
        self.canvas.coords(self.crop_rectangle, *self.crop_start, *self.crop_end)

    def finish_crop(self, event: tk.Event) -> None:
        self.update_crop(event)

    def crop_box(self) -> tuple[int, int, int, int] | None:
        if self.original is None or self.crop_start is None or self.crop_end is None:
            return None
        left, right = sorted((self.crop_start[0], self.crop_end[0]))
        top, bottom = sorted((self.crop_start[1], self.crop_end[1]))
        if right - left < 40 or bottom - top < 40:
            return None
        return (
            round(left * self.scale),
            round(top * self.scale),
            round(right * self.scale),
            round(bottom * self.scale),
        )

    def persist(self) -> None:
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", newline="", delete=False, dir=self.manifest_path.parent
        ) as temporary:
            writer = csv.DictWriter(temporary, fieldnames=self.fieldnames)
            writer.writeheader()
            writer.writerows(self.rows)
            temporary_path = Path(temporary.name)
        try:
            os.replace(temporary_path, self.manifest_path)
        except PermissionError as error:
            recovery_path = self.manifest_path.with_suffix(".recovery.csv")
            os.replace(temporary_path, recovery_path)
            raise ManifestLockedError(
                f"{self.manifest_path.name} is locked by another program. Close Excel or any CSV preview, "
                f"then run scripts/recover_manifest.py --recovery {recovery_path.name}."
            ) from error

    def run_action(self, action: object) -> None:
        try:
            action()  # type: ignore[operator]
        except ManifestLockedError as error:
            messagebox.showerror("Metadata CSV is locked", str(error))

    def keep(self) -> None:
        box = self.crop_box()
        if box is None:
            messagebox.showwarning("Crop required", "Draw a meaningful crop around the timber before keeping it.")
            return
        assert self.original is not None
        row = self.current_row
        output_path = BACKEND_ROOT / row["processed_path"]
        output_path.parent.mkdir(parents=True, exist_ok=True)
        self.original.crop(box).save(output_path, format="JPEG", quality=95, optimize=True)
        row.update({
            "quality_status": "KEEP",
            "crop_left": str(box[0]),
            "crop_top": str(box[1]),
            "crop_right": str(box[2]),
            "crop_bottom": str(box[3]),
        })
        self.persist()
        self.advance(1)

    def reject(self) -> None:
        row = self.current_row
        row["quality_status"] = "REJECT"
        self.persist()
        self.advance(1)

    def skip(self) -> None:
        self.persist()
        self.advance(1)

    def advance(self, amount: int) -> None:
        next_position = self.position + amount
        if next_position < 0:
            return
        if next_position >= len(self.indices):
            messagebox.showinfo("Review complete", "All selected rows have been visited.")
            self.window.destroy()
            return
        self.position = next_position
        self.show_current()

    def run(self) -> None:
        self.window.mainloop()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--include-reviewed", action="store_true")
    args = parser.parse_args()
    CropReviewer(args.manifest.resolve(), args.include_reviewed).run()


if __name__ == "__main__":
    main()
