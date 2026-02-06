import PermissionStatusView from "@/features/permissions/components/PermissionStatusView";

export default function PermissionsPage() {
  return (
    <section className="w-full h-fit flex justify-center items-center px-3 pt-8 min-h-[70vh]">
      <PermissionStatusView />
    </section>
  );
}
