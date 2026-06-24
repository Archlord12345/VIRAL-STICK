import os
import subprocess

# Configuration
SOURCE_DIR = 'asset/compagnons'
OUTPUT_DIR = 'asset/compagnons/svg'

# Créer le répertoire de sortie s'il n'existe pas
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)
    print(f"Répertoire créé : {OUTPUT_DIR}")

def convert_to_svg(filename):
    name = os.path.splitext(filename)[0]
    # 1. Convertir PNG -> BMP (potrace nécessite du format BMP ou PNM)
    # On utilise ImageMagick pour convertir le PNG en BMP
    bmp_file = 'temp.bmp'
    subprocess.run(['convert', os.path.join(SOURCE_DIR, filename), bmp_file])
    
    # 2. Convertir BMP -> SVG
    # -s: SVG output, -o: output file
    output_file = os.path.join(OUTPUT_DIR, f'{name}.svg')
    subprocess.run(['potrace', bmp_file, '-s', '-o', output_file])
    
    # Nettoyage
    os.remove(bmp_file)
    print(f"Converti : {filename} -> {name}.svg")

# Exécution pour tous les fichiers _sans_fond.png
files_found = False
for file in os.listdir(SOURCE_DIR):
    if file.endswith('_sans_fond.png'):
        convert_to_svg(file)
        files_found = True

if not files_found:
    print("Aucun fichier '_sans_fond.png' trouvé dans", SOURCE_DIR)
else:
    print("Conversion terminée avec succès.")
