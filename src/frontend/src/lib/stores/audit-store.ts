import { AuditService } from "$lib/services/audit-service";

function createAuditStore() {
  async function getUserAudit(page: number): Promise<any> {
    return new AuditService().getUserAudit(page);
  }

  return {
    getUserAudit,
  };
}

export const auditStore = createAuditStore();
