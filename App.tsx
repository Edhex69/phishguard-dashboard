// 1. Añadimos 'useEffect' a la importación de React. Lo necesitaremos.
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ThreatExplorer from './components/ThreatExplorer';
import ModelManagement from './components/ModelManagement';
// 2. Ya no importamos los datos de ejemplo, esta línea se elimina o comenta.
// import { INITIAL_THREAT_LOGS } from './constants'; 
import { ThreatLog, AnalysisResult } from './types';

// Los tipos 'View' y 'ExplorerFilters' se mantienen igual.
export type View = 'dashboard' | 'explorer' | 'models';
export type ExplorerFilters = {
    threatType?: string;
    rule?: string;
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  
  // 3. El estado de los logs ahora empieza como un array vacío.
  // Se llenará con los datos de la base de datos.
  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>([]);
  
  // 4. Añadimos un nuevo estado para saber si estamos cargando los datos.
  const [isLoading, setIsLoading] = useState(true); 
  
  const [explorerFilters, setExplorerFilters] = useState<ExplorerFilters>({});

  // 5. ESTE ES EL BLOQUE MÁS IMPORTANTE (useEffect)
  // Este código se ejecutará automáticamente UNA SOLA VEZ cuando la aplicación cargue.
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Hacemos una petición (fetch) a nuestra función de backend en Netlify
        const response = await fetch('/.netlify/functions/getThreats');
        if (!response.ok) {
          throw new Error('La respuesta de la API no fue exitosa');
        }
        const data: ThreatLog[] = await response.json();
        // Actualizamos el estado con los datos reales que recibimos
        setThreatLogs(data);
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
        // En caso de error, la lista de logs se quedará vacía.
      } finally {
        // Cuando todo termine (con éxito o error), dejamos de mostrar el mensaje de carga.
        setIsLoading(false);
      }
    };

    loadInitialData(); // Llamamos a la función para que se ejecute.
  }, []); // El array vacío [] al final es crucial, asegura que solo se ejecute una vez.

  const handleNewAnalysis = useCallback((result: AnalysisResult) => {
    setThreatLogs(prevLogs => [result, ...prevLogs]);
  }, []);

  const handleNavigate = (view: View) => {
    setActiveView(view);
    setExplorerFilters({});
  };

  const handleNavigateWithFilters = (view: View, filters: ExplorerFilters) => {
      setExplorerFilters(filters);
      setActiveView(view);
  };

  const renderView = () => {
    // 6. Mientras los datos estén cargando, mostramos un mensaje al usuario.
    if (isLoading) {
      return <div className="text-center p-10 text-text-secondary">Conectando y cargando datos de amenazas...</div>;
    }

    switch (activeView) {
      case 'explorer':
        // Pasamos 'threatLogs' que ahora contiene los datos reales
        return <ThreatExplorer allLogs={threatLogs} initialFilters={explorerFilters} onNavigateWithFilters={handleNavigateWithFilters} />;
      case 'models':
        return <ModelManagement />;
      case 'dashboard':
      default:
        // Pasamos 'threatLogs' que ahora contiene los datos reales
        return <Dashboard threatLogs={threatLogs} onNewAnalysis={handleNewAnalysis} onNavigateWithFilters={handleNavigateWithFilters} />;
    }
  };

  return (
    <div className="dark flex h-screen bg-background font-sans">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;