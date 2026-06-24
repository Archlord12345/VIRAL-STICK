import React, { useState, useRef, useEffect } from 'react';

export default function StatusRemixerWeb() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPunchline, setSelectedPunchline] = useState("");
  const [textSize, setTextSize] = useState(24);
  const [textColor, setTextColor] = useState('#ffffff');
  const canvasRef = useRef(null);

  // Propositions de secours de l'IA (Humour local camerounais)
  const aiPunchlines = [
    "Quand le code compile du premier coup à l'UY1 🤯",
    "Tu veux l'argent de quoi ? C'est le mbeng ? 🇨🇲",
    "POV: Quand le prof d'ICT202 prolonge le TP d'une semaine"
  ];

  const extendedColors = [
    '#ffffff', '#f1c40f', '#00e676', '#00e5ff', '#ff007f', '#e74c3c', '#ff9800'
  ];

  // Gestion de l'importation de l'image via le navigateur
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setSelectedPunchline(""); // Réinitialiser le texte
      };
      reader.readAsDataURL(file);
    }
  };

  // 📐 Moteur de rendu Canvas pour générer le mème avec contour de texte professionnel
  useEffect(() => {
    if (!selectedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.src = selectedImage;
    img.onload = () => {
      // Ajuster la taille du canvas à l'image importée
      canvas.width = img.width;
      canvas.height = img.height;

      // Dessiner l'image de fond
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (selectedPunchline) {
        // Configuration typographique professionnelle (Gras + Impact Style)
        const computedFontSize = Math.floor(canvas.width * (textSize / 500));
        ctx.font = `900 ${computedFontSize}px Impact, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = textColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = computedFontSize / 6; // Contour proportionnel

        // Positionner le texte en bas du canvas
        const x = canvas.width / 2;
        const y = canvas.height - (canvas.height * 0.08);

        // Dessiner le contour noir (Outline Effect) puis injecter la couleur
        ctx.strokeText(selectedPunchline.toUpperCase(), x, y);
        ctx.fillText(selectedPunchline.toUpperCase(), x, y);
      }
    };
  }, [selectedImage, selectedPunchline, textSize, textColor]);

  // Télécharger le mème généré directement sur le PC
  const downloadMeme = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'viral-stick-meme.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🖼️ STATUS REMIXER — VERSION WEB</h1>
      <p style={styles.subtitle}>Studio KERNEL FORGE de création de mèmes sur navigateur</p>

      {/* Zone de prévisualisation Canvas */}
      <div style={styles.previewContainer}>
        {selectedImage ? (
          <canvas ref={canvasRef} style={styles.canvas} />
        ) : (
          <div style={styles.placeholder}>
            <p>Glissez ou importez une image pour commencer</p>
            <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} id="filePicker" />
            <label htmlFor="filePicker" style={styles.uploadButton}>📂 Choisir une image</label>
          </div>
        )}
      </div>

      {/* Panneau de contrôle d'ajustement du calque */}
      {selectedImage && selectedPunchline && (
        <div style={styles.adjustmentPanel}>
          <h3 style={styles.panelTitle}>⚙️ Éditeur de Calque (TextOverlayEditor)</h3>
          <div style={styles.toolRow}>
            <button style={styles.btn} onClick={() => setTextSize(p => Math.max(15, p - 3))}>A -</button>
            <button style={styles.btn} onClick={() => setTextSize(p => Math.min(45, p + 3))}>A +</button>
            <div style={styles.divider} />
            <div style={styles.colorContainer}>
              {extendedColors.map((color, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setTextColor(color)}
                  style={{
                    ...styles.colorCircle, 
                    backgroundColor: color, 
                    border: textColor === color ? '2px solid #00e676' : '1px solid rgba(255,255,255,0.2)'
                  }} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Propositions de l'IA */}
      {selectedImage && (
        <div style={styles.punchlineSection}>
          <h3 style={styles.sectionTitle}>✨ Suggéré par l'IA (Mixy) :</h3>
          {aiPunchlines.map((p, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedPunchline(p)}
              style={{
                ...styles.punchlineCard, 
                borderColor: selectedPunchline === p ? '#00e676' : '#2d2d30',
                backgroundColor: selectedPunchline === p ? '#1f2d24' : '#202024'
              }}
            >
              {p}
            </div>
          ))}
          
          <div style={styles.actionButtonGroup}>
            <button style={styles.downloadBtn} onClick={downloadMeme}>💾 Télécharger le Mème</button>
            <button style={styles.resetBtn} onClick={() => setSelectedImage(null)}>Retirer l'image</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles CSS-in-JS professionnels alignés sur la charte sombre de l'application mobile
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#121214', color: '#ffffff', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { color: '#00e676', fontWeight: '900', fontSize: '2rem', margin: '0 0 10px 0' },
  subtitle: { color: '#8d8d99', fontSize: '14px', margin: '0 0 30px 0', textAlign: 'center' },
  previewContainer: { width: '100%', maxWidth: '500px', height: '350px', backgroundColor: '#202024', borderRadius: '14px', border: '1px solid #2d2d30', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: '20px' },
  canvas: { width: '100%', height: '100%', objectFit: 'contain' },
  placeholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8d8d99', fontSize: '15px' },
  fileInput: { display: 'none' },
  uploadButton: { backgroundColor: '#8257e5', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px', transition: '0.2s' },
  adjustmentPanel: { width: '100%', maxWidth: '500px', backgroundColor: '#1c1c1e', padding: '16px', borderRadius: '12px', border: '1px solid rgba(130, 87, 229, 0.3)', marginBottom: '20px', boxSizing: 'border-box' },
  panelTitle: { color: '#8d8d99', fontSize: '12px', fontWeight: 'bold', margin: '0 0 12px 0' },
  toolRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  btn: { backgroundColor: '#2d2d30', border: '1px solid #3a3a3c', color: '#fff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  divider: { width: '1px', height: '24px', backgroundColor: '#3a3a3c' },
  colorContainer: { display: 'flex', gap: '8px', overflowX: 'auto' },
  colorCircle: { width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', transition: '0.15s' },
  punchlineSection: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '10px' },
  sectionTitle: { color: '#00e676', fontSize: '14px', fontWeight: 'bold', margin: '10px 0' },
  punchlineCard: { padding: '14px', borderRadius: '10px', border: '1px solid #2d2d30', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: '0.2s' },
  actionButtonGroup: { display: 'flex', gap: '15px', marginTop: '15px' },
  downloadBtn: { flex: 1, backgroundColor: '#00e676', color: '#121214', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  resetBtn: { backgroundColor: 'transparent', border: 'none', color: '#ff5252', cursor: 'pointer', fontWeight: 'bold', padding: '10px' }
};
