import { useState, useCallback } from "react";
import axios from "axios";
import { GestorType } from "../types/gestor.types";
import { GestorService } from "../services/gestorService";
import authService from "../../auth/services/authService";

export function useGestorHook() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nomeList, setNomeList] = useState<Map<number, string[]>>(new Map());

    const getNomeList = useCallback(async (): Promise<Map<number, string[]>> => {
        setIsLoading(true);
        setError(null);
        try {
            const result: Map<number, string[]> = await authService.getNomeList();
            setNomeList(result);
        } catch (error) {
            setError("Ocorreu um erro ao obter os dados");
        } finally {
            setIsLoading(false);
        }
        return nomeList;
    }, []);


    const getRegisters = useCallback(async (): Promise<GestorType[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const result: GestorType[] = await GestorService.getGestor("", "");
            return result;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ??
                    "Ocorreu um erro interno no servidor";
                setError(message);
            } else {
                setError("Ocorreu um erro ao obter os dados");
            }
            throw error;
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
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ??
                    "Ocorreu um erro interno no servidor";
                setError(message);
            } else {
                setError("Ocorreu um erro ao obter os dados");
            }
            throw error;
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
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ??
                    "Ocorreu um erro interno no servidor";
                setError(message);
            } else {
                setError("Ocorreu um erro ao obter os dados");
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    return { getRegisters, deactivateGestor, searchGestor, getNomeList, isLoading, error };
}
