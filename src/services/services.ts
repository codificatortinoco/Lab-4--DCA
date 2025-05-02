import { Luchador } from "../types/Luchadores.types";

export async function fetchLuchador(nameOrId?: string | number): Promise<Luchador | Luchador[] | null> {
    const response = await fetch('../data/luchadores.json');
    if (!response.ok) {
        return null;
    }
    const luchadores: Luchador[] = await response.json();
    
    if (nameOrId === undefined) {
        return luchadores;
    }

    if (typeof nameOrId === 'number') {
        return luchadores.find(l => l.id === nameOrId) || null;
    }

    return luchadores.find(l => l.nombre.toLowerCase() === nameOrId.toLowerCase()) || null;
}