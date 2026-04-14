export const generateSlug = (item) => {
  const parts = [
    item.name,
    item.country || "unk",
    item.year || "0000",
    item.design || "std"
  ];
  return parts
    .join("-")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-") // mantem só alfanumérico
    .replace(/(^-|-$)/g, ""); // remove traços no começo e no fim
};

export const resizeAndCompressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject("Nenhum arquivo providenciado.");
    if (!file.type.startsWith("image/")) return reject("O arquivo não é uma imagem válida.");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert back to base64, usually smaller than raw base64 upload
        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        // Check size (approximate)
        const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
        
        // If it's still bigger than ~300KB we can try lower quality recursively but 
        // 800px at 0.7 jpeg is typically under 150kb.
        resolve({
           dataUrl,
           sizeKb: (sizeInBytes / 1024).toFixed(2)
        });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const measureLocalStorage = () => {
  let total = 0;
  for (let x in localStorage) {
    if (localStorage.hasOwnProperty(x)) {
      total += ((localStorage[x].length + x.length) * 2);
    }
  }
  const max = 5 * 1024 * 1024; // ~5MB
  return {
     usedBytes: total,
     maxBytes: max,
     usedMb: (total / (1024 * 1024)).toFixed(2),
     maxMb: 5,
     percentage: Math.min(((total / max) * 100), 100).toFixed(1)
  };
};
