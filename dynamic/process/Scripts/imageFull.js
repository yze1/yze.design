// Select all images within imgContainer class
document.querySelectorAll('.imgContainer img').forEach(img => {
    img.addEventListener('click', () => openModal(img));
});
document.querySelectorAll('.twoImgContainer img').forEach(img => {
    img.addEventListener('click', () => openModal(img));
});
document.querySelectorAll('.threeImgContainer img').forEach(img => {
    img.addEventListener('click', () => openModal(img));
});

function openModal(image) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    modal.style.display = "flex";
    modalImage.src = image.src; // Set the modal image source to the clicked image's source
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none"; // Hide the modal
}