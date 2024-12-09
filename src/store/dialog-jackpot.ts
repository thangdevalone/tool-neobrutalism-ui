import {create} from 'zustand';

interface DialogState {
  isOpen: boolean; // Trạng thái mở/đóng của dialog
  dialogData: any; // Dữ liệu bên trong dialog
  callback: () => void; // Callback để xử lý hành động khi đóng dialog
  openDialog: (data?: any, callback?: () => void) => void; // Hàm mở dialog với dữ liệu và callback
  closeDialog: () => void; // Hàm đóng dialog
}

const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  dialogData: null,
  callback: () => {
  }, // Mặc định callback là một hàm rỗng

  // Hàm mở dialog với dữ liệu và callback (nếu có)
  openDialog: (data, callback) =>
    set({
      isOpen: true,
      dialogData: data || null,
      callback: callback || (() => {
      }), // Nếu không có callback, sử dụng một hàm rỗng
    }),

  // Hàm đóng dialog
  closeDialog: () =>
    set({
      isOpen: false,
      dialogData: null,
      callback: () => {
      }, // Reset callback khi đóng dialog
    }),
}));

export default useDialogStore;
