"use client";
import { useRouter } from "next/navigation";

type ModalProps = React.PropsWithChildren<{
  title?: string;
}>;

const Modal = (props: ModalProps) => {
  const { title = "模态窗口", children } = props;
  const router = useRouter();
  return (
    <div className="fixed w-screen h-screen left-0 top-0 bg-[rgba(0,0,0,0.4)]">
      <div className="bg-white w-[200px] h-[200px] left-4 top-4 absolute box-border p-4">
        <div className="flex w-full justify-between">
          <h1>{title}</h1>
          <button
            onClick={() => {
              router.back();
            }}
          >
            点击关闭
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
