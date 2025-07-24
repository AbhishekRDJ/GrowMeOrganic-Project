
import { SelectionProvider } from './context/SelectionContext';
import { ArtworksTable } from './components/ArtworksTable';

export default function App() {
  return (
    <SelectionProvider>
      <ArtworksTable />
    </SelectionProvider>
  );
}