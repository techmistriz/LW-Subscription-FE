
import { forgotPassword, resetPassword } from "@/lib/api/auth/auth";
import { AppDispatch } from "../store/store";
import { resetFail, resetStart, resetSuccess } from "../store/slices/resetSlice";


/* FORGOT PASSWORD */
export const forgotPasswordAction =
  (email: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(resetStart());

      const res = await forgotPassword(email);

      if (!res?.status) {
        throw new Error(res?.message);
      }

      dispatch(resetSuccess(res.message));
    } catch (err: any) {
      dispatch(resetFail(err.message));
    }
  };

/* RESET PASSWORD */
export const resetPasswordAction =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(resetStart());

      const res = await resetPassword(data);

      if (!res?.status) {
        throw new Error(res?.message);
      }

      dispatch(resetSuccess("Password updated successfully"));
    } catch (err: any) {
      dispatch(resetFail(err.message));
    }
  };