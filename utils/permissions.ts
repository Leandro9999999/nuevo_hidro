// utils/permissions.ts
import { SessionUser } from "../types";

/**
 * Verifica si el usuario tiene alguno de los roles requeridos.
 * @param user Usuario autenticado o null
 * @param requiredRoles Lista de roles permitidos
 * @returns true si el usuario tiene permiso, false en caso contrario
 */
export function hasPermission(
  user: SessionUser | null,
  requiredRoles: string[]
): boolean {
  if (!user) return false;
  return requiredRoles.includes(user.role);
}
