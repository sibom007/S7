import { ProjectIdLayout } from "@/feature/projects/components/project-id-layout";
import { projectId } from "@/types";

interface Props {
  params: Promise<{ projectId: string }>;
  children: React.ReactNode;
}

const Layout = async ({ children, params }: Props) => {
  const { projectId } = await params;

  return (
    <ProjectIdLayout projectId={projectId as projectId}>
      {children}
    </ProjectIdLayout>
  );
};

export default Layout;
