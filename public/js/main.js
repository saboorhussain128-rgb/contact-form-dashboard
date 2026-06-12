/**
 * Message Character Counter
 */

const messageField = document.getElementById("message");
const charCount = document.getElementById("charCount");

if (messageField && charCount) {
  // Initial value
  charCount.textContent = messageField.value.length;

  // Update while typing
  messageField.addEventListener("input", () => {
    charCount.textContent = messageField.value.length;
  });
}