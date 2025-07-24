import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Artwork, PaginationInfo } from '../types/Artwork';

export function useArtworks(page: number) {
    const [data, setData] = useState<Artwork[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0, limit: 12, offset: 0, total_pages: 0, current_page: page
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`https://api.artic.edu/api/v1/artworks?page=${page}`)
            .then(res => {
                const { data: artworks, pagination } = res.data;
                setData(artworks);
                setPagination(pagination);
            })
            .finally(() => setLoading(false));
    }, [page]);

    return { data, pagination, loading };
}