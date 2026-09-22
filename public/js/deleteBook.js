async function deleteBook(id) {
  const response = await fetch(`/books/${id}`, { method: "DELETE" });

  if (!response.ok) {
    return;
  }

  document.querySelector(`.book-card[data-id="${id}"]`).remove();
}
