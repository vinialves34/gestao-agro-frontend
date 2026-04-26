import Swal from "sweetalert2";

export const ToastAlert = Swal.mixin({
  toast: true,
  position: 'top-end',
  customClass: {
    popup: 'colored-toast',
  },
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export const Sweetalert = Swal.mixin({
  toast: false,
});