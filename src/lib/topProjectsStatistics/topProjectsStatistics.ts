import { groupBy, sumBy } from "../../utils/arrayUtils";
import { isStringNull } from "../../utils/stringUtils";

interface TopProjectsRequirements {
  project_name: string | undefined | null;
  duration: number;
}

export const getAllTimeTopProjects = (entries: TopProjectsRequirements[]) => {
  const byProject = groupBy(entries, (entry) => entry.project_name);
  return Object.keys(byProject)
    .map((project) => ({
      project_name: isStringNull(project) ? undefined : project,
      duration: sumBy(byProject[project], (entry) => entry.duration),
    }))
    .sort((a, b) => b.duration - a.duration);
};
