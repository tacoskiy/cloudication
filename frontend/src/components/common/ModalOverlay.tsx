import clsx from "clsx";

const ModalOverlay = () => {
  const visibleState = true;

  return (
    <div className={
      clsx(
        visibleState
          ? "opacity-100"
          : "opacity-0",
        "bg-bg-invert-overlay backdrop-blur-md fixed top-0 left-0 w-full h-dvh z-100",
      )
    }></div>
  )
}

export default ModalOverlay;