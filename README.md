# FoldOverBoxGenerator (fork)

Generate no-glue fold-over cardboard boxes for lasercutting or drag-knife CNC machines.  
Output is SVG, scale 1:1 in millimetres.

**Live demo:** *https://elliotletourneau.github.io/FoldOverBoxGenerator/*

---

## Attribution

This project is a fork of [FoldOverBoxGenerator](https://github.com/williamsokol/FoldOverBoxGenerator)  
by **William Sokol** (2024), released under the MIT License.

**Changes made in this fork:**
- Handle cutouts removed from all panels
- UI completely redesigned (dark theme, sidebar layout, number inputs)
- Unused files removed (`demo.js`, `style.css`, `settings.json`)
- Code cleaned up and commented

---

## How it works

Enter your desired **Length × Width × Height** and material **Thickness** in the sidebar, then click **Update** to preview.  
Click **Export SVG** to download the cut file.

- **Red solid lines** → cut path  
- **Red dashed lines** → fold / score line

The tabs interlock so the box holds together without glue.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | UI shell |
| `shape.js` | Box geometry (Paper.js paperscript) |
| `BoxLib.js` | Shared helpers + SVG export (Paper.js paperscript) |
| `paperjs-offset.js` | Path offset library (unchanged from upstream) |

---

## License

MIT — see [LICENSE](LICENSE)
