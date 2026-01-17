import { ProjectIdView } from "@/feature/projects/components/project-id-view";
import { projectId } from "@/types";

const Page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;
  return <ProjectIdView projectId={projectId as projectId} />;
};
export default Page;
