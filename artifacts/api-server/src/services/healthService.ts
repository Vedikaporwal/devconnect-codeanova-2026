export interface HealthStatus {
  status: "ok";
}

export const getHealth = (): HealthStatus => ({ status: "ok" });