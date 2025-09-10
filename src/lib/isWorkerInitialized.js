import { pdfjs } from 'react-pdf';

const isWorkerInitialized = () => {
    return typeof pdfjs.GlobalWorkerOptions.workerSrc === 'string';
};

export default isWorkerInitialized