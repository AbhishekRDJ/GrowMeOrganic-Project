import React, { useContext, useState, useRef } from 'react';
import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { useArtworks } from '../hooks/useArtworks';
import { SelectionContext } from '../context/SelectionContext';

export const ArtworksTable: React.FC = () => {

    const [page, setPage] = useState(1);
    const { data, pagination, loading } = useArtworks(page);



    const { state, dispatch } = useContext(SelectionContext);

    const overlayRef = useRef<OverlayPanel>(null);
    const [bulkCount, setBulkCount] = useState<number>(0);
    const onSelectionChange = (e: { value: any[] }) => {
        const visibleIds = data.map(item => item.id);
        visibleIds.forEach(id => {
            dispatch({ type: 'REMOVE_ID', id });
        });
        const selectedOnPage = e.value.map(item => item.id);
        dispatch({ type: 'ADD_IDS', ids: selectedOnPage });
    };




    const handleBulkSelect = async () => {
        overlayRef.current?.hide();
        let remaining = bulkCount;
        let currentPage = 1;
        const toAdd: number[] = [];
        while (remaining > 0 && currentPage <= pagination.total_pages) {
            const res = await fetch(
                `https://api.artic.edu/api/v1/artworks?page=${currentPage}`
            );
            const json = await res.json();
            const ids = json.data.map((a: any) => a.id);
            const slice = ids.slice(0, Math.min(remaining, ids.length));
            toAdd.push(...slice);
            remaining -= slice.length;

            currentPage++;
        }
        dispatch({ type: 'ADD_IDS', ids: toAdd });
    };

    const onPageChange = (event: DataTablePageEvent) => {

        setPage((event.page ?? 0) + 1);
    };

    return (
        <div className="p-shadow-2 p-m-4 p-card">
            <h2 className="p-mb-3 p-text-center">🎨 Artworks Gallery</h2>
            <div className="p-mt-4 p-text-center">
                <p>
                    Page {pagination.current_page} of {pagination.total_pages}
                </p>
                <p>Total Artworks: {pagination.total}</p>
            </div>
            <div>
                <DataTable
                    value={data}
                    paginator
                    lazy
                    rowHover
                    scrollable
                    scrollHeight="500px"
                    rows={12}
                    totalRecords={pagination.total}
                    first={(page - 1) * 12}
                    onPage={onPageChange}
                    loading={loading}
                    dataKey="id"
                    selectionMode="checkbox"
                    selection={data.filter(d => state.selectedIds.has(d.id))}
                    onSelectionChange={onSelectionChange}
                >
                    <Column
                        selectionMode="multiple"
                        headerClassName="p-text-center"
                        bodyClassName="p-text-center"
                        header={
                            <div className="p-d-flex p-ai-center">
                                <Button
                                    icon="pi pi-angle-down"
                                    className="p-button-text"
                                    onClick={e => overlayRef.current?.toggle(e)}
                                />
                            </div>
                        }
                    />
                    <Column field="title" header="Title" />
                    <Column field="place_of_origin" header="Origin" />
                    <Column field="artist_display" header="Artist" />
                    <Column field="inscriptions" header="Inscriptions" />
                    <Column field="date_start" header="Start Date" />
                    <Column field="date_end" header="End Date" />
                </DataTable>

                <OverlayPanel ref={overlayRef} showCloseIcon>
                    <div className="p-p-3">
                        <h4>Select Rows</h4>
                        <InputNumber
                            value={bulkCount}
                            onValueChange={e => setBulkCount(e.value || 0)}
                            placeholder="Number of rows"
                        />
                        <Button
                            label="Confirm"
                            className="p-mt-2 mb-1 ml-2 p-button-sm p-button-success"
                            onClick={handleBulkSelect}
                        />
                    </div>
                </OverlayPanel>
            </div>

        </div>
    );
};