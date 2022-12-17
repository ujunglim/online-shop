const filePicker = document.querySelector("#image-upload-control input");
const imagePreviewElement = document.querySelector("#image-upload-control img");

function handlePreview() {
  const files = filePicker.files; // on local, not in server
  // 선택하고 취소한경우
  if (!files || files.length === 0) {
    imagePreviewElement.style.display = "none";
    return;
  }
  imagePreviewElement.src = URL.createObjectURL(files[0]);
  imagePreviewElement.style.display = "block";
}

filePicker.addEventListener("change", handlePreview);
