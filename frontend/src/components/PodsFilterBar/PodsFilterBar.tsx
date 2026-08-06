type PodsFilterBarProps = {
    searchText: string;
    selectedNamespace: string;
    selectedStatus: string;
    sortData: string;
    onSearchChange: (value: string) => void;
    onNamespaceChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSortChange: (value: string) => void;
    uniqueNamespaces: string[];
    uniqueStatuses: string[];
};


function PodsFilterBar({
    searchText,
    selectedNamespace,
    selectedStatus,
    sortData,
    onSearchChange,
    onNamespaceChange,
    onStatusChange,
    onSortChange,
    uniqueNamespaces,
    uniqueStatuses,
}: PodsFilterBarProps) {
    return (
        <div className="pods-filter-row">
            <div className="pods-filter-item">
                <div>
                    <label htmlFor="pod-search">Search pods by name:</label>
                    <input
                        id="pod-search"
                        type="text"
                        value={searchText}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Filter by name"
                    />
                </div>

                <div>
                    <label htmlFor="namespace-filter">Namespace:</label>
                    <select
                        id="namespace-filter"
                        value={selectedNamespace}
                        onChange={(event) => onNamespaceChange(event.target.value)}
                    >
                        <option value="all">All</option>
                        {uniqueNamespaces.map((namespace) => (
                            <option key={namespace} value={namespace}>
                                {namespace}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="pod-status-filter">PodStatus:</label>
                    <select
                        id="pod-status-filter"
                        value={selectedStatus}
                        onChange={(event) => onStatusChange(event.target.value)}
                    >
                        <option value="all">All</option>
                        {uniqueStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="sort-filter">Sort:</label>
                    <select
                        id="sort-filter"
                        value={sortData}
                        onChange={(event) => onSortChange(event.target.value)}
                    >
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                    </select>
                </div>
                
            </div>
        </div>
    );
}

export default PodsFilterBar;

        