import { useCallback, useState } from "react";
import axios from "axios";
import { z } from "zod";

import equipmentService from "../services/equipmentService";
import statusService from "../../status/services/statusService";
import userService from "../../user/services/userService";
import categoryService from "../../categories/services/categoryService";
import { equipmentTypeService } from "../../equipmentType/services/equipmentTypeService";
import equipmentHistoryService from "../../equipmentHistory/services/equipmentHistoryService";
import { Status } from "../../status/types/status.types";
import { UsuarioParaSelecao } from "../../user/types/user.types";
import {
  Equipment,
  EquipmentFormData,
  EquipmentFormErrors,
  SelectOption,
} from "../types/equipment.types";
import {
  EquipmentErrorException,
  EquipmentExpiredException,
  EquipmentForbiddenException,
  EquipmentNotFoundException,
} from "../exceptions/equipmentExceptions";

const equipmentSchema = z.object({
  eqi_name: z
    .string()
    .trim()
    .min(1, "equipment.validation.nameRequired")
    .max(255, "equipment.validation.nameMax"),
  eqi_descricao: z
    .string()
    .trim()
    .min(1, "equipment.validation.descriptionRequired")
    .max(255, "equipment.validation.descriptionMax"),
  eqi_serie: z
    .string()
    .trim()
    .min(1, "equipment.validation.serialRequired")
    .max(255, "equipment.validation.serialMax")
    .regex(/^\d+$/, "equipment.validation.serialDigits"),
  eqi_status_id: z.coerce
    .number({ error: "equipment.validation.statusRequired" })
    .int("equipment.validation.statusInvalid")
    .positive("equipment.validation.statusRequired"),
  categoria_id: z.coerce
    .number({ error: "equipment.validation.categoryRequired" })
    .int("equipment.validation.categoryInvalid")
    .positive("equipment.validation.categoryRequired"),
  tipo_equipamento_id: z.coerce
    .number({ error: "equipment.validation.typeRequired" })
    .int("equipment.validation.typeInvalid")
    .positive("equipment.validation.typeRequired"),
  imagem_url: z
    .union([z.string(), z.null(), z.undefined()])
    .optional()
    .transform((val) => {
      if (val == null) return null;
      const trimmed = String(val).trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
  usuario_id: z
    .string()
    .trim()
    .min(1, "equipment.validation.userRequired")
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      "equipment.validation.userInvalid",
    ),
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new EquipmentExpiredException().message;
    }
    if (error.response?.status === 403) {
      return new EquipmentForbiddenException().message;
    }
    if (error.response?.status === 404) {
      return new EquipmentNotFoundException().message;
    }
  }

  return new EquipmentErrorException().message;
}

function extractList(
  response: unknown,
  keys: string[] = [],
): Record<string, unknown>[] {
  if (Array.isArray(response)) return response as Record<string, unknown>[];
  if (!response || typeof response !== "object") return [];

  const obj = response as Record<string, unknown>;
  for (const key of keys) {
    if (Array.isArray(obj[key])) {
      return obj[key] as Record<string, unknown>[];
    }
  }

  if (obj.data && typeof obj.data === "object") {
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    const dataObj = obj.data as Record<string, unknown>;
    if (Array.isArray(dataObj.data)) {
      return dataObj.data as Record<string, unknown>[];
    }
  }

  return [];
}

function mapFieldError(field: string): keyof EquipmentFormErrors {
  const map: Record<string, keyof EquipmentFormErrors> = {
    eqi_name: "nome",
    eqi_nome: "nome",
    eqi_descricao: "descricao",
    eqi_serie: "serie",
    eqi_status_id: "status_id",
    image: "imagem_file",
    imagem: "imagem_file",
  };
  return map[field] ?? (field as keyof EquipmentFormErrors);
}

function extractImageUrl(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const data = response as Record<string, unknown>;
  const nested =
    data.data && typeof data.data === "object"
      ? (data.data as Record<string, unknown>)
      : null;

  const url =
    data.imagepath ??
    data.image_path ??
    data.url ??
    data.imagem_url ??
    data.path ??
    nested?.imagepath ??
    nested?.url ??
    null;

  return url != null ? String(url) : null;
}

function sameEquipment(item: Equipment | null | undefined, id: string) {
  if (!item) return false;
  return String(item.eqi_id ?? item.id ?? "") === String(id);
}

export function useEquipmentFormHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputsErrors, setInputsErrors] = useState<EquipmentFormErrors>({});
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [userList, setUserList] = useState<UsuarioParaSelecao[]>([]);
  const [categoryList, setCategoryList] = useState<SelectOption[]>([]);
  const [typeList, setTypeList] = useState<SelectOption[]>([]);

  const validate = (data: unknown): Equipment | null => {
    const result = equipmentSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      const errors: EquipmentFormErrors = {};
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        const message = messages?.[0];
        if (message) {
          errors[mapFieldError(field)] = message;
        }
      });
      setInputsErrors(errors);
      return null;
    }

    setInputsErrors({});
    return {
      eqi_name: result.data.eqi_name,
      eqi_descricao: result.data.eqi_descricao,
      eqi_serie: result.data.eqi_serie,
      eqi_status_id: result.data.eqi_status_id,
      categoria_id: result.data.categoria_id,
      tipo_equipamento_id: result.data.tipo_equipamento_id,
      imagem_url: result.data.imagem_url ?? null,
      usuario_id: result.data.usuario_id,
    };
  };

  const loadFormOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    setError(null);

    try {
      const [statusRes, usersRes, categoriesRes, typesRes] = await Promise.all([
        statusService.listStatuses(),
        userService.listUsers(),
        categoryService.getCategories("", null, 1, 0),
        equipmentTypeService.getEquipmentTypes("", "", 1),
      ]);

      const statusFormatted: Status[] = extractList(statusRes, [
        "status",
        "statuses",
        "data",
      ])
        .filter((item) => item?.id != null)
        .map((item) => ({
          id: Number(item.id),
          nome: String(
            item.nome ?? item.name ?? item.descricao ?? `Status #${item.id}`,
          ),
        }));

      const usersFormatted: UsuarioParaSelecao[] = extractList(usersRes, [
        "users",
        "usuarios",
        "data",
      ])
        .filter((item) => item?.id != null)
        .map((item) => ({
          id: String(item.id),
          nome: String(item.nome ?? item.name ?? item.email ?? item.id),
        }));

      const categoriesFormatted: SelectOption[] = extractList(categoriesRes, [
        "categorias",
        "categoria",
        "data",
      ])
        .filter((item) => item?.id != null)
        .map((item) => ({
          id: item.id as string | number,
          nome: String(item.nome ?? item.name ?? `Categoria #${item.id}`),
        }));

      const typesFormatted: SelectOption[] = extractList(typesRes, [
        "tipo_equipamentos",
        "tipos",
        "data",
      ])
        .filter((item) => item?.id != null)
        .map((item) => ({
          id: item.id as string | number,
          nome: String(item.nome ?? item.name ?? `Tipo #${item.id}`),
        }));

      setStatusList(statusFormatted);
      setUserList(usersFormatted);
      setCategoryList(categoriesFormatted);
      setTypeList(typesFormatted);

      return {
        statusList: statusFormatted,
        userList: usersFormatted,
        categoryList: categoriesFormatted,
        typeList: typesFormatted,
      };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File | null | undefined) => {
    if (!(file instanceof File)) {
      setInputsErrors({ imagem_file: "equipment.validation.imageRequired" });
      return undefined;
    }

    try {
      const result = await equipmentService.uploadImage(file);
      const url = extractImageUrl(result);
      if (!url) {
        throw new EquipmentErrorException();
      }
      return url;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const createEquipment = useCallback(
    async (data: EquipmentFormData, imageFile?: File | null) => {
      setIsLoading(true);
      setError(null);

      const payload = validate(data);
      if (!payload) {
        setIsLoading(false);
        return undefined;
      }

      try {
        const imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          setIsLoading(false);
          return undefined;
        }

        const equipment: Equipment = {
          ...payload,
          imagem_url: imageUrl,
        };

        const result = await equipmentService.createEquipment(equipment);
        const equipmentId = String(
          result?.eqi_id ??
            result?.id ??
            result?.data?.eqi_id ??
            result?.data?.id ??
            "",
        );
        const statusId = String(
          result?.eqi_status_id ?? result?.status_id ?? equipment.eqi_status_id,
        );
        const userId = String(result?.usuario_id ?? equipment.usuario_id);

        if (equipmentId) {
          await equipmentHistoryService.inserirHistorico(
            equipmentId,
            statusId,
            userId,
          );
        }

        return result;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [uploadImage],
  );

  const updateEquipment = useCallback(
    async (
      id: string | number,
      data: EquipmentFormData,
      imageFile?: File | null,
    ) => {
      setIsLoading(true);
      setError(null);

      const payload = validate(data);
      if (!payload) {
        setIsLoading(false);
        return undefined;
      }

      try {
        let imageUrl = payload.imagem_url;
        if (imageFile instanceof File) {
          const uploaded = await uploadImage(imageFile);
          if (!uploaded) {
            setIsLoading(false);
            return undefined;
          }
          imageUrl = uploaded;
        }

        const equipment: Equipment = {
          ...payload,
          imagem_url: imageUrl ?? null,
        };

        const result = await equipmentService.updateEquipment(id, equipment);
        const equipmentId = String(result?.eqi_id ?? result?.id ?? id);
        const statusId = String(
          result?.eqi_status_id ?? result?.status_id ?? equipment.eqi_status_id,
        );
        const userId = String(result?.usuario_id ?? equipment.usuario_id);

        await equipmentHistoryService.inserirHistorico(
          equipmentId,
          statusId,
          userId,
        );

        return result;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [uploadImage],
  );

  const loadEquipment = useCallback(
    async (
      id: string,
      preloaded?: Equipment | null,
    ): Promise<Equipment> => {
      setIsLoadingData(true);
      setError(null);

      try {
        await loadFormOptions();

        if (sameEquipment(preloaded, id) && preloaded) {
          return preloaded;
        }

        const result = await equipmentService.listEquipments(1, 0);
        const equipments = result?.equipamentos ?? result;
        const items = Array.isArray(equipments?.data)
          ? equipments.data
          : Array.isArray(equipments)
            ? equipments
            : [];

        const found = items.find((item: Equipment) =>
          sameEquipment(item, id),
        );

        if (!found) {
          throw new EquipmentNotFoundException();
        }

        return found;
      } catch (err) {
        const message =
          err instanceof EquipmentNotFoundException
            ? err.message
            : getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoadingData(false);
      }
    },
    [loadFormOptions],
  );

  return {
    loadFormOptions,
    loadEquipment,
    createEquipment,
    updateEquipment,
    statusList,
    userList,
    categoryList,
    typeList,
    isLoading,
    isLoadingOptions,
    isLoadingData,
    error,
    inputsErrors,
  };
}
