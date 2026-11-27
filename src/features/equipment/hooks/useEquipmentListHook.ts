import { useCallback, useState } from "react";
import axios from "axios";

import equipmentService from "../services/equipmentService";
import { EquipmentPaginator } from "../types/equipment.types";
import {
  EquipmentErrorException,
  EquipmentExpiredException,
  EquipmentForbiddenException,
} from "../exceptions/equipmentExceptions";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new EquipmentExpiredException().message;
    }
    if (error.response?.status === 403) {
      return new EquipmentForbiddenException().message;
    }
  }

  return new EquipmentErrorException().message;
}

export function useEquipmentListHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginator, setPaginator] = useState<EquipmentPaginator>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const listEquipments = useCallback(
    async (page = 1, perPage = 0, serial = "") => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await equipmentService.listEquipments(
          page,
          perPage,
          "",
          serial,
        );
        const equipments = result?.equipamentos ?? result;

        setPaginator({
          currentPage: equipments?.current_page ?? 1,
          lastPage: equipments?.last_page ?? 1,
          total: equipments?.total ?? 0,
          from: equipments?.from ?? 0,
          to: equipments?.to ?? 0,
        });

        return equipments;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { listEquipments, isLoading, error, paginator };
}
