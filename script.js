const photoInput = document.getElementById("photo-input");
const photoGrid = document.getElementById("photo-grid");

if (photoInput && photoGrid) {
  photoInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Uploaded trip photo";
        photoGrid.prepend(img);
      };
      reader.readAsDataURL(file);
    });
    photoInput.value = "";
  });
}
