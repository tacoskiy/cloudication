import { CameraProvider } from "@/features/camera/providers/CameraProvider";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CameraProvider>
      {children}
    </CameraProvider>
  );
};

export default AppProviders;