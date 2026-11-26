import { useState, useCallback } from "react";
import axios from "axios";
import { GestorType } from "../types/manager.types";
import { GestorService } from "../services/managerService";
import authService from "../../auth/services/authService";
import { ManagerExpiredException, ManagerNotFoundException, ManagerAlreadyExistsException, ManagerErrorException } from "../exceptions/managerExceptions";

export function useManagerHook() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nomeList, setNomeList] = useState<Map<number, string[]>>(new Map());

    function getErrorMessage(error: unknown): string {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return new ManagerExpiredException().message;
            }

            else if (error.response?.status === 403) {
                return new ManagerNotFoundException().message;
            }
            else {
                return new ManagerErrorException().message;
            }
        }
        else {
            return new ManagerErrorException().message;
        }
    }


    const getNomeList = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const result: Map<number, string[]> = await authService.getNomeList();
            setNomeList(result);
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);


    const getRegisters = useCallback(async (): Promise<GestorType[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const result: GestorType[] = await GestorService.getGestor("", "");
            return result;
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deactivateGestor = async (idGestor: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await GestorService.deleteGestor(idGestor);
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const searchGestor = async (name: string, id: string | null) => {
        setIsLoading(true);
        setError(null);

        try {
            const result: GestorType[] = await GestorService.getGestor(name, id ?? "");
            return result;
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };
    return { getRegisters, deactivateGestor, searchGestor, getNomeList, isLoading, error, nomeList };
}
