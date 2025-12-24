/**
 * App Component
 * Root application component with ReminderProvider
 */

import { ReminderProvider } from './Components/context/ReminderContext';
import ReminderApp from './Components/ui/ReminderApp';
import './App.css';

function App() {
  return (
    <ReminderProvider>
      <ReminderApp />
    </ReminderProvider>
  );
}

export default App;
