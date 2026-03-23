import os
import subprocess

directory = "/home/dcrespol/Documentos/Dinos/cuentos"
files = [f for f in os.listdir(directory) if f.endswith(".pdf") and not f.endswith("_small.pdf")]

for filename in files:
    input_path = os.path.join(directory, filename)
    output_path = os.path.join(directory, filename.replace(".pdf", "_small.pdf"))
    
    print(f"Compressing {filename}...")
    cmd = [
        "gs", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/screen", "-dNOPAUSE", "-dQUIET", "-dBATCH",
        f"-sOutputFile={output_path}", input_path
    ]
    
    try:
        subprocess.run(cmd, check=True)
        # Check size
        orig_size = os.path.getsize(input_path)
        new_size = os.path.getsize(output_path)
        print(f"  Done: {orig_size/1024/1024:.1f}MB -> {new_size/1024:.1f}KB")
        
        # Replace original
        os.remove(input_path)
        os.rename(output_path, input_path)
    except Exception as e:
        print(f"  Error compressing {filename}: {e}")

print("\nAll PDFs compressed!")
