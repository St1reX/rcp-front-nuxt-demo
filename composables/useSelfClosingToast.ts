import { useToast } from "vue-toastification";
import type {
  ToastID,
  ToastContent,
  ToastOptions,
} from "vue-toastification/dist/types/types";

export const useSelfClosingToast = () => {
  const toast = useToast();

  let toastID: null | ToastID = null;

  const showToast = (content: ToastContent, options?: ToastOptions) => {
    if (toastID !== null) {
      toast.dismiss(toastID);
    }

    toastID = toast(content, options);

    return toastID;
  };

  const dismiss = () => {
    if (toastID !== null) {
      toast.dismiss(toastID);
    }
  };

  return { toast: showToast, dismiss };
};
