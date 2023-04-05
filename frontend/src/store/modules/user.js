export const namespaced = true;
export const state = {
  user: JSON.parse(localStorage.getItem('user')) || {}
}
