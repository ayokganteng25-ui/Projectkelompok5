// Fungsi untuk menyalin link halaman ini ke clipboard
function copyPageLink() {
  const currentUrl = window.location.href;

  navigator.clipboard.writeText(currentUrl).then(() => {
    showToast();
  }).catch(err => {
    console.error('Gagal menyalin link: ', err);
  });
}

// Fungsi untuk menampilkan pesan toast
function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}