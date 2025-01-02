import { AuditService } from "$lib/services/audit-service";
import type { UserAuditDTO } from "../../../../declarations/backend/backend.did";

function createAuditStore() {
  async function getUserAudit(page: number): Promise<any> {
    return new AuditService().getUserAudit(page);
  }

  return {
    getUserAudit,
  };
}

export const auditStore = createAuditStore();
