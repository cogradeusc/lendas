function showNotification(message) {
  const notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"));
  document.getElementById("notificationMessage").textContent = message;
  notificationModal.show();
}

function showConfirmation(message, callback) {
  const confirmationMessageEl = document.getElementById("confirmationMessage");
  const btnConfirmAction = document.getElementById("btnConfirmAction");
  const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"));
  confirmationMessageEl.textContent = message;
  btnConfirmAction.onclick = () => {
    callback();
    confirmationModal.hide();
  };
  confirmationModal.show();
}
