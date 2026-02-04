import { CameraProvider } from "./CameraProvider";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CameraProvider>
      {children}
    </CameraProvider>
  );
};

export default AppProviders;