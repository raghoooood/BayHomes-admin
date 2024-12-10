import type { BaseKey } from "@refinedev/core";

export interface AgentCardProp {
  id?: BaseKey | undefined;
  name: string;
  email: string;
  avatar: string;
  noOfProperties: number;
  noOfProjects: number,
  noOfAreas: number,
  noOfDevelopers: number,
}

export interface InfoBarProps {
  icon: ReactNode;
  name: string;
}
