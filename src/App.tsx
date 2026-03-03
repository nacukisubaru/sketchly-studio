import Editor from '@components/Editor/Editor';

import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/canvases/:id" element={<Editor />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
